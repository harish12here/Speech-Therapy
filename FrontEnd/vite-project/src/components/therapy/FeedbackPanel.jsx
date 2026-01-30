//src/components/therapy/FeedbackPanel.jsx
import React from 'react';
import { Award, AlertCircle, CheckCircle, TrendingUp, Volume2, Sparkles } from 'lucide-react';

const FeedbackPanel = ({ feedback, exercise }) => {
  if (!feedback) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 text-center space-y-4">
        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-2 text-gray-300">
           <Volume2 size={40} />
        </div>
        <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">Evaluation Zone</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
          Record your attempt and our AI Coach will analyze your voice!
        </p>
      </div>
    );
  }

  const getRank = (score) => {
    if (score >= 90) return { label: 'Legendary!', color: 'text-yellow-500', bg: 'bg-yellow-100', icon: '👑' };
    if (score >= 70) return { label: 'Fantastic!', color: 'text-blue-500', bg: 'bg-blue-100', icon: '🌟' };
    if (score >= 50) return { label: 'Good Job!', color: 'text-green-500', bg: 'bg-green-100', icon: '👍' };
    return { label: 'Keep Going!', color: 'text-orange-500', bg: 'bg-orange-100', icon: '💪' };
  };

  const rank = getRank(feedback.score);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl p-8 border border-gray-100 dark:border-gray-800 overflow-hidden relative">
      {/* Celebration Confetti-like Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-transparent blur-2xl rounded-full" />
      
      <div className="relative space-y-8">
        {/* Hero Rank Display */}
        <div className="text-center space-y-2">
           <div className="text-6xl mb-2">{rank.icon}</div>
           <h3 className={`text-3xl font-black uppercase tracking-tighter ${rank.color}`}>
             {rank.label}
           </h3>
           <div className="flex items-center justify-center gap-2">
             <div className="h-1.5 w-12 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-current opacity-30" style={{ width: '100%' }} />
             </div>
             <span className="text-xs font-black text-gray-400 uppercase tracking-widest">AI Result</span>
             <div className="h-1.5 w-12 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-current opacity-30" style={{ width: '100%' }} />
             </div>
           </div>
        </div>

        {/* Score Circles */}
        <div className="grid grid-cols-2 gap-4">
           <div className={`${rank.bg} dark:bg-opacity-10 p-6 rounded-[2rem] text-center space-y-1 border border-current border-opacity-10`}>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Score</p>
              <p className={`text-4xl font-black ${rank.color}`}>{feedback.score}%</p>
           </div>
           <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-[2rem] text-center space-y-1 border border-purple-200 dark:border-purple-800/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Pitch</p>
              <p className="text-4xl font-black text-purple-600 dark:text-purple-400">{feedback.pitchScore}%</p>
           </div>
        </div>

        {/* Actionable Feedback */}
        <div className="space-y-4">
           {feedback.suggestions && feedback.suggestions.length > 0 && (
             <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-3xl space-y-3">
               <h4 className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                 <Sparkles size={14} className="text-yellow-500" />
                 Mastery Tips
               </h4>
               <ul className="space-y-2">
                 {feedback.suggestions.map((suggestion, idx) => (
                   <li key={idx} className="flex gap-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                     <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                       <CheckCircle size={12} className="text-white" />
                     </div>
                     {suggestion}
                   </li>
                 ))}
               </ul>
             </div>
           )}

           {feedback.mispronouncedPhonemes && feedback.mispronouncedPhonemes.length > 0 && (
             <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
               <h4 className="flex items-center gap-2 text-xs font-black text-red-400 uppercase tracking-widest mb-3">
                 <AlertCircle size={14} />
                 Practice Zone
               </h4>
               <div className="flex flex-wrap gap-2">
                 {feedback.mispronouncedPhonemes.map((ph, idx) => (
                   <span key={idx} className="px-5 py-2 bg-white dark:bg-gray-900 rounded-2xl text-red-500 font-black text-sm shadow-sm border border-red-100 dark:border-red-800">
                     {ph}
                   </span>
                 ))}
               </div>
             </div>
           )}
        </div>
        
        {/* Next Mission Prompt */}
        <div className="text-center pt-2">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ready for the next challenge?</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPanel;                                