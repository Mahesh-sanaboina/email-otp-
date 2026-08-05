import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, KeyRound, Mail, Lock, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const features = [
    {
      icon: <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
      title: '6-Digit Email OTP',
      desc: 'Cryptographically random, high-security 5-minute expiring verification codes.'
    },
    {
      icon: <Lock className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
      title: 'JWT HTTP-Only Cookies',
      desc: 'Dual Access & Refresh Token architecture preventing XSS token leaks.'
    },
    {
      icon: <KeyRound className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
      title: 'Password Security',
      desc: 'Bcrypt salt hashing (10 rounds) with real-time complexity strength metering.'
    },
    {
      icon: <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
      title: 'Rate-Limiting Protection',
      desc: 'Strict brute-force attempt limits & automated resend delay enforcement.'
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary-500/20 to-indigo-500/20 rounded-full blur-3xl -z-10" />

      {/* Hero Content */}
      <div className="max-w-4xl text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800/80 text-primary-700 dark:text-primary-300 text-xs font-bold tracking-wide uppercase shadow-sm"
        >
          <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>Enterprise MERN Authentication Standard</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none"
        >
          Next-Gen <span className="text-gradient">Email OTP</span> Authentication System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Production-grade security powered by React 19, Express, MongoDB Atlas, Nodemailer, and JWT HTTP-Only cookie architecture.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-base shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-base shadow-sm transition-all text-center"
          >
            Sign In to Dashboard
          </Link>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full mt-20"
      >
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="glass-card p-6 flex flex-col space-y-3 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center border border-primary-100 dark:border-primary-900/50">
              {feat.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
