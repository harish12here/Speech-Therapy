import React from 'react';
import { Award, AlertCircle, CheckCircle, TrendingUp, Volume2 } from 'lucide-react';

const FeedbackPanel = ({ feedback, exercise }) => {
  if (!feedback) {
    return (
      <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-800 transition-colors">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors">AI Feedback</h3>
        <div className="text-center py-8">
          <Volume2 className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3 transition-colors" />
          <p className="text-gray-500 dark:text-gray-400">Record your speech to get AI feedback</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-800 transition-colors">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors">AI Feedback</h3>

      {/* Overall Score */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full transition-colors ${getScoreBgColor(feedback.score).replace('bg-', 'dark:bg-').replace('100', '900/30')} ${getScoreBgColor(feedback.score)} mb-3 shadow-lg`}>
          <span className={`text-2xl font-bold transition-colors ${getScoreColor(feedback.score).replace('text-', 'dark:text-').replace('600', '400')} ${getScoreColor(feedback.score)}`}>
            {feedback.score}%
          </span>
        </div>
        <p className="text-lg font-semibold text-gray-800 dark:text-white transition-colors">{feedback.pronunciation}</p>
      </div>

      {/* Detailed Scores */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">
            <span>Pronunciation</span>
            <span>{feedback.score}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 transition-colors">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${getScoreBgColor(feedback.score).replace('bg-', 'bg-').replace('100', '500')}`}
              style={{ width: `${feedback.score}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">
            <span>Pitch Accuracy</span>
            <span>{feedback.pitchScore}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 transition-colors">
            <div 
              className="h-2 rounded-full bg-purple-500 transition-all duration-1000"
              style={{ width: `${feedback.pitchScore}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors">
            <span>Fluency</span>
            <span>{feedback.fluencyScore}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 transition-colors">
            <div 
              className="h-2 rounded-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${feedback.fluencyScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {feedback.suggestions && feedback.suggestions.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center transition-colors">
            <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
            Suggestions for Improvement
          </h4>
          <ul className="space-y-2">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start text-sm text-gray-700 dark:text-gray-300 transition-colors">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mispronounced Sounds */}
      {feedback.mispronouncedPhonemes && feedback.mispronouncedPhonemes.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center transition-colors">
            <TrendingUp className="w-4 h-4 text-red-500 mr-2" />
            Sounds to Practice
          </h4>
          <div className="flex flex-wrap gap-2">
            {feedback.mispronouncedPhonemes.map((phoneme, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium border border-transparent dark:border-red-900/30 transition-colors"
              >
                {phoneme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Encouragement */}
      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50 transition-colors">
        <p className="text-sm text-green-700 dark:text-green-400 text-center transition-colors">
          {feedback.score >= 90 
            ? "Excellent! Perfect pronunciation! 🎉" 
            : feedback.score >= 70 
            ? "Good job! Keep practicing! 💪" 
            : "Nice try! Practice makes perfect! 🌟"
          }
        </p>
      </div>
    </div>
  );
};

export default FeedbackPanel;                                