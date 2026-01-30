// src/components/settings/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { User, Camera, Shield, Award, Calendar, Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import { getCurrentUser, getUserStats, updateUserProfile } from '../../services/api';

const ProfileSettings = ({ saveTrigger, onSaveComplete }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    gender: 'male',
    phone: '',
    location: '',
    avatar: null,
    joinDate: '',
    level: 'Beginner'
  });

  const [stats, setStats] = useState({
    completedSessions: 0,
    totalPoints: 0,
    currentStreak: 0,
    accuracy: 0
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

        const date = new Date(userData.created_at);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        setProfile(prev => ({
          ...prev,
          name: userData.username,
          email: userData.email,
          age: userData.age || '',
          gender: userData.gender || 'male',
          avatar: userData.avatar_url,
          phone: userData.phone || '',
          location: userData.location || '',
          joinDate: formattedDate,
          level: statsData.total_points > 500 ? 'Pro' : statsData.total_points > 100 ? 'Intermediate' : 'Beginner'
        }));

        setStats({
          completedSessions: statsData.completed_exercises,
          totalPoints: statsData.total_points,
          currentStreak: statsData.current_streak,
          accuracy: statsData.accuracy || 0,
          earnedBadges: statsData.badges || []
        });

        setPreferences({
          dailyGoal: userData.daily_goal || 20,
          reminderTime: userData.reminder_time || '18:00',
          weeklyReport: userData.weekly_report ?? true,
          achievementAlerts: userData.achievement_alerts ?? true,
          practiceReminders: userData.practice_reminders ?? true
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
      const reader = new FileReader();
      reader.onload = async (e) => {
        const avatarData = e.target.result;
        setProfile({...profile, avatar: avatarData});
        
        try {
          await updateUserProfile({ avatar_url: avatarData });
          const event = new CustomEvent('showNotification', {
            detail: { message: 'Profile picture updated!', type: 'success' }
          });
          window.dispatchEvent(event);
        } catch (err) {
          console.error("Failed to update avatar", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatePayload = {
        username: profile.name,
        age: profile.age ? parseInt(profile.age) : null,
        gender: profile.gender,
        phone: profile.phone,
        location: profile.location,
        daily_goal: parseInt(preferences.dailyGoal),
        reminder_time: preferences.reminderTime,
        weekly_report: preferences.weeklyReport,
        achievement_alerts: preferences.achievementAlerts,
        practice_reminders: preferences.practiceReminders
      };
      
      console.log("Saving profile with payload:", updatePayload);
      const updatedUser = await updateUserProfile(updatePayload);
      
      // Update local state with fresh data from server
      if (updatedUser) {
        setProfile(prev => ({
          ...prev,
          name: updatedUser.username,
          age: updatedUser.age || '',
          gender: updatedUser.gender || 'male',
          phone: updatedUser.phone || '',
          location: updatedUser.location || ''
        }));
        
        setPreferences({
          dailyGoal: updatedUser.daily_goal || 20,
          reminderTime: updatedUser.reminder_time || '18:00',
          weeklyReport: updatedUser.weekly_report,
          achievement_alerts: updatedUser.achievement_alerts,
          practice_reminders: updatedUser.practice_reminders
        });
      }

      const successEvent = new CustomEvent('showNotification', {
        detail: { 
          message: 'Profile and preferences updated successfully!', 
          type: 'success' 
        }
      });
      window.dispatchEvent(successEvent);
      
      if (onSaveComplete) onSaveComplete();
    } catch (err) {
      console.error("Failed to update profile", err);
      const errorEvent = new CustomEvent('showNotification', {
        detail: { 
          message: 'Failed to update profile. Please try again.', 
          type: 'error' 
        }
      });
      window.dispatchEvent(errorEvent);
      if (onSaveComplete) onSaveComplete();
    }
  };

  const badgeConfigs = [
    { name: 'First Login', icon: '🎯', color: 'indigo', check: () => true },
    { name: 'First Session', icon: '🔥', color: 'orange', check: (s) => s.completedSessions > 0 },
    { name: '100 Point Club', icon: '⭐', color: 'yellow', check: (s) => s.totalPoints >= 100 },
    { name: '7-Day Streak', icon: '⚡', color: 'green', check: (s) => s.currentStreak >= 7 },
    { name: 'Language Master', icon: '🏆', color: 'purple', check: (s) => s.completedSessions >= 50 },
    { name: 'Perfect Session', icon: '✨', color: 'blue', check: (s) => s.accuracy >= 95 }
  ];

  const achievementBadges = badgeConfigs.map((badge, index) => ({
    id: index + 1,
    ...badge,
    earned: stats.earnedBadges?.includes(badge.name) || badge.check(stats)
  }));

  if (loading) {
     return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading your profile...</p>
        </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative group">
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg transition-transform group-hover:scale-105">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group">
            <Camera className="text-indigo-600 dark:text-indigo-400" size={18} />
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Mail size={14} className="text-gray-400" />
                <p className="text-gray-600 dark:text-gray-300">{profile.email}</p>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Joined {profile.joinDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{profile.level}</span>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/20">
              <Shield size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Verified Account</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/10 dark:to-gray-800/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/20">
              <div className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Sessions</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.completedSessions}</div>
            </div>
            <div className="bg-gradient-to-r from-teal-50 to-white dark:from-teal-900/10 dark:to-gray-800/30 p-4 rounded-xl border border-teal-100 dark:border-teal-900/20">
              <div className="text-xs font-semibold text-teal-500 uppercase tracking-wider">Points</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalPoints}</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/10 dark:to-gray-800/30 p-4 rounded-xl border border-orange-100 dark:border-orange-900/20">
              <div className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Streak</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.currentStreak} days</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800/30 p-4 rounded-xl border border-purple-100 dark:border-purple-900/20">
              <div className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Accuracy</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{Number(stats.accuracy).toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-900/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
              <User size={16} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({...profile, age: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                  placeholder="Age"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({...profile, gender: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Practice Preferences */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/30 dark:to-teal-900/10 text-teal-600 dark:text-teal-400 rounded-lg flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Practice Preferences</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Daily Practice Goal
                </label>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{preferences.dailyGoal} minutes</span>
              </div>
              <div className="relative">
                <input
                  type="range" min="10" max="60" step="5"
                  value={preferences.dailyGoal}
                  onChange={(e) => setPreferences({...preferences, dailyGoal: e.target.value})}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10 min</span>
                  <span>35 min</span>
                  <span>60 min</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { id: 'weeklyReport', label: 'Weekly Progress Report', desc: 'Receive weekly summaries of your progress' },
                { id: 'achievementAlerts', label: 'Achievement Notifications', desc: 'Get notified when you earn badges' },
                { id: 'practiceReminders', label: 'Daily Practice Reminders', desc: 'Daily reminders to practice' }
              ].map((pref) => (
                <label key={pref.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors group">
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {pref.label}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{pref.desc}</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={preferences[pref.id]}
                      onChange={(e) => setPreferences({...preferences, [pref.id]: e.target.checked})}
                      className="sr-only"
                    />
                    <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                      preferences[pref.id] 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                        preferences[pref.id] ? 'translate-x-4' : ''
                      }`} />
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Badges Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-900/10 text-yellow-600 dark:text-yellow-400 rounded-lg flex items-center justify-center">
              <Award size={16} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Achievement Badges</h3>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {achievementBadges.filter(b => b.earned).length} of {achievementBadges.length} earned
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievementBadges.map((badge) => (
            <div
              key={badge.id}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                badge.earned
                  ? 'border-indigo-200 dark:border-indigo-500/30 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm'
                  : 'border-gray-200 dark:border-gray-600 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 grayscale opacity-60'
              }`}
            >
              <div className={`text-3xl mb-3 ${badge.earned ? 'animate-bounce' : ''}`}>{badge.icon}</div>
              <div className="text-xs font-semibold text-gray-900 dark:text-white text-center mb-2">
                {badge.name}
              </div>
              <div className={`text-[10px] font-medium px-2 py-1 rounded-full ${
                badge.earned
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              }`}>
                {badge.earned ? 'Earned' : 'Locked'}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfileSettings;