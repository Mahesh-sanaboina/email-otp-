import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OTPInput from '../components/OTPInput';
import { Mail, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const { pendingEmail, verifyEmailOTP, resendEmailOTP } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVerifyComplete = async (otpCode) => {
    setIsSubmitting(true);
    const res = await verifyEmailOTP(otpCode);
    setIsSubmitting(false);

    if (res?.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  const handleResend = async () => {
    await resendEmailOTP();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-card p-6 sm:p-8 shadow-card-glow text-center"
      >
        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4 py-8"
          >
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Verification Successful!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Redirecting you to your account dashboard...
            </p>
          </motion.div>
        ) : (
          <>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/25 mb-4">
              <Mail className="w-7 h-7" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Verify Your Email
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              We have sent a 6-digit verification code to{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {pendingEmail || 'your email address'}
              </span>. Please enter it below.
            </p>

            <OTPInput
              length={6}
              onComplete={handleVerifyComplete}
              onResend={handleResend}
              isSubmitting={isSubmitting}
            />

            {isSubmitting && (
              <div className="mt-6 flex items-center justify-center space-x-2 text-primary-600 dark:text-primary-400 text-sm font-semibold">
                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <span>Verifying code...</span>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Email / Back to Register</span>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
