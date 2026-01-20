import React from 'react';
import { Volume2, Target, Award } from 'lucide-react';

const ExerciseCard = ({ exercise, onPlayReference }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl p-6 border border-white/20 dark:border-gray-800 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">Current Exercise</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${getDifficultyColor(exercise.difficulty).replace('bg-', 'dark:bg-').replace('-100', '-900/30').replace('text-', 'dark:text-').replace('-600', '-400')} ${getDifficultyColor(exercise.difficulty)}`}>
          {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
        </span>
      </div>

      {/* Main Exercise Display */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-4 animate-bounce-slow">{exercise.visualAid}</div>
        <div className="text-5xl font-child font-bold text-blue-600 dark:text-blue-400 mb-4 transition-colors">
          {exercise.text}
        </div>
        <button
          onClick={onPlayReference}
          className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <Volume2 size={18} />
          <span>Hear Pronunciation</span>
        </button>
      </div>

      {/* Exercise Details */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 transition-colors">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg transition-colors border border-transparent dark:border-gray-800">
          <Target className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Target Sound</div>
          <div className="font-semibold text-gray-800 dark:text-white transition-colors">{exercise.targetPhoneme}</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg transition-colors border border-transparent dark:border-gray-800">
          <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <div className="text-sm text-gray-600 dark:text-gray-400">Type</div>
          <div className="font-semibold text-gray-800 dark:text-white transition-colors capitalize">{exercise.type}</div>
        </div>
      </div>

      {/* Mouth Position Guide */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-transparent dark:border-blue-800 transition-colors">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 transition-colors">👄 Mouth Position Guide</h4>
        <p className="text-sm text-blue-700 dark:text-blue-400/80 transition-colors">
          For "{exercise.targetPhoneme}" sound: {getMouthPositionTip(exercise.targetPhoneme)}
        </p>
      </div>
    </div>
  );
};

// Helper function for mouth position tips
const getMouthPositionTip = (phoneme) => {
  const tips = {
    'h': 'Gently exhale with open mouth, like fogging a mirror',
    'w': 'Round your lips like you\'re about to whistle',
    'a': 'Open mouth wide, like at the dentist',
    'e': 'Smile with slightly open mouth',
    'i': 'Wide smile with teeth slightly apart',
    'o': 'Round lips in a circle shape',
    'u': 'Tightly rounded lips, like saying "oo"'
  };
  return tips[phoneme] || 'Keep your mouth relaxed and speak clearly';
};

export default ExerciseCard;