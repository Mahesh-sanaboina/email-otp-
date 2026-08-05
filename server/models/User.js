const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [50, 'Full name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    emailOTP: {
      code: { type: String, default: null },
      expireAt: { type: Date, default: null },
      attempts: { type: Number, default: 0 },
      resendCount: { type: Number, default: 0 },
      lastResendAt: { type: Date, default: null }
    },
    resetOTP: {
      code: { type: String, default: null },
      expireAt: { type: Date, default: null },
      attempts: { type: Number, default: 0 },
      resendCount: { type: Number, default: 0 },
      lastResendAt: { type: Date, default: null },
      isVerified: { type: Boolean, default: false }
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    refreshToken: {
      type: String,
      select: false
    }
  },
  {
    timestamps: true
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
