import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Award, TrendingUp, Clock, Activity, BarChart3, User, Video } from 'lucide-react'
import Header from '../common/Header'
import SessionStartModal from '../common/SessionStartModal'
import { getCurrentUser, getUserStats } from '../../services/api'

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [stats, setStats] = useState({
    completed_exercises: 0,
    total_points: 0,
    current_streak: 0,
    recent_activity: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        
        const statsData = await getUserStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />
      <SessionStartModal 
        isOpen={isSessionModalOpen} 
        onClose={() => setIsSessionModalOpen(false)} 
      />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Good morning, {user?.username || 'Learner'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Ready for today's speech practice?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-gray-500 dark:text-gray-400 font-medium">Daily Streak</h3>
               <TrendingUp className="text-green-500" size={24} />
             </div>
             <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.current_streak} days</p>
             <p className="text-green-600 dark:text-green-400 text-sm mt-1">Keep it up!</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-gray-500 dark:text-gray-400 font-medium">Exercises</h3>
               <Activity className="text-blue-500" size={24} />
             </div>
             <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.completed_exercises}</p>
             <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">Completed</p>
          </div>
          
           <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-gray-500 dark:text-gray-400 font-medium">Points</h3>
               <Award className="text-yellow-500" size={24} />
             </div>
             <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total_points}</p>
             <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Total earned</p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-gray-500 dark:text-gray-400 font-medium">Time Practiced</h3>
               <Clock className="text-purple-500" size={24} />
             </div>
             <p className="text-2xl font-bold text-gray-800 dark:text-white">0m</p>
             <p className="text-purple-600 dark:text-purple-400 text-sm mt-1">This week</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => setIsSessionModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Play size={20} />
              <span>Start Session</span>
            </button>
            
            <button 
              onClick={() => navigate('/progress')}
              className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <BarChart3 size={20} />
              <span>View Progress</span>
            </button>

            <button 
              onClick={() => navigate('/video-analysis')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Video size={20} />
              <span>AI Video Analysis</span>
            </button>
            
            <button 
              onClick={() => navigate('/exercises')}
              className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Activity size={20} />
              <span>Exercises</span>
            </button>
            
            <button 
              onClick={() => navigate('/settings')}
              className="bg-gray-500 hover:bg-gray-600 text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
          {stats.recent_activity.length > 0 ? (
            <div className="space-y-4">
              {stats.recent_activity.map((activity, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30`}>
                      {activity.type === 'achievement' ? <Award className="text-blue-600 dark:text-blue-400" size={20} /> : <TrendingUp className="text-green-600 dark:text-green-400" size={20} />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{activity.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.desc}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(activity.time).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent activity yet. Start your first exercise!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard