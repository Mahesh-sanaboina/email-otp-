import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

const OTPInput = ({ length = 6, onComplete, onResend, isSubmitting = false }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // 60-second Countdown Timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Handle single digit input
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow only last entered character
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join('');

    // Trigger complete callback when all filled
    if (combinedOtp.length === length && !newOtp.includes('')) {
      onComplete(combinedOtp);
    }

    // Auto focus next input
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key navigation (Backspace / Left / Right Arrow)
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, length).split('');
    const newOtp = [...otp];
    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].value = digit;
      }
    });

    setOtp(newOtp);

    // Focus last filled digit or final input
    const targetIdx = Math.min(digits.length, length - 1);
    if (inputRefs.current[targetIdx]) {
      inputRefs.current[targetIdx].focus();
    }

    const combinedOtp = newOtp.join('');
    if (combinedOtp.length === length && !newOtp.includes('')) {
      onComplete(combinedOtp);
    }
  };

  // Handle Resend Click
  const handleResendClick = async () => {
    if (!canResend) return;
    setOtp(Array(length).fill(''));
    setTimer(60);
    setCanResend(false);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    if (onResend) {
      await onResend();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      {/* 6 Digit Input Boxes */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={isSubmitting}
            aria-label={`Digit ${index + 1} of OTP`}
            className={`w-11 h-13 sm:w-14 sm:h-16 text-center text-2xl font-extrabold rounded-xl border-2 transition-all duration-200 shadow-sm focus:outline-none ${
              digit
                ? 'border-primary-600 bg-primary-50/50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 shadow-primary-500/10'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20'
            } disabled:opacity-50`}
          />
        ))}
      </div>

      {/* Countdown Timer & Resend Button */}
      <div className="flex items-center justify-between w-full text-sm px-1">
        <div className="text-slate-500 dark:text-slate-400 font-medium">
          {timer > 0 ? (
            <span className="flex items-center space-x-1.5">
              <span>Code expires in:</span>
              <span className="font-bold text-primary-600 dark:text-primary-400 font-mono">
                00:{timer < 10 ? `0${timer}` : timer}
              </span>
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              OTP Code Expired
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleResendClick}
          disabled={!canResend || isSubmitting}
          className={`flex items-center space-x-1.5 font-semibold transition-colors ${
            canResend
              ? 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 cursor-pointer'
              : 'text-slate-400 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${!canResend ? '' : 'hover:rotate-180 transition-transform duration-500'}`} />
          <span>Resend Code</span>
        </button>
      </div>
    </div>
  );
};

export default OTPInput;
