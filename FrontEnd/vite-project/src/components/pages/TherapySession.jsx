//src/components/pages/TherapySession.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, SkipForward, Award, Volume2, RotateCcw, Sparkles, Loader } from 'lucide-react';
import AudioRecorder from '../therapy/AudioRecorder';
import FeedbackPanel from '../therapy/FeedbackPanel';
import ExerciseCard from '../therapy/ExerciseCard';
import VoiceVisualizer from '../common/VoiceVisualizer';
import { AnalysisLoader } from '../common/LoadingSpinner';
import { getExerciseById, analyzeSpeech, getExercises } from '../../services/api';

const TherapySession = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentSession, setCurrentSession] = useState({
    exercise: null,
    progress: {
      current: 1,
      total: 10
    },
    feedback: null
  });

  const [allExercises, setAllExercises] = useState([]);
  const [activeExerciseId, setActiveExerciseId] = useState(location.state?.exerciseId);

  useEffect(() => {
    // If no specific exercise selected from library, find the first available one or load a default set
    if (!activeExerciseId) {
      const loadDefaultExercise = async () => {
        try {
          const exercises = await getExercises();
          if (exercises && exercises.length > 0) {
            // Setup with the first exercise by default
            setAllExercises(exercises);
            setActiveExerciseId(exercises[0].id);
          } else {
            setError("No exercises available in the library.");
          }
        } catch (err) {
            console.error(err);
            setError("Failed to load generic session.");
        } finally {
            setLoading(false);
        }
      };
      
      loadDefaultExercise();
    }
  }, [activeExerciseId, location.state]);

  useEffect(() => {
    // Fetch all exercises to build the session queue
    const fetchAll = async () => {
      try {
        const exercises = await getExercises();
        setAllExercises(exercises);
      } catch (e) {
        console.error("Failed to fetch exercises list", e);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (!activeExerciseId) return;

    const fetchExercise = async () => {
      try {
        setLoading(true);
        // Get full details for the active exercise
        const data = await getExerciseById(activeExerciseId);
        
        // Calculate progress
        const currentIndex = allExercises.findIndex(ex => ex.id === activeExerciseId);
        const total = allExercises.length || 10; // Default avoiding 0
        const current = currentIndex >= 0 ? currentIndex + 1 : 1;

        setCurrentSession(prev => ({
          ...prev,
          exercise: {
            ...data,
            text: data.target_word || data.title,
            type: data.exercise_type,
            targetPhoneme: data.target_phoneme,
            referenceAudio: data.reference_audio_url,
            visualAid: data.visual_aid_url || "🗣️" 
          },
          progress: {
            current,
            total
          },
          feedback: null
        }));
      } catch (err) {
        console.error(err);
        setError("Failed to load exercise");
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [activeExerciseId, allExercises.length]); // Re-run when ID changes or list loads

  const [sessionStats, setSessionStats] = useState({
    attempts: 0,
    bestScore: 0,
    currentScore: 0
  });

  const [audioState, setAudioState] = useState({
    isRecording: false,
    isPlaying: false,
    isAnalyzing: false,
    volume: 0,
    pitch: 120
  });

  const handleRecordingStart = () => {
    setAudioState(prev => ({
      ...prev,
      isRecording: true,
      volume: 45
    }));

    // Simulate volume changes during recording
    const volumeInterval = setInterval(() => {
      setAudioState(prev => ({
        ...prev,
        volume: Math.min(100, prev.volume + Math.random() * 10),
        pitch: 100 + Math.random() * 100
      }));
    }, 300);

    setTimeout(() => {
      clearInterval(volumeInterval);
    }, 5000);
  };

  const handleRecordingComplete = async (audioBlob) => {
    console.log('Audio recorded:', audioBlob);
    setAudioState(prev => ({
      ...prev,
      isRecording: false,
      isAnalyzing: true,
      volume: 0
    }));
    
    try {
      const result = await analyzeSpeech(audioBlob, activeExerciseId);
      
      const feedbackData = {
         score: result.analysis.pronunciation_score,
         pronunciation: result.analysis.pronunciation_score > 80 ? "Excellent" : "Good",
         mispronouncedPhonemes: result.mispronounced_phonemes || [],
         pitchScore: result.analysis.pitch_analysis.score,
         fluencyScore: result.analysis.fluency_score,
         suggestions: result.suggestions || [],
         comparison: {
           childPitch: result.analysis.pitch_analysis.pitch_contour || [],
           targetPitch: [] 
         }
      };

      setCurrentSession(prev => ({
        ...prev,
        feedback: feedbackData
      }));

      setSessionStats(prev => ({
        attempts: prev.attempts + 1,
        bestScore: Math.max(prev.bestScore, feedbackData.score),
        currentScore: feedbackData.score
      }));
    } catch (err) {
      console.error(err);
      setAudioState(prev => ({ ...prev, isAnalyzing: false })); 
      alert("Analysis failed. Please try again.");
      return; 
    }

    setAudioState(prev => ({
      ...prev,
      isAnalyzing: false
    }));
  };

  const handleNextExercise = () => {
    const currentIndex = allExercises.findIndex(ex => ex.id === activeExerciseId);
    if (currentIndex >= 0 && currentIndex < allExercises.length - 1) {
      const nextExercise = allExercises[currentIndex + 1];
      setActiveExerciseId(nextExercise.id);
      
      // Reset stats for new exercise
      setSessionStats(prev => ({
        ...prev,
        attempts: 0,
        currentScore: 0
      }));
      setAudioState(prev => ({
        ...prev,
        volume: 0,
        pitch: 120,
        isRecording: false,
        isAnalyzing: false,
        isPlaying: false
      }));
    } else {
      // Logic for "Complete" - navigate to library or dashboard
      if (window.confirm("You have completed all exercises in this session! Great job! 🎉\nReturn to Dashboard?")) {
        navigate('/dashboard');
      }
    }
  };


  const handlePlayReference = () => {
    setAudioState(prev => ({ ...prev, isPlaying: true }));
    // Simulate playing reference audio
    setTimeout(() => {
      setAudioState(prev => ({ ...prev, isPlaying: false }));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error || !currentSession.exercise) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-xl max-w-md text-center border border-red-100 dark:border-red-900/30">
          <p className="text-xl font-semibold mb-2 text-red-800 dark:text-red-300">Oops!</p>
          <p>{error || "Could not load exercise"}</p>
          <button 
            onClick={() => navigate('/exercises')}
            className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto py-4 md:py-6 px-4">
        {/* Sleek Progress Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2.5 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all active:scale-95 group"
            >
              <RotateCcw size={20} className="text-gray-500 group-hover:text-blue-500" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-800 dark:text-white leading-none">Daily Practice</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Session Alpha</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-72">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Progress Hub</span>
              <span className="text-xs font-black text-gray-800 dark:text-white">{currentSession.progress.current} / {currentSession.progress.total}</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 shadow-lg relative"
                style={{ width: `${(currentSession.progress.current / currentSession.progress.total) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout - Unified Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Action Zone (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
               {/* Exercise Content */}
               <ExerciseCard 
                 exercise={currentSession.exercise}
                 onPlayReference={handlePlayReference}
                 flat={true}
               />
               
               {/* Integrated Interaction Zone */}
               <div className="p-8 md:p-10 bg-gray-50/50 dark:bg-gray-950/50 border-t border-gray-100 dark:border-gray-800 text-center space-y-8 relative">
                  <div className="space-y-1 relative">
                    <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">Evaluation Zone</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Capturing Hero Voice Clarity</p>
                  </div>

                  <div className="flex flex-col items-center gap-8">
                    {/* Visualizer - Minimal & Integrated */}
                    <div className="w-full max-w-md">
                       <VoiceVisualizer 
                         isRecording={audioState.isRecording}
                         isPlaying={audioState.isPlaying}
                         volume={audioState.volume}
                         pitch={audioState.pitch}
                         type="wave"
                         minimal={true}
                       />
                    </div>

                    <AudioRecorder 
                       onRecordingComplete={handleRecordingComplete}
                       onRecordingStart={handleRecordingStart}
                       onRecordingStop={() => setAudioState(prev => ({ ...prev, isRecording: false }))}
                       exerciseText={currentSession.exercise.text}
                    />
                  </div>

                  {/* Analysis Overlay */}
                  {audioState.isAnalyzing && (
                    <div className="absolute inset-0 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex flex-col items-center justify-center animate-fadeIn">
                       <div className="relative mb-4">
                          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <Sparkles className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={24} />
                       </div>
                       <p className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em] text-xs">AI Neural Analysis...</p>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
            {/* Feedback Hub - Top priority */}
            {currentSession.feedback ? (
              <div className="animate-in zoom-in-95 duration-500 shrink-0">
                <FeedbackPanel 
                  feedback={currentSession.feedback}
                  exercise={currentSession.exercise}
                />
              </div>
            ) : (
              <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 text-center flex flex-col items-center justify-center min-h-[240px]">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <Award className="text-blue-200 dark:text-blue-800" size={32} />
                </div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Awaiting Input</h4>
                <p className="text-[10px] text-gray-400 mt-2 font-medium max-w-[150px]">Complete your first attempt to unlock AI insights!</p>
              </div>
            )}

            {/* Combined Stats & Navigation Card */}
            <div className="flex-1 flex flex-col gap-4">
              {/* Performance Mini-Stats */}
              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="bg-white dark:bg-gray-900 p-5 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center gap-1">
                  <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Top Score</span>
                  <span className="text-2xl font-black text-gray-800 dark:text-white leading-none">{sessionStats.bestScore}%</span>
                </div>
                <div className="bg-white dark:bg-gray-900 p-5 rounded-[1.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center gap-1">
                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Attempts</span>
                  <span className="text-2xl font-black text-gray-800 dark:text-white leading-none">{sessionStats.attempts}</span>
                </div>
              </div>

              {/* Navigation Actions - Premium Dark Theme */}
              <div className="bg-gray-900 dark:bg-black rounded-[2rem] p-6 shadow-2xl space-y-4 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mission Control</h3>
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                </div>
                
                <button 
                   onClick={handleNextExercise}
                   className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black text-xs shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all group"
                >
                   <span className="uppercase tracking-widest">{currentSession.progress.current === currentSession.progress.total ? 'Finish Session' : 'Next Mission'}</span>
                   <SkipForward size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handlePlayReference}
                    disabled={audioState.isPlaying}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black flex flex-col items-center gap-2 transition-all active:scale-95 disabled:opacity-50 text-gray-400 hover:text-white"
                  >
                    <Volume2 size={20} />
                    <span className="text-[8px] uppercase tracking-widest">Audio Re-play</span>
                  </button>
                  <button 
                    onClick={() => handleNextExercise()}
                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black flex flex-col items-center gap-2 transition-all active:scale-95 text-gray-400 hover:text-white"
                  >
                    <SkipForward size={20} />
                    <span className="text-[8px] uppercase tracking-widest">Skip Step</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TherapySession;