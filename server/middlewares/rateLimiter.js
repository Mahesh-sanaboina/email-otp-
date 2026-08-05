const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Strict Rate Limiter for Authentication / Sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 auth requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login or verification attempts. Please try again after 15 minutes.'
  }
});

// OTP Resend Limiter
const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2, // Max 2 resends per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Please wait 60 seconds before requesting a new OTP.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  otpLimiter
};
