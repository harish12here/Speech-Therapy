import React from 'react';
import { Volume2, Target, Award } from 'lucide-react';

const ExerciseCard = ({ exercise, onPlayReference, flat = false }) => {
  const getDifficultyColor = (difficulty) => {
    // ... (keeping internal logic same)
    switch (difficulty) {
      case 'easy': return 'from-green-400 to-emerald-600 shadow-green-500/20';
      case 'medium': return 'from-yellow-400 to-orange-600 shadow-orange-500/20';
      case 'hard': return 'from-red-400 to-rose-600 shadow-rose-500/20';
      default: return 'from-gray-400 to-gray-600 shadow-gray-500/20';
    }
  };

  const getMouthPositionTip = (phoneme) => {
    // ... (keeping internal logic same)
    const tips = {
      'h': 'Gently exhale with open mouth, like fogging a mirror',
      'w': 'Round your lips like you\'re about to whistle',
      'a': 'Open mouth wide, like at the dentist',
      'e': 'Smile with slightly open mouth',
      'i': 'Wide smile with teeth slightly apart',
      'o': 'Round lips in a circle shape',
      'u': 'Tightly rounded lips, like saying "oo"',
      'p': 'Press lips together and release air gently',
      'm': 'Close lips and hum through your nose',
      'b': 'Press lips together then pop them open with voice',
      'k': 'Lift back of tongue to roof of mouth',
      't': 'Tap tongue tip behind front teeth',
      'd': 'Touch tongue to upper teeth and release with voice',
      's': 'Hiss like a snake through teeth',
      'r': 'Curl tongue tip up without touching roof'
    };
    return tips[phoneme?.toLowerCase()] || 'Keep your mouth relaxed and speak clearly';
  };

  const containerClasses = flat 
    ? "relative w-full overflow-hidden" 
    : "bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl p-6 md:p-10 border border-gray-100 dark:border-gray-800 transition-all relative overflow-hidden group";

  return (
    <div className={containerClasses}>
      {/* Difficulty Badge - Floating */}
      <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-xl bg-gradient-to-r text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg z-10 ${getDifficultyColor(exercise.difficulty)}`}>
        {exercise.difficulty}
      </div>

      {/* Background Micro-pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className={`flex flex-col items-center text-center relative ${flat ? "p-8 md:p-12" : "space-y-6"}`}>
        {/* Visual Aid */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl opacity-50" />
          <div className="text-6xl md:text-8xl mb-2 animate-bounce-slow drop-shadow-xl filter relative z-10 select-none">
            {exercise.visualAid}
          </div>
        </div>
        
        {/* Target Word Focus */}
        <div className="space-y-4">
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white transition-colors tracking-tighter decoration-blue-500/30 underline-offset-8">
            {exercise.text}
          </h2>
          
          <div className="flex flex-col items-center pt-2">
            <button
              onClick={onPlayReference}
              className="group flex items-center gap-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white px-8 py-4 rounded-2xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-md"
            >
              <Volume2 className="group-hover:animate-pulse" size={24} />
              <span className="text-base uppercase tracking-widest">Master Sample</span>
            </button>
          </div>
        </div>

        {/* Technical Guidance */}
        <div className="grid grid-cols-2 gap-4 w-full pt-8 mt-4 border-t border-gray-100 dark:border-gray-800">
           <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/80 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 transition-colors text-left shadow-sm">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center shrink-0">
                <Target className="text-red-500" size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate">Goal Sound</p>
                <p className="text-xl font-black text-gray-800 dark:text-white uppercase truncate">{exercise.targetPhoneme}</p>
              </div>
           </div>

           <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/80 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 transition-colors text-left shadow-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center shrink-0">
                <Award className="text-purple-500" size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate">Mission Mode</p>
                <p className="text-xl font-black text-gray-800 dark:text-white capitalize truncate">{exercise.type}</p>
              </div>
           </div>
        </div>

        {/* Coach Advice */}
        <div className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 p-6 md:p-8 rounded-[2rem] text-white shadow-xl shadow-blue-500/20 text-left relative overflow-hidden mt-6">
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
               <span className="text-2xl">🗣️</span>
            </div>
            <div>
              <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-blue-100 mb-1">Coach Insight</h4>
              <p className="text-base md:text-xl font-black leading-tight">
                 {getMouthPositionTip(exercise.targetPhoneme)}
              </p>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;