import React from 'react';
import { X, Calendar, Clock, Trophy, AlertCircle, CheckCircle2, FileText, Activity } from 'lucide-react';

const SessionDetailsModal = ({ session, onClose }) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800 animate-scaleIn">
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Session Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review your practice analysis</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Key Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
                <Calendar size={18} />
                <span className="text-sm font-semibold">Date</span>
              </div>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{session.date}</p>
            </div>

            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
              <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 mb-2">
                <Clock size={18} />
                <span className="text-sm font-semibold">Duration</span>
              </div>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{session.duration}</p>
            </div>

            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-2">
                <Activity size={18} />
                <span className="text-sm font-semibold">Accuracy</span>
              </div>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{session.accuracy}%</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-2">
                <Trophy size={18} />
                <span className="text-sm font-semibold">Points</span>
              </div>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{session.points_earned || 0}</p>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <FileText size={20} className="text-blue-500" />
              AI Feedback
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
               {session.ai_feedback ? (
                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm lg:text-base">
                   {session.ai_feedback}
                 </p>
               ) : (
                 <p className="text-gray-500 text-sm italic">No detailed AI feedback available for this session.</p>
               )}
            </div>
          </div>

          {/* Strengths & Improvements Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-500" />
                Strengths
              </h3>
              {session.strengths && session.strengths.length > 0 ? (
                <ul className="space-y-2">
                  {session.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">No specific strengths recorded.</p>
              )}
            </div>

            {/* Improvements */}
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <AlertCircle size={18} className="text-orange-500" />
                Areas to Improve
              </h3>
              {session.areas_to_improve && session.areas_to_improve.length > 0 ? (
                 <ul className="space-y-2">
                  {session.areas_to_improve.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">No specific improvements recorded.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailsModal;
