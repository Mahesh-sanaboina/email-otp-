const express = require('express');
const router = express.Router();
const {
  register,
  verifyEmail,
  login,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  logout,
  refreshToken
} = require('../controllers/authController');
const {
  registerValidator,
  verifyOTPValidator,
  loginValidator,
  emailOnlyValidator,
  resetPasswordValidator
} = require('../validators/authValidator');
const { authLimiter, otpLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authLimiter, registerValidator, register);
router.post('/verify-email', authLimiter, verifyOTPValidator, verifyEmail);
router.post('/login', authLimiter, loginValidator, login);
router.post('/resend-otp', otpLimiter, emailOnlyValidator, resendOTP);
router.post('/forgot-password', authLimiter, emailOnlyValidator, forgotPassword);
router.post('/verify-reset-otp', authLimiter, verifyOTPValidator, verifyResetOTP);
router.post('/reset-password', authLimiter, resetPasswordValidator, resetPassword);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);

module.exports = router;
