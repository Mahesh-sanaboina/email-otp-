const jwt = require('jsonwebtoken');

/**
 * Generate Access Token
 * @param {string} userId 
 * @returns {string} JWT Token
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET || 'dev_access_secret_key_89234789234792347923479234',
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
  );
};

/**
 * Generate Refresh Token
 * @param {string} userId 
 * @returns {string} JWT Token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_key_102938401923840192384091238',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

/**
 * Set Auth HTTP-Only Cookies
 * @param {Response} res 
 * @param {string} accessToken 
 * @param {string} refreshToken 
 */
const sendTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Access Token Cookie (15 min)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000
  });

  // Refresh Token Cookie (7 days)
  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }
};

/**
 * Clear Auth Cookies
 * @param {Response} res 
 */
const clearTokenCookies = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax'
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  sendTokenCookies,
  clearTokenCookies
};
