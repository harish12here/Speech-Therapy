//src/components/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Award, TrendingUp, Clock, Activity, BarChart3, User, Video } from 'lucide-react'
import SessionStartModal from '../common/SessionStartModal'
import { getCurrentUser, getProgressStats, getSessionHistory, getRecommendations } from '../../services/api'

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completed_exercises: 0,
    total_points: 0,
    current_streak: 0,
    total_duration: 0,
    recent_activity: []
  });
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, progressData, historyData, recsData] = await Promise.all([
          getCurrentUser(),
          getProgressStats(),
          getSessionHistory(),
          getRecommendations()
        ]);
        
        setUser(userData);
        setStats({
          completed_exercises: progressData.exercises_completed || 0,
          total_points: progressData.total_points || 0,
          current_streak: progressData.current_streak || 0,
          total_duration: progressData.total_duration || 0,
          recent_activity: historyData.map(s => ({
            type: s.overall_score > 80 ? 'achievement' : 'improvement',
            title: s.exercise_id ? 'Exercise Completed' : 'Practice Session',
            desc: `Scored ${Math.round(s.overall_score || 0)}% accuracy`,
            time: s.timestamp
          }))
        });
        setRecommendations(recsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Level Logic
  const level = Math.floor(stats.total_points / 500) + 1;
  const currentLevelXP = stats.total_points % 500;
  const nextLevelXP = 500;
  const xpPercentage = (currentLevelXP / nextLevelXP) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SessionStartModal 
        isOpen={isSessionModalOpen} 
        onClose={() => setIsSessionModalOpen(false)} 
      />
      
      {/* Welcome Section */}
      <div className="mb-6 md:mb-8 text-center md:text-left px-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white leading-tight">
          Good morning, {user?.username || 'Learner'}! 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-base md:text-lg">Ready for today's speech practice?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-10">
         <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
           <div className="flex items-center justify-between mb-2 md:mb-4">
             <h3 className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">Daily Streak</h3>
             <div className="p-1.5 md:p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
               <TrendingUp className="text-green-500 w-4 h-4 md:w-5 md:h-5" />
             </div>
           </div>
           <p className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white">{stats.current_streak} days</p>
           <p className="text-green-600 dark:text-green-400 text-[10px] md:text-sm mt-1 md:mt-2 font-medium">Keep it up!</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
           <div className="flex items-center justify-between mb-2 md:mb-4">
             <h3 className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">Exercises</h3>
             <div className="p-1.5 md:p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
               <Activity className="text-blue-500 w-4 h-4 md:w-5 md:h-5" />
             </div>
           </div>
           <p className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white">{stats.completed_exercises}</p>
           <p className="text-blue-600 dark:text-blue-400 text-[10px] md:text-sm mt-1 md:mt-2 font-medium">Completed</p>
        </div>
        
         <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
           <div className="flex items-center justify-between mb-2 md:mb-4">
             <h3 className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">Points</h3>
             <div className="p-1.5 md:p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
               <Award className="text-yellow-500 w-4 h-4 md:w-5 md:h-5" />
             </div>
           </div>
           <p className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white">{stats.total_points}</p>
           <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-sm mt-1 md:mt-2 font-medium">Earned</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
           <div className="flex items-center justify-between mb-2 md:mb-4">
             <h3 className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium truncate">Time Practiced</h3>
             <div className="p-1.5 md:p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
               <Clock className="text-purple-500 w-4 h-4 md:w-5 md:h-5" />
             </div>
           </div>
           <p className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white">{Math.round(stats.total_duration)}m</p>
           <p className="text-purple-600 dark:text-purple-400 text-[10px] md:text-sm mt-1 md:mt-2 font-medium">Lifetime</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left: Quick Actions & Recent Activity */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6 px-1">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
              <button 
                onClick={() => setIsSessionModalOpen(true)}
                className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white p-4 md:p-6 rounded-2xl font-bold transition-all duration-300 flex flex-col items-start gap-2 md:gap-4 shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <div className="p-2 md:p-3 bg-white/20 rounded-xl">
                  <Play size={20} fill="white" className="md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <div className="text-sm md:text-lg">Start Session</div>
                  <div className="hidden md:block text-sm text-blue-100 font-normal">Begin daily practice</div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform hidden sm:block">
                  <Play size={80} fill="white" />
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/video-analysis')}
                className="group relative overflow-hidden bg-indigo-600 hover:bg-indigo-700 text-white p-4 md:p-6 rounded-2xl font-bold transition-all duration-300 flex flex-col items-start gap-2 md:gap-4 shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                <div className="p-2 md:p-3 bg-white/20 rounded-xl">
                  <Video size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <div className="text-sm md:text-lg">Video Analysis</div>
                  <div className="hidden md:block text-sm text-indigo-100 font-normal">AI feedback</div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform hidden sm:block">
                  <Video size={80} />
                </div>
              </button>

              <button 
                onClick={() => navigate('/progress')}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 active:scale-95"
              >
                <div className="p-2 md:p-3 bg-green-500 rounded-xl text-white">
                  <BarChart3 size={18} className="md:w-5 md:h-5" />
                </div>
                <div className="text-left first-letter:">
                  <div className="text-sm md:text-base font-bold dark:text-white">Progress</div>
                  <div className="text-[10px] md:text-xs text-gray-500">Growth stats</div>
                </div>
              </button>

              <button 
                onClick={() => navigate('/exercises')}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 active:scale-95"
              >
                <div className="p-2 md:p-3 bg-purple-500 rounded-xl text-white">
                  <Activity size={18} className="md:w-5 md:h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm md:text-base font-bold dark:text-white">Exercises</div>
                  <div className="text-[10px] md:text-xs text-gray-500">Library</div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">Recent Activity</h2>
              <button 
                onClick={() => navigate('/progress')}
                className="text-xs md:text-sm font-bold text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>
            {stats.recent_activity.length > 0 ? (
              <div className="space-y-3 md:space-y-4">
                {stats.recent_activity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                    <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 shrink-0">
                        {activity.type === 'achievement' ? <Award className="text-blue-600 dark:text-blue-400 w-5 h-5 md:w-6 md:h-6" /> : <TrendingUp className="text-green-600 dark:text-green-400 w-5 h-5 md:w-6 md:h-6" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 dark:text-white text-sm md:text-base truncate">{activity.title}</p>
                        <p className="text-[10px] md:text-sm text-gray-500 truncate">{activity.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] md:text-sm font-medium text-gray-400 whitespace-nowrap ml-2">{new Date(activity.time).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 md:py-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity size={28} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm md:text-base font-medium">No recent activity yet.</p>
                <button onClick={() => setIsSessionModalOpen(true)} className="mt-2 md:mt-4 text-xs md:text-base text-blue-600 font-bold hover:underline">Start your first exercise!</button>
              </div>
            )}
          </div>
        </div>

        {/* Right: User Stats / Goals */}
        <div className="space-y-6 md:space-y-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 md:p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4">Level Progress</h3>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl md:text-3xl font-bold">Level {level}</span>
                <span className="text-xs md:text-sm text-blue-100 font-medium">{currentLevelXP}/{nextLevelXP} XP</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5 md:h-3 mb-4 md:mb-6 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000" 
                  style={{ width: `${xpPercentage}%` }}
                ></div>
              </div>
              <p className="text-[10px] md:text-sm text-blue-100">
                {xpPercentage >= 80 ? "Almost there! Keep going!" : "Keep practicing to level up."}
              </p>
            </div>
            <Award className="absolute -bottom-4 -right-4 opacity-10 w-24 h-24 md:w-36 md:h-36" />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-white mb-4">Recommended for You</h2>
            <div className="space-y-3 md:space-y-4">
               {recommendations.length > 0 ? (
                 recommendations.slice(0, 3).map((item, i) => (
                   <div key={i} className="flex gap-3 md:gap-4 p-2 md:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                     <div className="flex flex-col items-center justify-center w-10 h-10 md:w-14 md:h-14 bg-gray-100 dark:bg-gray-800 rounded-xl p-2 group-hover:bg-blue-600 transition-colors shrink-0">
                       {item.icon === 'TrendingUp' ? <TrendingUp size={18} className="text-blue-500 group-hover:text-white md:w-5 md:h-5" /> : <Clock size={18} className="text-purple-500 group-hover:text-white md:w-5 md:h-5" />}
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="font-bold text-gray-800 dark:text-white text-xs md:text-sm truncate">{item.title}</p>
                       <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2">{item.description}</p>
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="text-center py-4 md:py-6 text-gray-500 text-[10px] md:text-sm">
                   Complete sessions to get personalized recommendations.
                 </div>
               )}
               <button 
                onClick={() => navigate('/exercises')}
                className="w-full py-2.5 md:py-3 text-[10px] md:text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
               >
                 Browse All Exercises
               </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard