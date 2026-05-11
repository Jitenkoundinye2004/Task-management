import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Moon, 
  Sun,
  Camera,
  Loader2
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { updateProfile, reset as resetAuth } from '../redux/slices/authSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileData, setProfileData] = useState({
    name: '',
  });

  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);
  const { theme, toggleTheme, accentColor, setAccentColor, accentColors } = useTheme();

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name });
    }
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      if (activeSection === 'security') {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast('Security settings updated successfully', 'success');
      } else if (activeSection === 'profile') {
        showToast('Profile updated successfully', 'success');
      }
    }
    if (isError) {
      showToast(message, 'error');
    }
    dispatch(resetAuth());
  }, [isSuccess, isError, message, activeSection, dispatch, showToast]);

  const onProfileUpdate = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  };

  const onSecurityUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    dispatch(updateProfile({ password: passwordData.newPassword }));
  };

  const sections = [
    { id: 'profile', name: 'Profile Settings', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <motion.form 
            onSubmit={onProfileUpdate}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-dark-800 pb-4 mb-6">Profile Information</h3>
              <div className="flex flex-col sm:flex-row gap-8 mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 font-bold text-2xl border-2 border-white dark:border-dark-900 shadow-lg">
                    {user?.name.charAt(0)}
                  </div>
                  <button type="button" className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-white dark:bg-dark-950 border border-slate-100 dark:border-dark-800 shadow-lg text-slate-500 hover:text-primary-600 transition-all">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input 
                      label="Full Name" 
                      value={profileData.name} 
                      onChange={(e) => setProfileData({ name: e.target.value })}
                    />
                    <Input label="Email Address" defaultValue={user?.email} disabled />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700 dark:text-dark-300">Bio</label>
                    <textarea 
                      className="input min-h-[100px]" 
                      placeholder="Tell us about yourself..."
                      defaultValue="Senior Product Designer with a passion for building intuitive tools for teams."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-dark-800 pt-6">
              <Button type="button" variant="secondary">Cancel</Button>
              <Button type="submit" isLoading={isLoading}>Save Changes</Button>
            </div>
          </motion.form>
        );

      case 'notifications':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-bold border-b border-slate-100 dark:border-dark-800 pb-4 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { id: 'n1', title: 'Task Assignments', desc: 'When someone assigns you a new task' },
                { id: 'n2', title: 'Project Updates', desc: 'When there is progress or changes in projects you follow' },
                { id: 'n3', title: 'Comments & Mentions', desc: 'When someone mentions you or comments on your tasks' },
                { id: 'n4', title: 'Deadline Reminders', desc: 'Get notified when a task is nearing its due date' },
              ].map(pref => (
                <div key={pref.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 dark:bg-dark-900/50 border border-slate-100 dark:border-dark-800">
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-dark-50">{pref.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{pref.desc}</p>
                  </div>
                  <div className="w-12 h-6 bg-primary-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'security':
        return (
          <motion.form 
            onSubmit={onSecurityUpdate}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-dark-800 pb-4 mb-6">Password & Security</h3>
              <div className="space-y-6 max-w-md">
                <Input 
                  label="Current Password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
                <Input 
                  label="New Password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
                <Input 
                  label="Confirm New Password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" isLoading={isLoading}>Update Security</Button>
            </div>
          </motion.form>
        );

      case 'appearance':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-dark-800 pb-4 mb-6">Theme Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => toggleTheme('light')}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${theme === 'light' ? 'border-primary-600 bg-white dark:bg-dark-900 shadow-lg' : 'border-slate-100 dark:border-dark-800 bg-slate-50 dark:bg-dark-900/50 hover:border-slate-300'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-primary-600' : 'text-slate-400'}`} />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'light' ? 'border-primary-600' : 'border-slate-300'}`}>
                      {theme === 'light' && <div className="w-2 h-2 bg-primary-600 rounded-full"></div>}
                    </div>
                  </div>
                  <p className={`font-bold ${theme === 'light' ? 'text-slate-800 dark:text-dark-50' : 'text-slate-500'}`}>Light Mode</p>
                  <p className="text-xs text-slate-500 mt-1">Clean and classic look.</p>
                </div>
                <div 
                  onClick={() => toggleTheme('dark')}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${theme === 'dark' ? 'border-primary-600 bg-white dark:bg-dark-900 shadow-lg' : 'border-slate-100 dark:border-dark-800 bg-slate-50 dark:bg-dark-900/50 hover:border-slate-300'}`}
                >
                  <div className="flex items-center justify-between mb-4 text-slate-400">
                    <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-primary-600' : 'text-slate-400'}`} />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'border-primary-600' : 'border-slate-300'}`}>
                      {theme === 'dark' && <div className="w-2 h-2 bg-primary-600 rounded-full"></div>}
                    </div>
                  </div>
                  <p className={`font-bold ${theme === 'dark' ? 'text-slate-800 dark:text-dark-50' : 'text-slate-500'}`}>Dark Mode</p>
                  <p className="text-xs text-slate-500 mt-1">Easier on the eyes at night.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-dark-800 pb-4 mb-6">Accent Color</h3>
              <div className="flex gap-4">
                {accentColors.map(color => (
                  <div 
                    key={color.value} 
                    onClick={() => setAccentColor(color.value)}
                    className={`w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-all ${accentColor === color.value ? 'ring-4 ring-offset-4 ring-primary-600' : 'border-2 border-transparent'}`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-dark-50">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-dark-400">Personalize your account and workspace experience.</p>
        </div>
        {isLoading && <Loader2 className="w-6 h-6 animate-spin text-primary-600" />}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === section.id 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-800'
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="glass p-8 rounded-2xl shadow-sm min-h-[500px]">
            <AnimatePresence mode="wait">
              {renderSection()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
