import React from 'react';
import { Check, X } from 'lucide-react';

const PasswordStrengthMeter = ({ password = '' }) => {
  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'One numeric digit (0-9)', met: /[0-9]/.test(password) },
    { label: 'One special symbol (@$!%*?&#)', met: /[@$!%*?&#]/.test(password) },
  ];

  const score = checks.filter((c) => c.met).length;

  const getStrengthLabel = () => {
    if (!password) return { text: 'Empty', color: 'bg-slate-200 dark:bg-slate-700', textColor: 'text-slate-500' };
    if (score <= 2) return { text: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-500' };
    if (score <= 4) return { text: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-500' };
    return { text: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500' };
  };

  const strength = getStrengthLabel();

  return (
    <div className="space-y-3 pt-1">
      {/* Progress Bars */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600 dark:text-slate-400">Password Strength:</span>
          <span className={strength.textColor}>{strength.text}</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-full rounded-full transition-all duration-300 ${
                step <= score ? strength.color : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {checks.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-xs">
            {item.met ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
            )}
            <span
              className={
                item.met
                  ? 'text-slate-700 dark:text-slate-300 font-medium'
                  : 'text-slate-400 dark:text-slate-500'
              }
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
