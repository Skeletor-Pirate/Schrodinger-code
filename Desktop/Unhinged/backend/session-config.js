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
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
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

/**
 * Session middleware configuration
 */
const sessionConfig = session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
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