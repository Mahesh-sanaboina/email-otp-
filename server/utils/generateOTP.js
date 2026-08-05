const crypto = require('crypto');

/**
 * Generate a cryptographically secure 6-digit numeric OTP string
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
};

module.exports = generateOTP;
