import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search, Filter, Award, Clock, Volume2, Star, Loader, AlertCircle } from 'lucide-react';
import Header from '../common/Header';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Exercise Library</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors">Choose from various speech exercises to improve your pronunciation</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 mb-8 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>{difficulty.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-blue-500" size={40} />
            <span className="ml-3 text-lg text-gray-600">Loading exercises...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center mb-6">
            <AlertCircle className="mr-2" size={20} />
            <span>{error}</span>
            <button 
              onClick={fetchExercises}
              className="ml-auto text-sm font-semibold underline hover:text-red-800 dark:hover:text-red-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* Exercises Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <div key={exercise.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white transition-colors">{exercise.title}</h3>
                    <button
                      onClick={() => toggleFavorite(exercise.id)}
                      className="text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      <Star 
                        size={20} 
                        className={exercise.favorite ? 'fill-yellow-400 text-yellow-400' : ''} 
                      />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 transition-colors">{exercise.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getCategoryColor(exercise.exercise_type).replace('bg-', 'dark:bg-').replace('-100', '-900/30').replace('text-', 'dark:text-').replace('-700', '-400')} ${getCategoryColor(exercise.exercise_type)}`}>
                      {exercise.exercise_type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${getDifficultyColor(exercise.difficulty).replace('bg-', 'dark:bg-').replace('-100', '-900/30').replace('text-', 'dark:text-').replace('-600', '-400')} ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                    {exercise.language && (
                       <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 transition-colors uppercase">
                         {exercise.language}
                       </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  {/* Stats (Mocked for now as we don't have user progress stats in this payload yet) */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock size={16} />
                      <span>5-10 min</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                      <Award size={16} />
                      <span>{exercise.points} pts</span>
                    </div>
                  </div>

                  {/* Phonemes */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Sounds:</p>
                    <div className="flex flex-wrap gap-2">
                      {getPhonemes(exercise).map((phoneme, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm font-mono border border-transparent dark:border-gray-700 transition-colors"
                        >
                          /{phoneme}/
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => startExercise(exercise.id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play size={18} />
                    <span>Start Exercise</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No exercises found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;