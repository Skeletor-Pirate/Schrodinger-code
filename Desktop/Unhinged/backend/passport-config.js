const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { userManagementService } = require('./services/admin/index');

/**
 * Passport.js Google OAuth Configuration
 * Configures Google OAuth 2.0 authentication strategy
 */

// Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user information from Google profile
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const displayName = profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim();
        const photoUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
        const googleId = profile.id;

        if (!email) {
          return done(new Error('No email found in Google profile'), null);
        }

        // Check if user exists by email or googleId
        let existingUser = null;
        try {
          // First try to find by googleId
          existingUser = await userManagementService.findByGoogleId(googleId);

          // If not found by googleId, try by email
          if (!existingUser) {
            existingUser = await userManagementService.findByEmail(email);
          }
        } catch (error) {
          // Service methods might not exist yet, we'll handle this gracefully
          console.warn('User service methods not fully implemented yet:', error.message);
        }

        if (existingUser) {
          // Block login if user is suspended or banned
          if (existingUser.status === 'suspended' || existingUser.status === 'banned') {
            return done(new Error('Access revoked. Your account has been suspended or banned.'), null);
          }
          // User exists, return the user
          return done(null, existingUser);
        } else {
          // Check if this is the bootstrapped admin account
          const isAdminEmail = email === 'aryanarora26110@gmail.com';
          
          const newUserData = {
            email: email,
            display_name: displayName || email.split('@')[0],
            avatar_url: photoUrl,
            google_id: googleId,
            status: isAdminEmail ? 'active' : 'pending', // Admin is auto-active, others require approval
            role: isAdminEmail ? 'admin' : 'member', // Admin role for the creator, others default to member
            primary_workspace_id: null // Will be set during onboarding
          };

          try {
            // Create user record
            const pendingUser = await userManagementService.createPendingUser(newUserData);
            return done(null, pendingUser);
          } catch (error) {
            return done(error, null);
          }
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userManagementService.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;