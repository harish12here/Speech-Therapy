import React, { useState, useEffect } from 'react';
import { Save, Volume2, Globe, User, Bell, Shield, Sparkles } from 'lucide-react';
import Header from '../common/Header';
import AudioSettings from '../settings/AudioSettings';
import LanguageSelector from '../settings/LanguageSelector';
import ProfileSettings from '../settings/ProfileSettings';
import { getCurrentUser } from '../../services/api';


const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
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
    // This will trigger the active sub-component to save its data
    setSaveTrigger(prev => prev + 1);
    
    // Simulate a bit of delay for the UI feel if needed, 
    // but the actual saving happens in components
    setTimeout(() => {
        setIsLoading(false);
    }, 1000);
  };

  const tabs = [
    { 
      id: 'profile', 
      name: 'Profile', 
      icon: User,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-100',
      borderColor: 'border-blue-200'
    },
    { 
      id: 'audio', 
      name: 'Audio', 
      icon: Volume2,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-100',
      borderColor: 'border-purple-200'
    },
    { 
      id: 'language', 
      name: 'Language', 
      icon: Globe,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-100',
      borderColor: 'border-green-200'
    },
    { 
      id: 'notifications', 
      name: 'Notifications', 
      icon: Bell,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-100',
      borderColor: 'border-orange-200'
    },
    { 
      id: 'privacy', 
      name: 'Privacy', 
      icon: Shield,
      color: 'from-gray-600 to-gray-800',
      bgColor: 'from-gray-100 to-gray-200',
      borderColor: 'border-gray-300'
    }
  ];

  const getActiveTabConfig = () => {
    return tabs.find(tab => tab.id === activeTab) || tabs[0];
  };

  const renderContent = () => {
    const activeConfig = getActiveTabConfig();
    
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings saveTrigger={saveTrigger} onSaveComplete={() => setIsLoading(false)} />;
      case 'audio':
        return <AudioSettings saveTrigger={saveTrigger} onSaveComplete={() => setIsLoading(false)} />;
      case 'language':
        return <LanguageSelector saveTrigger={saveTrigger} onSaveComplete={() => setIsLoading(false)} />;
      case 'notifications':
        return (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Bell className="text-white" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Notifications Settings</h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Configure your notification preferences and stay updated with your progress!
            </p>
            <div className="mt-8 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-orange-800 font-semibold">
                🚧 Coming Soon! We're working on amazing notification features.
              </p>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Shield className="text-white" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Privacy & Security</h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Manage your data privacy and security settings to keep your information safe.
            </p>
            <div className="mt-8 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-gray-700 font-semibold">
                🔒 Coming Soon! Your privacy is our top priority.
              </p>
            </div>
          </div>
        );
      default:
        return <ProfileSettings />;
    }
  };

  const activeConfig = getActiveTabConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-black pb-20 transition-colors duration-300">
      <Header />
      
      {/* Dynamic Notification Toast */}
      {notification && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl border-2 flex items-center space-x-3 ${
            notification.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300' 
              : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <Sparkles size={16} className="text-white" />
            </div>
            <p className="font-bold">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Animated Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse">
              <Sparkles className="text-white" size={32} />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Customize your speech therapy experience with beautiful and intuitive controls
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800 p-6 sticky top-24">
              {/* Active Tab Indicator */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${activeConfig.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    {React.createElement(activeConfig.icon, { 
                      size: 24, 
                      className: "text-white" 
                    })}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{activeConfig.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Section</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isHover = isHovered === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      onMouseEnter={() => setIsHovered(tab.id)}
                      onMouseLeave={() => setIsHovered(null)}
                      className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 transform ${
                        isActive
                          ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                          : `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-xl hover:scale-105 border-2 dark:border-gray-700 ${tab.borderColor} dark:hover:border-white/20`
                      } ${isHover && !isActive ? 'border-2 border-dashed animate-pulse' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isActive 
                          ? 'bg-white/20' 
                          : `bg-gradient-to-br ${tab.bgColor} dark:opacity-80`
                      }`}>
                        <Icon 
                          size={20} 
                          className={isActive ? 'text-white' : `text-gray-600 dark:text-gray-400`} 
                        />
                      </div>
                      <span className="font-semibold text-left flex-1">{tab.name}</span>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Enhanced Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-800">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                    isLoading 
                      ? 'bg-gradient-to-r from-gray-400 to-gray-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                
                {/* Quick Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                    <div className="font-bold text-blue-600 dark:text-blue-400">85%</div>
                    <div className="text-blue-500 dark:text-blue-500/70">Complete</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/30 rounded-xl">
                    <div className="font-bold text-green-600 dark:text-green-400">24</div>
                    <div className="text-green-500 dark:text-green-500/70">Settings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className={`bg-gradient-to-br ${activeConfig.bgColor} dark:${activeConfig.bgColor.replace(/-50/g, '-900/10').replace(/-100/g, '-900/20')} rounded-3xl shadow-2xl border-2 ${activeConfig.borderColor} dark:border-gray-800 overflow-hidden transition-all duration-500`}>
              {/* Content Header */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${activeConfig.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      {React.createElement(activeConfig.icon, { 
                        size: 28, 
                        className: "text-white" 
                      })}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{activeConfig.name} Settings</h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {activeTab === 'profile' && 'Manage your personal information and preferences'}
                        {activeTab === 'audio' && 'Configure microphone and speaker settings for optimal practice'}
                        {activeTab === 'language' && 'Select your preferred languages for speech therapy'}
                        {activeTab === 'notifications' && 'Customize how you receive updates and alerts'}
                        {activeTab === 'privacy' && 'Control your data privacy and security settings'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="hidden lg:block">
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-500 mb-1">Settings Progress</div>
                      <div className="w-32 bg-white/50 dark:bg-gray-800/50 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000"
                          style={{ width: `${activeTab === 'profile' ? '20%' : activeTab === 'audio' ? '40%' : activeTab === 'language' ? '60%' : '80%'}` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Body with Smooth Animation */}
              <div className="p-6 animate-fadeIn">
                {renderContent()}
              </div>

              {/* Floating Action Button for Mobile */}
              <div className="lg:hidden fixed bottom-6 right-6 z-10">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
                >
                  <Save size={24} />
                </button>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div className="font-semibold text-blue-800 dark:text-blue-300 text-sm">Easy to Use</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-4 text-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield size={16} className="text-white" />
                </div>
                <div className="font-semibold text-purple-800 dark:text-purple-300 text-sm">Secure</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Volume2 size={16} className="text-white" />
                </div>
                <div className="font-semibold text-green-800 dark:text-green-300 text-sm">Optimized</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;