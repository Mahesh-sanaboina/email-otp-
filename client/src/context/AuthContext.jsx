import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState(
    localStorage.getItem('pendingVerificationEmail') || ''
  );
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  // Sync theme class on HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Fetch initial profile on app startup
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await api.get('/user/profile');
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Set pending verification email for OTP page
  const savePendingEmail = (email) => {
    setPendingEmail(email);
    if (email) {
      localStorage.setItem('pendingVerificationEmail', email);
    } else {
      localStorage.removeItem('pendingVerificationEmail');
    }
  };

  // Register
  const registerUser = async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.data.success) {
        savePendingEmail(data.email);
        toast.success(res.data.message);
        return { success: true, email: data.email };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Verify Email OTP
  const verifyEmailOTP = async (otp) => {
    try {
      const res = await api.post('/auth/verify-email', {
        email: pendingEmail,
        otp
      });
      if (res.data.success) {
        setUser(res.data.user);
        savePendingEmail('');
        toast.success('Email verified successfully!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'OTP Verification failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Login
  const loginUser = async (credentials) => {
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Welcome back!');
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Resend OTP
  const resendEmailOTP = async (emailToResend) => {
    try {
      const targetEmail = emailToResend || pendingEmail;
      const res = await api.post('/auth/resend-otp', { email: targetEmail });
      if (res.data.success) {
        toast.success(res.data.message);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Forgot Password Step 1
  const requestForgotPassword = async (email) => {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        savePendingEmail(email);
        toast.success(res.data.message);
        return { success: true, email };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Request failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Verify Reset Password OTP Step 2
  const verifyResetOTPCode = async (email, otp) => {
    try {
      const res = await api.post('/auth/verify-reset-otp', { email, otp });
      if (res.data.success) {
        toast.success(res.data.message);
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Reset code verification failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Reset Password Final Step 3
  const performResetPassword = async (email, otp, newPassword, confirmPassword) => {
    try {
      const res = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
        confirmPassword
      });
      if (res.data.success) {
        savePendingEmail('');
        toast.success('Password reset successfully! Please login with your new password.');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to reset password';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Update Profile
  const updateUserProfile = async (data) => {
    try {
      const res = await api.put('/user/update-profile', data);
      if (res.data.success) {
        setUser(res.data.user);
        toast.success('Profile updated successfully!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Profile update failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Change Password
  const changeUserPassword = async (passwords) => {
    try {
      const res = await api.put('/user/change-password', passwords);
      if (res.data.success) {
        toast.success('Password updated successfully!');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to change password';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Delete Account
  const deleteUserAccount = async () => {
    try {
      const res = await api.delete('/user/delete-account');
      if (res.data.success) {
        setUser(null);
        toast.success('Account deleted successfully');
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Account deletion failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Logout
  const logoutUser = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request error:', err);
    } finally {
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        theme,
        toggleTheme,
        pendingEmail,
        savePendingEmail,
        registerUser,
        verifyEmailOTP,
        loginUser,
        resendEmailOTP,
        requestForgotPassword,
        verifyResetOTPCode,
        performResetPassword,
        updateUserProfile,
        changeUserPassword,
        deleteUserAccount,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
