import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 text-center space-y-6 shadow-2xl"
      >
        <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center text-rose-500 mx-auto">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white">404</h1>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Page Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center space-x-2 w-full py-3.5 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-lg shadow-primary-500/25 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
