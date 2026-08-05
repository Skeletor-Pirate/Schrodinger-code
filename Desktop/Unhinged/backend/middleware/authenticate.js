const passport = require('../passport-config');

/**
 * Authentication Middleware
 * Ensures that the user is authenticated before accessing protected routes
 */

const authenticate = (req, res, next) => {
  // Use passport's authenticate middleware
  passport.authenticate('session', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // If no user is authenticated, return 401 Unauthorized
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required to access this resource'
      });
    }

    // Attach user to request object
    req.user = user;
    return next();
  })(req, res, next);
};

// Google OAuth authentication routes
const googleAuth = (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: '/login?error=auth_failed',
    successRedirect: '/dashboard'
  })(req, res, next);
};

module.exports = {
  authenticate,
  googleAuth,
  googleAuthCallback
};