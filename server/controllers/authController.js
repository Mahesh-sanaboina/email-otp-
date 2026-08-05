const User = require('../models/User');
const generateOTP = require('../utils/generateOTP');
const { generateAccessToken, generateRefreshToken, sendTokenCookies, clearTokenCookies } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const {
  getVerificationEmailTemplate,
  getPasswordResetTemplate,
  getWelcomeEmailTemplate,
  getPasswordChangedTemplate
} = require('../utils/emailTemplates');

/**
 * @desc    Register new user & send Email OTP
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists. Please log in.'
        });
      }

      // If user exists but is NOT verified, update password and send fresh OTP
      const otp = generateOTP();
      const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      existingUser.fullName = fullName;
      existingUser.password = password; // pre('save') will hash it
      existingUser.emailOTP = {
        code: otp,
        expireAt: otpExpire,
        attempts: 0,
        resendCount: 0,
        lastResendAt: new Date()
      };

      await existingUser.save();

      // Send Verification Email
      await sendEmail({
        email: existingUser.email,
        subject: 'Verify Your Email - AuthSecure',
        html: getVerificationEmailTemplate(existingUser.fullName, otp)
      });

      return res.status(200).json({
        success: true,
        message: 'Account details updated. A new verification OTP has been sent to your email.',
        email: existingUser.email
      });
    }

    // New User Creation
    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const user = await User.create({
      fullName,
      email,
      password,
      emailOTP: {
        code: otp,
        expireAt: otpExpire,
        attempts: 0,
        resendCount: 0,
        lastResendAt: new Date()
      }
    });

    // Send Verification Email
    await sendEmail({
      email: user.email,
      subject: 'Verify Your Email - AuthSecure',
      html: getVerificationEmailTemplate(user.fullName, otp)
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email for the 6-digit verification code.',
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Email OTP
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already verified. Please log in.'
      });
    }

    const { emailOTP } = user;

    if (!emailOTP || !emailOTP.code) {
      return res.status(400).json({
        success: false,
        message: 'No OTP found. Please request a new verification code.'
      });
    }

    // Check max attempts rule (Max 5 attempts)
    if (emailOTP.attempts >= 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum OTP verification attempts exceeded. Please request a new code.'
      });
    }

    // Check expiration rule (5 minutes)
    if (new Date() > new Date(emailOTP.expireAt)) {
      return res.status(400).json({
        success: false,
        message: 'OTP verification code has expired. Please request a new code.'
      });
    }

    // Compare code
    if (emailOTP.code !== otp.trim()) {
      user.emailOTP.attempts += 1;
      await user.save();

      const remainingAttempts = 5 - user.emailOTP.attempts;
      return res.status(400).json({
        success: false,
        message: `Invalid OTP code. You have ${remainingAttempts} attempt(s) remaining.`
      });
    }

    // OTP Correct: Mark user verified & clear OTP
    user.isVerified = true;
    user.emailOTP = {
      code: null,
      expireAt: null,
      attempts: 0,
      resendCount: 0,
      lastResendAt: null
    };

    // Tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;

    await user.save();

    sendTokenCookies(res, accessToken, refreshToken);

    // Send Welcome Email asynchronously
    sendEmail({
      email: user.email,
      subject: 'Welcome to AuthSecure! 🎉',
      html: getWelcomeEmailTemplate(user.fullName)
    }).catch(err => console.error('Failed to send welcome email:', err.message));

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! Welcome to your dashboard.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    sendTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        isVerified: user.isVerified,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resend OTP for email verification
 * @route   POST /api/auth/resend-otp
 * @access  Public
 */
const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email address is already verified'
      });
    }

    // Check resend limit (Max 3 resends)
    if (user.emailOTP.resendCount >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Maximum OTP resend requests (3) reached. Please try registering again later.'
      });
    }

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    user.emailOTP.code = otp;
    user.emailOTP.expireAt = otpExpire;
    user.emailOTP.attempts = 0;
    user.emailOTP.resendCount += 1;
    user.emailOTP.lastResendAt = new Date();

    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'New Verification Code - AuthSecure',
      html: getVerificationEmailTemplate(user.fullName, otp)
    });

    res.status(200).json({
      success: true,
      message: 'A new 6-digit OTP code has been sent to your email.',
      resendCount: user.emailOTP.resendCount
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot Password - Send Reset OTP
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Return success anyway to prevent email enumeration
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a 6-digit reset code has been sent.'
      });
    }

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    user.resetOTP = {
      code: otp,
      expireAt: otpExpire,
      attempts: 0,
      resendCount: 0,
      lastResendAt: new Date(),
      isVerified: false
    };

    await user.save();

    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP - AuthSecure',
      html: getPasswordResetTemplate(user.fullName, otp)
    });

    res.status(200).json({
      success: true,
      message: 'A 6-digit password reset code has been sent to your email address.',
      email: user.email
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify Reset Password OTP
 * @route   POST /api/auth/verify-reset-otp
 * @access  Public
 */
const verifyResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.resetOTP || !user.resetOTP.code) {
      return res.status(400).json({
        success: false,
        message: 'No valid password reset request found for this email.'
      });
    }

    const { resetOTP } = user;

    if (resetOTP.attempts >= 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum reset verification attempts exceeded. Please request a new reset code.'
      });
    }

    if (new Date() > new Date(resetOTP.expireAt)) {
      return res.status(400).json({
        success: false,
        message: 'Reset OTP code has expired. Please request a new one.'
      });
    }

    if (resetOTP.code !== otp.trim()) {
      user.resetOTP.attempts += 1;
      await user.save();

      const remaining = 5 - user.resetOTP.attempts;
      return res.status(400).json({
        success: false,
        message: `Invalid reset code. ${remaining} attempt(s) remaining.`
      });
    }

    // Valid reset code
    user.resetOTP.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Reset code verified successfully. You may now choose a new password.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Password with verified OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.resetOTP || !user.resetOTP.code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset attempt.'
      });
    }

    if (!user.resetOTP.isVerified || user.resetOTP.code !== otp.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Reset OTP has not been verified. Please verify code first.'
      });
    }

    if (new Date() > new Date(user.resetOTP.expireAt)) {
      return res.status(400).json({
        success: false,
        message: 'Reset code expired. Please restart password reset process.'
      });
    }

    // Set new password (pre-save hook hashes password)
    user.password = newPassword;
    user.resetOTP = {
      code: null,
      expireAt: null,
      attempts: 0,
      resendCount: 0,
      lastResendAt: null,
      isVerified: false
    };

    await user.save();

    // Send confirmation email
    sendEmail({
      email: user.email,
      subject: 'Password Changed - AuthSecure',
      html: getPasswordChangedTemplate(user.fullName)
    }).catch(err => console.error('Error sending password changed notification:', err));

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user & clear cookies
 * @route   POST /api/auth/logout
 * @access  Public / Protected
 */
const logout = async (req, res, next) => {
  try {
    if (req.user) {
      req.user.refreshToken = null;
      await req.user.save();
    }

    clearTokenCookies(res);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Refresh Access Token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token missing'
      });
    }

    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_key_102938401923840192384091238');
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token session'
      });
    }

    const newAccessToken = generateAccessToken(user._id);
    sendTokenCookies(res, newAccessToken, null);

    res.status(200).json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  logout,
  refreshToken
};
