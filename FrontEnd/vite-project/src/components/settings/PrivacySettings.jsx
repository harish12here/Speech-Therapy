// src/components/settings/PrivacySettings.jsx
import React, { useState, useEffect } from 'react';
import { Shield, Eye, Lock, Database, Trash2, Key, Download, Fingerprint } from 'lucide-react';
import { getCurrentUser, updateUserProfile } from '../../services/api';

const PrivacySettings = ({ saveTrigger, onSaveComplete }) => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    profileVisibility: 'private',
    shareProgress: false,
    dataCollection: true,
    twoFactorAuth: false,
    sessionHistory: true,
    biometricLogin: false,
    cookiesEnabled: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        if (user) {
          setSettings({
            profileVisibility: user.profile_visibility || 'private',
            shareProgress: user.share_progress || false,
            dataCollection: user.data_collection ?? true,
            twoFactorAuth: user.two_factor_auth || false,
            sessionHistory: user.session_history_enabled ?? true,
            biometricLogin: user.biometric_login || false,
            cookiesEnabled: user.cookies_enabled ?? true
          });
        }
      } catch (err) {
        console.error("Failed to fetch privacy settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (saveTrigger > 0) {
      handleSave();
    }
  }, [saveTrigger]);

  const handleSave = async () => {
    try {
      await updateUserProfile({
        profile_visibility: settings.profileVisibility,
        share_progress: settings.shareProgress,
        data_collection: settings.dataCollection,
        two_factor_auth: settings.twoFactorAuth,
        session_history_enabled: settings.sessionHistory,
        biometric_login: settings.biometricLogin,
        cookies_enabled: settings.cookiesEnabled
      });
      
      const successEvent = new CustomEvent('showNotification', {
        detail: { 
          message: 'Privacy settings updated!', 
          type: 'success' 
        }
      });
      window.dispatchEvent(successEvent);
      
      if (onSaveComplete) onSaveComplete();
    } catch (err) {
      console.error("Failed to save privacy settings", err);
      const errorEvent = new CustomEvent('showNotification', {
        detail: { 
          message: 'Failed to update privacy settings', 
          type: 'error' 
        }
      });
      window.dispatchEvent(errorEvent);
      if (onSaveComplete) onSaveComplete();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading privacy settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      {/* Visibility Settings */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-900/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
            <Eye size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Visibility</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'private', label: 'Private Profile', desc: 'Only you can see your therapy progress and stats' },
            { id: 'public', label: 'Public Profile', desc: 'Others can see your achievements and level' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSettings({...settings, profileVisibility: type.id})}
              className={`flex flex-col p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                settings.profileVisibility === type.id
                  ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-sm'
                  : 'border-transparent bg-gray-50/50 dark:bg-gray-800/40 hover:border-indigo-200'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`font-bold ${settings.profileVisibility === type.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                  {type.label}
                </span>
                {settings.profileVisibility === type.id && (
                  <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{type.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Security & Access */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/30 dark:to-teal-900/10 text-teal-600 dark:text-teal-400 rounded-lg flex items-center justify-center">
            <Lock size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security & Access</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-indigo-500/30 transition-all flex items-start space-x-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Key size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Two-Factor Auth</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security to your account</p>
              <button className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Configure 2FA</button>
            </div>
          </div>
          
          <div className="p-5 bg-white dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-teal-500/30 transition-all flex items-start space-x-4">
            <div className="p-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl">
              <Fingerprint size={20} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Biometric Login</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Use Touch ID or Face ID to login securely</p>
              <button className="mt-3 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline">Setup Biometrics</button>
            </div>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-900/10 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
            <Database size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h3>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 'dataCollection', label: 'Improve Speech AI', desc: 'Allow us to use your anonymous data to enhance therapy models' },
            { id: 'sessionHistory', label: 'Keep Session History', desc: 'Store your recordings for progress analysis' },
            { id: 'cookiesEnabled', label: 'Personalization Cookies', desc: 'Enable cookies for a more personalized experience' }
          ].map((pref) => (
            <label key={pref.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-500/30 transition-all cursor-pointer group">
              <div className="flex-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                  {pref.label}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{pref.desc}</p>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[pref.id]}
                  onChange={(e) => setSettings({...settings, [pref.id]: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-red-100 dark:border-red-900/30">
          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center">
            <Trash2 size={16} />
          </div>
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-red-500/30 transition-all">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white">Download Your Data</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get a copy of all your therapy recordings and progress</p>
            <button className="mt-4 flex items-center space-x-2 text-xs font-bold text-gray-600 dark:text-gray-300 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download size={14} />
              <span>Export All Data</span>
            </button>
          </div>
          
          <div className="p-5 bg-white dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-red-500/30 transition-all">
            <h4 className="text-sm font-bold text-red-600 dark:text-red-400">Delete Account</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Permanently remove your account and all therapy data</p>
            <button className="mt-4 text-xs font-bold text-white px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
              Delete Forever
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacySettings;
