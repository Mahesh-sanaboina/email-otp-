const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Verification of JWT access token
 */
const protect = async (req, res, next) => {
  try {
    let token = req.cookies.accessToken;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, access token missing'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'dev_access_secret_key_89234789234792347923479234');
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists'
        });
      }

      req.user = user;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          code: 'TOKEN_EXPIRED',
          message: 'Access token expired'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid access token'
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };
