const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

/**
 * Session Configuration
 * Configures secure session management with Redis store
 */

let redisClient;

// Initialize Redis client
const initRedis = () => {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error('REDIS_URL environment variable is required');
  }

  redisClient = redis.createClient({
    url: redisUrl
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });

  redisClient.connect().catch(console.error);
};

// Initialize Redis connection
initRedis();

// Session store configuration
const sessionStore = new RedisStore({
  client: redisClient,
  prefix: 'unhinged:sess:',
  ttl: 600 // 10 minutes
});

// Validate session secret
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET environment variable is required in production');
  }
  // In development, we'll allow a fallback but log a warning
  console.warn('WARNING: SESSION_SECRET not set using fallback. This is insecure and should not be used in production.');
}

/**
 * Session middleware configuration
 */
const sessionConfig = session({
  store: sessionStore,
  secret: sessionSecret || 'fallback-secret-for-development-only-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS attacks
    sameSite: 'lax', // CSRF protection
    maxAge: 10 * 60 * 1000 // 10 minutes
  },
  rolling: true, // Reset expiration on activity
  name: 'unhinged.sid' // Custom session cookie name
});

module.exports = {
  sessionConfig,
  initRedis,
  redisClient
};