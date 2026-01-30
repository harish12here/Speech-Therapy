// src/components/settings/NotificationSettings.jsx
import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Mail, Smartphone, Zap, Clock, ShieldCheck } from 'lucide-react';
import { getCurrentUser, updateUserProfile } from '../../services/api';

const NotificationSettings = ({ saveTrigger, onSaveComplete }) => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    sessionReminders: true,
    achievementAlerts: true,
    weeklyReports: true,
    marketingEmails: false,
    activityAlerts: true,
    reminderLeadTime: '15'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // Assuming we fetch from user profile or a dedicated settings endpoint
        const user = await getCurrentUser();
        if (user) {
          // Map user preferences if they exist in the backend
          // setSettings(user.notification_preferences || settings);
        }
      } catch (err) {
        console.error("Failed to fetch notification settings", err);
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
      // In a real app, you'd send this to the backend
      // await updateNotificationSettings(settings);
      
      const successEvent = new CustomEvent('showNotification', {
        detail: { 
          message: 'Notification preferences updated!', 
          type: 'success' 
        }
      });
      window.dispatchEvent(successEvent);
      
      if (onSaveComplete) onSaveComplete();
    } catch (err) {
      console.error("Failed to save notification settings", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading notification settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      {/* Primary Channels */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-900/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
            <Zap size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Channels</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'pushNotifications', label: 'Push Notifications', icon: Smartphone, desc: 'Instant desktop alerts' },
            { id: 'emailNotifications', label: 'Email Alerts', icon: Mail, desc: 'Daily/Weekly summaries' },
            { id: 'smsNotifications', label: 'SMS Updates', icon: MessageSquare, desc: 'Important session alerts' }
          ].map((channel) => (
            <label key={channel.id} className={`flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              settings[channel.id] 
                ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' 
                : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/40 hover:border-indigo-200'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl ${settings[channel.id] ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                  <channel.icon size={20} />
                </div>
                <input
                  type="checkbox"
                  checked={settings[channel.id]}
                  onChange={(e) => setSettings({...settings, [channel.id]: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">{channel.label}</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{channel.desc}</p>
            </label>
          ))}
        </div>
      </section>

      {/* Therapy Activity */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/30 dark:to-teal-900/10 text-teal-600 dark:text-teal-400 rounded-lg flex items-center justify-center">
            <Bell size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Therapy Activity</h3>
        </div>
        
        <div className="space-y-3">
          {[
            { id: 'sessionReminders', label: 'Upcoming Session Reminders', desc: 'Get notified before your scheduled therapy starts' },
            { id: 'achievementAlerts', label: 'New Achievements', desc: 'Alert when you unlock new badges or milestones' },
            { id: 'weeklyReports', label: 'Weekly Performance Reports', desc: 'Detailed analysis of your speech progress' },
            { id: 'activityAlerts', label: 'Streak Reminders', desc: 'Don\'t let your daily practice streak break' }
          ].map((pref) => (
            <label key={pref.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-500/30 transition-all cursor-pointer group">
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Lead Time Settings */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-900/10 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
            <Clock size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reminder Lead Time</h3>
        </div>
        
        <div className="bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Remind me before session starts:</span>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{settings.reminderLeadTime} minutes</span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            step="5"
            value={settings.reminderLeadTime}
            onChange={(e) => setSettings({...settings, reminderLeadTime: e.target.value})}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3">
            <span>5 min</span>
            <span>30 min</span>
            <span>60 min</span>
          </div>
        </div>
      </section>

      {/* Security Alerts */}
      <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 flex items-start space-x-4">
        <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">Security Alerts</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Important security notifications and login alerts cannot be disabled to ensure your account remains protected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
