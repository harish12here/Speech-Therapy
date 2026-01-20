import React, { useState, useEffect } from 'react';
import { User, Camera, Save, Shield, Bell, Award, Calendar } from 'lucide-react';

import { getCurrentUser, getUserStats, updateUserProfile } from '../../services/api';

const ProfileSettings = ({ saveTrigger, onSaveComplete }) => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    gender: 'male', // Default, likely not in User model yet
    avatar: null,
    therapist: 'Unassigned',
    joinDate: '',
    level: 'Beginner'
  });

  const [stats, setStats] = useState({
    completedSessions: 0,
    totalPoints: 0,
    currentStreak: 0
  });

  const [preferences, setPreferences] = useState({
    dailyGoal: 20,
    reminderTime: '18:00',
    weeklyReport: true,
    achievementAlerts: true,
    practiceReminders: true
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [userData, statsData] = await Promise.all([
          getCurrentUser(),
          getUserStats()
        ]);

        // Format date
        const date = new Date(userData.created_at);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        setProfile(prev => ({
          ...prev,
          name: userData.username,
          email: userData.email,
          age: userData.age || '',
          avatar: userData.avatar_url,
          joinDate: formattedDate,
          // Determine level based on points (Mock logic)
          level: statsData.total_points > 100 ? 'Intermediate' : 'Beginner'
        }));

        setStats({
          completedSessions: statsData.completed_exercises,
          totalPoints: statsData.total_points,
          currentStreak: statsData.current_streak
        });

      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    if (saveTrigger > 0) {
      handleSaveProfile();
    }
  }, [saveTrigger]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate avatar upload
      alert('Avatar upload will be available soon!');
    }
  };

  const handleSaveProfile = async () => {
    try {
        setIsSaving(true);
        await updateUserProfile({
            username: profile.name,
            age: parseInt(profile.age) || null
        });
        
        // Show success notification
        const successEvent = new CustomEvent('showNotification', {
          detail: { 
            message: 'Profile updated successfully! 🎉', 
            type: 'success' 
          }
        });
        window.dispatchEvent(successEvent);
        
        if (onSaveComplete) onSaveComplete();
    } catch (err) {
        console.error("Failed to update profile", err);
        alert('Failed to update profile. Please try again.');
    } finally {
        setIsSaving(false);
    }
  };

  const achievementBadges = [
    { id: 1, name: 'First Login', icon: '🎯', earned: true, date: profile.joinDate },
    { id: 2, name: 'First Session', icon: '🔥', earned: stats.completedSessions > 0, date: null },
    { id: 3, name: '100 Point Club', icon: '⭐', earned: stats.totalPoints >= 100, date: null },
    { id: 4, name: 'Language Master', icon: '🏆', earned: false, date: null }
  ];

  if (loading) {
     return <div className="text-center p-10">Loading profile...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
          <User className="text-white" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your personal information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-xl ring-4 ring-white dark:ring-gray-800">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  profile.name.charAt(0)
                )}
              </div>
              <label className="absolute bottom-2 right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Camera className="text-blue-500" size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{profile.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/80 dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <div className="font-semibold text-gray-800 dark:text-white">{profile.level}</div>
                <div className="text-gray-600 dark:text-gray-400">Level</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <div className="font-semibold text-gray-800 dark:text-white">85%</div>
                <div className="text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
              <Award className="text-yellow-500" size={20} />
              <span>Quick Stats</span>
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Therapist:</span>
                <span className="font-semibold text-gray-800 dark:text-white">{profile.therapist}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Member since:</span>
                <span className="font-semibold text-gray-800 dark:text-white">{profile.joinDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total sessions:</span>
                <span className="font-semibold text-gray-800 dark:text-white">{stats.completedSessions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Current streak:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{stats.currentStreak} days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
              <User className="text-blue-500" size={24} />
              <span>Personal Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({...profile, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
              <Bell className="text-purple-500" size={24} />
              <span>Preferences</span>
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Daily Practice Goal: <span className="text-blue-600 dark:text-blue-400 font-semibold">{preferences.dailyGoal} minutes</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={preferences.dailyGoal}
                  onChange={(e) => setPreferences({...preferences, dailyGoal: e.target.value})}
                  className="w-full h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500"
                />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500 mt-1">
                  <span>10 min</span>
                  <span>60 min</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Daily Reminder Time</label>
                <input
                  type="time"
                  value={preferences.reminderTime}
                  onChange={(e) => setPreferences({...preferences, reminderTime: e.target.value})}
                  className="px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-4">
                {[
                  { id: 'weeklyReport', label: 'Send weekly progress report', description: 'Get detailed progress every week' },
                  { id: 'achievementAlerts', label: 'Achievement alerts', description: 'Notify when you earn badges' },
                  { id: 'practiceReminders', label: 'Practice reminders', description: 'Daily practice notifications' }
                ].map((pref) => (
                  <label key={pref.id} className="flex items-start space-x-3 cursor-pointer group">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        type="checkbox"
                        checked={preferences[pref.id]}
                        onChange={(e) => setPreferences({...preferences, [pref.id]: e.target.checked})}
                        className="w-4 h-4 text-blue-500 rounded border-gray-300 dark:border-gray-700 dark:bg-gray-800 transition-colors"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors">{pref.label}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{pref.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-900/40">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
              <Award className="text-yellow-500" size={24} />
              <span>Achievements</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievementBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`text-center p-4 rounded-xl border-2 transition-all duration-300 ${
                    badge.earned
                      ? 'border-yellow-400 bg-white dark:bg-gray-800 shadow-lg'
                      : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-60'
                  }`}
                >
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <div className="font-semibold text-gray-800 dark:text-white text-sm mb-1">{badge.name}</div>
                  <div className={`text-xs ${
                    badge.earned ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-600'
                  }`}>
                    {badge.earned ? 'Earned!' : 'Locked'}
                  </div>
                  {badge.earned && (
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{badge.date}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg ${
                  isSaving ? 'bg-blue-300 cursor-not-allowed text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isSaving ? (
                <span>Saving...</span>
              ) : (
                <>
                    <Save size={18} />
                    <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;