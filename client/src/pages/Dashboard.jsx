import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  User,
  Mail,
  Calendar,
  LogOut,
  Settings,
  Lock,
  Sparkles,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[20px] bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 p-8 sm:p-10 text-white shadow-xl shadow-primary-500/20"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-primary-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Security Verified Account</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName}! 👋
            </h1>
            <p className="text-primary-100 text-sm sm:text-base max-w-xl">
              Your account is fully authenticated with 6-Digit Email OTP protection and HTTP-Only JWT encryption.
            </p>
          </div>

          <Link
            to="/profile"
            className="px-5 py-3 rounded-xl bg-white text-primary-600 hover:bg-primary-50 font-bold text-sm shadow-lg transition-all flex items-center space-x-2 shrink-0"
          >
            <Settings className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* Main Grid: User Profile Details + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <User className="w-5 h-5 text-primary-600" />
              <span>Account Overview</span>
            </h2>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Email Verified</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={user?.avatar}
              alt={user?.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl"
            />
            <div className="space-y-3 text-center sm:text-left">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {user?.fullName}
                </h3>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start space-x-1.5 mt-1">
                  <Mail className="w-4 h-4 text-primary-600" />
                  <span>{user?.email}</span>
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-start space-x-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Joined: {formattedDate}</span>
                </span>
                <span className="capitalize px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  Role: {user?.role || 'User'}
                </span>
              </div>
            </div>
          </div>

          {/* Security Features Badges */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center text-primary-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">OTP Verification</h4>
                <p className="text-xs text-slate-500">Active 6-digit email check</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">JWT Cookie Auth</h4>
                <p className="text-xs text-slate-500">Secure HTTP-Only session</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 sm:p-8 space-y-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800">
              Quick Management
            </h3>

            <div className="space-y-2">
              <Link
                to="/profile"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-primary-600" />
                  <span>Update Profile & Avatar</span>
                </div>
                <span>&rarr;</span>
              </Link>

              <Link
                to="/profile"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span>Change Password</span>
                </div>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70 text-rose-600 dark:text-rose-400 font-bold text-sm transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Account</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
