//src/components/pages/ProgressReports.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer,  Cell 
} from 'recharts';
import { Download, Calendar, TrendingUp, Award, Clock, Volume2, AlertCircle, Loader2 } from 'lucide-react';
import { 
  getProgressStats, 
  getWeeklyProgress, 
  getPhonemeMastery, 
  getSessionHistory, 
  getRecommendations 
} from '../../services/api';
import SessionDetailsModal from '../dashboard/SessionDetailsModal';

const ProgressReports = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal State
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for data
  const [overallStats, setOverallStats] = useState({
    totalSessions: 0,
    totalTime: '0h 0m',
    averageAccuracy: 0,
    bestScore: 0,
    currentStreak: 0
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [phonemeData, setPhonemeData] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [stats, weekly, phonemes, history, recs] = await Promise.all([
          getProgressStats(),
          getWeeklyProgress(),
          getPhonemeMastery(),
          getSessionHistory(),
          getRecommendations()
        ]);

        // Process Stats
        // Convert minutes to hours and minutes
        const totalMinutes = stats.total_duration || 0;
        const hours = Math.floor(totalMinutes / 60);
        const mins = Math.floor(totalMinutes % 60);
        
        setOverallStats({
          totalSessions: stats.total_sessions || 0,
          totalTime: `${hours}h ${mins}m`,
          averageAccuracy: stats.average_score || 0,
          currentStreak: stats.current_streak || 0,
          bestScore: 0 // Not returned by backend yet, could be calculated
        });

        // Process Weekly Data
        setWeeklyData(weekly);

        // Process Phoneme Data
        setPhonemeData(phonemes);

        // Process History
        // Backend returns SessionResponse objects
        const formattedHistory = history.map(session => ({
          id: session.id,
          date: new Date(session.timestamp).toLocaleDateString(),
          duration: session.duration ? `${Math.round(session.duration)}s` : 'N/A',
          accuracy: session.overall_score ? Math.round(session.overall_score) : (session.pronunciation_score ? Math.round(session.pronunciation_score) : 0),
          exercises: session.exercise_id ? '1' : '1', // Placeholder or count
          type: 'Practice', 
          details_id: session.id,
          // Include full details for modal
          points_earned: session.points_earned,
          ai_feedback: session.ai_feedback,
          strengths: session.strengths,
          areas_to_improve: session.areas_to_improve
        }));
        setSessionHistory(formattedHistory);

        // Process Recommendations
        setRecommendations(recs);

      } catch (err) {
        console.error("Error fetching progress data:", err);
        setError("Failed to load progress data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exportReport = () => {
    // Simple print-to-pdf using browser capabilities
    window.print();
  };

  const handleViewDetails = (sessionId) => {
    const session = sessionHistory.find(s => s.id === sessionId);
    if (session) {
      setSelectedSession(session);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Progress Reports</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">Track your speech therapy journey and improvements</p>
          </div>
          
          <div className="flex space-x-3 mt-4 lg:mt-0 no-print">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="week">Last Week</option>
              {/* Other options would require API support for filtering */}
            </select>
            
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={18} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{overallStats.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Calendar className="text-blue-500 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Practice</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{overallStats.totalTime}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Clock className="text-green-500 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Accuracy</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{overallStats.averageAccuracy}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="text-purple-500 dark:text-purple-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{overallStats.currentStreak} days</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Award className="text-orange-500 dark:text-orange-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Accuracy Trend Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Accuracy Trend (Last 7 Days)</h3>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" tick={{fill: '#94a3b8'}} />
                  <YAxis tick={{fill: '#94a3b8'}} domain={[0, 100]} />
                  <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    name="Accuracy %"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex h-64 items-center justify-center text-gray-500">
                    No data available for this week
                </div>
            )}
          </div>

          {/* Phoneme Mastery */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Phoneme Mastery</h3>
             {phonemeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={phonemeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" tick={{fill: '#94a3b8'}} />
                    <YAxis tick={{fill: '#94a3b8'}} domain={[0, 100]} />
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                    <Bar dataKey="accuracy" name="Accuracy %">
                      {phonemeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill || '#3B82F6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             ) : (
                <div className="flex h-64 items-center justify-center text-gray-500">
                    No phoneme data available yet
                </div>
            )}
          </div>
        </div>

        {/* Session History */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Sessions</h3>
          {sessionHistory.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Accuracy</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Exercises</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 no-print">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sessionHistory.map((session) => (
                    <tr key={session.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="py-3 px-4 text-sm text-gray-800 dark:text-gray-200">{session.date}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{session.duration}</td>
                        <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm font-semibold ${
                            session.accuracy >= 80 ? 'text-green-600 dark:text-green-400' : 
                            session.accuracy >= 70 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                            }`}>
                            {session.accuracy}%
                            </span>
                        </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{session.exercises}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{session.type}</td>
                        <td className="py-3 px-4 no-print">
                      <button 
                        onClick={() => handleViewDetails(session.id)}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          ) : (
                <div className="p-8 text-center text-gray-500">
                    No recent sessions found. Start practicing to see your history!
                </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 transition-colors">
          <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">💡 Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        {rec.icon === 'Volume2' && <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />}
                        {rec.icon === 'TrendingUp' && <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />}
                        {rec.icon === 'Clock' && <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />}
                        {!['Volume2', 'TrendingUp', 'Clock'].includes(rec.icon) && <Award className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />}
                        
                        <div>
                            <p className="font-semibold text-blue-800 dark:text-blue-200">{rec.title}</p>
                            <p className="text-blue-700 dark:text-blue-400/80 text-sm">{rec.description}</p>
                        </div>
                    </div>
                ))
             ) : (
                <div className="col-span-2 text-center text-blue-800 dark:text-blue-300">
                    Keep practicing to get personalized recommendations!
                </div>
             )}
          </div>
        </div>
      </div>
      
      {/* Session Details Modal */}
      {isModalOpen && (
        <SessionDetailsModal 
          session={selectedSession} 
          onClose={closeModal} 
        />
      )}
    </>
  );
};

export default ProgressReports;