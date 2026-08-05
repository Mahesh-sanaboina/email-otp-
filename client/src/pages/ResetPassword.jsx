import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import OTPInput from '../components/OTPInput';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { Lock, Eye, EyeOff, KeyRound, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const { pendingEmail, verifyResetOTPCode, performResetPassword, resendEmailOTP } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const targetEmail = location.state?.email || pendingEmail;

  const [step, setStep] = useState(1); // 1: Verify OTP, 2: New Password
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  const passwordValue = watch('newPassword', '');

  // Step 1: Handle OTP verification complete
  const handleOTPComplete = async (code) => {
    setIsSubmitting(true);
    setOtpCode(code);
    const res = await verifyResetOTPCode(targetEmail, code);
    setIsSubmitting(false);

    if (res?.success) {
      setStep(2);
    }
  };

  const handleResend = async () => {
    await resendEmailOTP(targetEmail);
  };

  // Step 2: Submit New Password
  const onPasswordSubmit = async (data) => {
    setIsSubmitting(true);
    const res = await performResetPassword(
      targetEmail,
      otpCode,
      data.newPassword,
      data.confirmPassword
    );
    setIsSubmitting(false);

    if (res?.success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-card p-6 sm:p-8 shadow-card-glow"
      >
        {step === 1 ? (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/25 mb-2">
              <KeyRound className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Verify Reset Code
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Enter the 6-digit reset code sent to{' '}
              <span className="font-semibold text-slate-900 dark:text-white">
                {targetEmail || 'your email'}
              </span>
            </p>

            <OTPInput
              length={6}
              onComplete={handleOTPComplete}
              onResend={handleResend}
              isSubmitting={isSubmitting}
            />

            {isSubmitting && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-primary-600 dark:text-primary-400 text-sm font-semibold">
                <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                <span>Validating reset code...</span>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Set New Password
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose a strong new password for your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('newPassword', {
                      required: 'New password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' }
                    })}
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-rose-500 font-medium">{errors.newPassword.message}</p>
                )}

                <PasswordStrengthMeter password={passwordValue} />
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('confirmPassword', {
                      required: 'Please confirm your new password',
                      validate: (value) => value === passwordValue || 'Passwords do not match'
                    })}
                    className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-primary-500/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Update Password & Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
