import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import Modal from '../components/Modal';
import { User, Lock, Trash2, Eye, EyeOff, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const defaultAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
];

const Profile = () => {
  const { user, updateUserProfile, changeUserPassword, deleteUserAccount } = useAuth();
  const navigate = useNavigate();

  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || defaultAvatars[0]);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors }
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || ''
    }
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors }
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPasswordValue = watchPassword('newPassword', '');

  // Handle Profile Update
  const onUpdateProfile = async (data) => {
    setIsUpdatingProfile(true);
    await updateUserProfile({
      fullName: data.fullName,
      avatar: selectedAvatar
    });
    setIsUpdatingProfile(false);
  };

  // Handle Password Change
  const onChangePassword = async (data) => {
    setIsChangingPass(true);
    const res = await changeUserPassword(data);
    setIsChangingPass(false);

    if (res?.success) {
      resetPasswordForm();
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const res = await deleteUserAccount();
    setIsDeleting(false);

    if (res?.success) {
      navigate('/login');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, avatar, security settings, and account preferences.
        </p>
      </div>

      {/* 1. Update Profile & Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 sm:p-8 space-y-6"
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
          <User className="w-5 h-5 text-primary-600" />
          <span>Personal Profile</span>
        </h2>

        <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-6">
          {/* Avatar Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Profile Avatar
            </label>
            <div className="flex flex-wrap items-center gap-4">
              {defaultAvatars.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
                    selectedAvatar === url
                      ? 'border-primary-600 ring-4 ring-primary-500/20 scale-105'
                      : 'border-slate-200 dark:border-slate-700 hover:opacity-80'
                  }`}
                >
                  <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                  {selectedAvatar === url && (
                    <div className="absolute inset-0 bg-primary-600/30 flex items-center justify-center text-white">
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5 max-w-md">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              {...registerProfile('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all"
            />
            {profileErrors.fullName && (
              <p className="text-xs text-rose-500 font-medium">{profileErrors.fullName.message}</p>
            )}
          </div>

          {/* Email (Read only) */}
          <div className="space-y-1.5 max-w-md">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Email Address (Verified)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Details'}
          </button>
        </form>
      </motion.div>

      {/* 2. Change Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 sm:p-8 space-y-6"
      >
        <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2">
          <Lock className="w-5 h-5 text-indigo-600" />
          <span>Security & Password</span>
        </h2>

        <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4 max-w-md">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPass ? 'text' : 'password'}
                placeholder="••••••••"
                {...registerPassword('currentPassword', {
                  required: 'Current password is required'
                })}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showCurrentPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="text-xs text-rose-500 font-medium">
                {passwordErrors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                placeholder="••••••••"
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' }
                })}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="text-xs text-rose-500 font-medium font-medium">
                {passwordErrors.newPassword.message}
              </p>
            )}

            <PasswordStrengthMeter password={newPasswordValue} />
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? 'text' : 'password'}
                placeholder="••••••••"
                {...registerPassword('confirmPassword', {
                  required: 'Please confirm new password',
                  validate: (val) => val === newPasswordValue || 'Passwords do not match'
                })}
                className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showConfirmPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="text-xs text-rose-500 font-medium">
                {passwordErrors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isChangingPass}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {isChangingPass ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </motion.div>

      {/* 3. Danger Zone: Delete Account */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card border-rose-200 dark:border-rose-950 p-6 sm:p-8 space-y-4 bg-rose-50/20 dark:bg-rose-950/10"
      >
        <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-xl font-bold">Danger Zone</h2>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Once you delete your account, there is no going back. All of your personal profile details and security records will be permanently removed.
        </p>

        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Account</span>
        </button>
      </motion.div>

      {/* Account Deletion Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to delete your account permanently? This action cannot be undone.
          </p>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
