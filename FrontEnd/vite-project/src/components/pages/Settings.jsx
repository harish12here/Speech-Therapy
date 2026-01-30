// src/components/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { Save, Volume2, Globe, User, Bell, Shield, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import AudioSettings from '../settings/AudioSettings';
import LanguageSelector from '../settings/LanguageSelector';
import ProfileSettings from '../settings/ProfileSettings';
import NotificationSettings from '../settings/NotificationSettings';
import PrivacySettings from '../settings/PrivacySettings';
import { getCurrentUser } from '../../services/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [saveTrigger, setSaveTrigger] = useState(0);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const handleNotification = (e) => {
      setNotification(e.detail);
      setTimeout(() => setNotification(null), 3000);
    };

    window.addEventListener('showNotification', handleNotification);
    return () => window.removeEventListener('showNotification', handleNotification);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserData(user);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    setSaveTrigger(prev => prev + 1);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const tabs = [
    { 
      id: 'profile', 
      name: 'Profile', 
      icon: User,
      description: 'Personal info & profile settings'
    },
    { 
      id: 'audio', 
      name: 'Audio', 
      icon: Volume2,
      description: 'Microphone & speaker settings'
    },
    { 
      id: 'language', 
      name: 'Language', 
      icon: Globe,
      description: 'Language & voice preferences'
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: Bell,
      description: 'Alerts & reminders'
    },
    { 
      id: 'privacy', 
      name: 'Privacy', 
      icon: Shield,
      description: 'Security & data privacy'
    }
  ];

  const getActiveTabConfig = () => {
    return tabs.find(tab => tab.id === activeTab) || tabs[0];
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings saveTrigger={saveTrigger} onSaveComplete={() => setIsLoading(false)} />;
      case 'audio':
        return <AudioSettings saveTrigger={saveTrigger} onSaveComplete={() => setIsLoading(false)} />;
      case 'language':
        return <LanguageSelector saveTrigger={saveTrigger} onSaveComplete={() => setIsLoading(false)} />;
      case 'notifications':
        return <NotificationSettings saveTrigger={saveTrigger} onSaveComplete={() => setIsLoading(false)} />;
      case 'privacy':
        return <PrivacySettings saveTrigger={saveTrigger} onSaveComplete={() => setIsLoading(false)} />;
      default:
        return <ProfileSettings />;
    }
  };

  const activeConfig = getActiveTabConfig();

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
          <div className={`px-6 py-3 rounded-full shadow-2xl border flex items-center space-x-3 backdrop-blur-md ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800 dark:from-green-900/90 dark:to-emerald-900/90 dark:border-green-800 dark:text-green-300' 
              : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800 dark:from-red-900/90 dark:to-rose-900/90 dark:border-red-800 dark:text-red-300'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
            <p className="text-sm font-semibold">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <SettingsIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Personalize your therapy experience
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
             <button
              onClick={handleSave}
              disabled={isLoading}
              className={`flex items-center justify-center space-x-2 py-3 px-8 rounded-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 active:scale-95 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="mb-8 overflow-hidden">
          <nav className="flex items-center space-x-2 bg-gray-100/50 dark:bg-gray-800/40 p-1.5 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 py-3 px-6 rounded-xl transition-all duration-300 whitespace-nowrap group ${
                    isActive
                      ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-md transform scale-105 z-10'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                    }`} 
                  />
                  <span className={`font-bold text-sm ${isActive ? 'text-gray-900 dark:text-white' : ''}`}>
                    {tab.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden min-h-[600px] transition-all duration-500">
          {/* Content Header */}
          <div className="bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/30 dark:to-gray-800/10 border-b border-gray-100 dark:border-gray-700/50 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                  <activeConfig.icon size={26} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeConfig.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {activeConfig.description}
                  </p>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center space-x-6">
                <div className="flex flex-col items-end">
                  <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                    System Health
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">Optimal</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-200 dark:bg-gray-700" />
                <div className="flex flex-col items-end">
                  <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                    Completion
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">85%</span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                        style={{ width: '85%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-10">
            {renderContent()}
          </div>
        </div>

        {/* Footer Support Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group bg-white dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-1">Need Help?</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Our support team is available 24/7 for you.</p>
          </div>
          
          <div className="group bg-white dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:border-teal-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-1">Security</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your data is secured with AES-256 encryption.</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-xl flex flex-col justify-between overflow-hidden relative group">
            <div className="relative z-10 text-white">
              <h4 className="font-bold mb-1">Pro Plan Active</h4>
              <p className="text-white/70 text-sm">Enjoy all premium therapy features.</p>
            </div>
            <div className="mt-4 relative z-10">
              <button className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold py-2 px-4 rounded-lg backdrop-blur-md transition-colors">
                Manage Billing
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;