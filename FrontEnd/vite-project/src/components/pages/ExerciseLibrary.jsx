//src/components/pages/ExerciseLibrary.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search, Filter, Award, Clock, Volume2, Star, Loader, AlertCircle, Sparkles } from 'lucide-react';
import { getExercises } from '../../services/api';

const ExerciseLibrary = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const data = await getExercises();
      setExercises(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Exercises' },
    { id: 'word', name: 'Words' },
    { id: 'sentence', name: 'Sentences' },
    { id: 'phoneme', name: 'Phonemes' },
    { id: 'story', name: 'Stories' }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'easy', name: 'Easy' },
    { id: 'medium', name: 'Medium' },
    { id: 'hard', name: 'Hard' }
  ];

  // Helper to safely get phonemes array
  const getPhonemes = (exercise) => {
    if (exercise.target_phoneme) return [exercise.target_phoneme];
    return [];
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (exercise.description && exercise.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Map backend exercise_type to category
    const matchesCategory = selectedCategory === 'all' || exercise.exercise_type === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const startExercise = (exerciseId) => {
    navigate('/therapy', { state: { exerciseId } });
  };

  const toggleFavorite = (exerciseId) => {
    // Toggle favorite logic would ideally be an API call
    console.log('Toggle favorite:', exerciseId);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      phoneme: 'bg-purple-100 text-purple-700',
      word: 'bg-blue-100 text-blue-700',
      sentence: 'bg-green-100 text-green-700',
      story: 'bg-orange-100 text-orange-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <>
      <div className="max-w-6xl mx-auto py-6 md:py-8 px-4">
        {/* Animated Hero Header - More Compact */}
        <div className="mb-8 md:mb-12 text-center md:text-left relative">
           <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-full mb-3 animate-fadeIn">
              <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">Choose Your Path</span>
           </div>
           <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white transition-colors tracking-tighter">
             Mission <span className="text-blue-600">Select</span>
           </h1>
           <p className="text-gray-500 dark:text-gray-400 mt-2 text-base font-medium max-w-sm">
             Every word you master makes you a hero. Ready to start today?
           </p>
        </div>

        {/* Dynamic Filters Hub - More Compact */}
        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-xl border border-white/20 dark:border-gray-800 mb-8 animate-fadeIn transition-all">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 items-center">
            {/* Search - Ultra Modern */}
            <div className="w-full lg:col-span-6 relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-gray-400">
                <Search size={18} className="shrink-0" />
              </div>
              <input
                type="text"
                placeholder="Search for a hero mission..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold shadow-sm"
              />
            </div>

            {/* Selectors - Gamified */}
            <div className="w-full lg:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 px-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer shadow-sm"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full lg:col-span-3">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full py-3 px-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-white rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black uppercase text-[10px] tracking-widest appearance-none cursor-pointer shadow-sm"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading/Error States - Integrated */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20 space-y-4 animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Loading Missions...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 p-6 rounded-3xl flex flex-col items-center mb-6 text-center animate-in zoom-in-95">
            <AlertCircle className="mb-3 text-red-500" size={32} />
            <h3 className="text-xl font-black mb-1 uppercase tracking-tighter">Mission Interrupted</h3>
            <p className="text-sm font-medium mb-4 opacity-80">{error}</p>
            <button 
              onClick={fetchExercises}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-black text-xs transition-all active:scale-95 shadow-lg shadow-red-500/30"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Mission Grid - More Compact Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExercises.map((exercise) => (
              <div 
                key={exercise.id} 
                className="group bg-white dark:bg-gray-900 rounded-[2rem] shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Mission Visual Hub */}
                <div className="h-28 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-950 flex items-center justify-center relative overflow-hidden transition-all duration-500 shrink-0">
                   <div className="text-5xl group-hover:scale-110 transition-transform duration-500 drop-shadow-lg z-10">
                     {exercise.visual_aid_url || "🚀"}
                   </div>
                   {/* Background Glow */}
                   <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getDifficultyColor(exercise.difficulty).replace('text-', 'dark:text-').replace('-600', '-400')} ${getDifficultyColor(exercise.difficulty)}`}>
                         {exercise.difficulty}
                       </span>
                       <button
                         onClick={(e) => { e.stopPropagation(); toggleFavorite(exercise.id); }}
                         className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all group/fav"
                       >
                         <Star 
                           size={14} 
                           className={exercise.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 group-hover/fav:text-yellow-400'} 
                         />
                       </button>
                    </div>
                    
                    <h3 className="text-lg font-black text-gray-900 dark:text-white transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 leading-tight">
                      {exercise.title}
                    </h3>
                  </div>

                  {/* Mission Rewards & Details */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-2 py-2 rounded-xl flex items-center justify-center gap-1.5 border border-blue-100 dark:border-blue-900/30">
                       <Award size={14} className="text-blue-600 dark:text-blue-400" />
                       <span className="text-[9px] font-black text-blue-700 dark:text-blue-300 uppercase">{exercise.points} Pts</span>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 px-2 py-2 rounded-xl flex items-center justify-center gap-1.5 border border-purple-100 dark:border-purple-900/30">
                       <Clock size={14} className="text-purple-600 dark:text-purple-400" />
                       <span className="text-[9px] font-black text-purple-700 dark:text-purple-300 uppercase">Short</span>
                    </div>
                  </div>

                  {/* Mission Action */}
                  <button
                    onClick={() => startExercise(exercise.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 mt-auto"
                  >
                    <Play size={14} fill="currentColor" />
                    <span>START MISSION</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Final Adventure State */}
        {!loading && !error && filteredExercises.length === 0 && (
          <div className="text-center py-20 animate-in fade-in">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
               <Search size={32} />
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white mb-1 uppercase tracking-tighter">Unknown Territory</h3>
            <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto">We couldn't find a mission matching your scouts. Try a different path!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ExerciseLibrary;