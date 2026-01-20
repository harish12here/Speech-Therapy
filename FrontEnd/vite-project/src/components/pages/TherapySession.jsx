// import React, { useState } from "react";
// import { Play, SkipForward, Award, Volume2, RotateCcw } from "lucide-react";
// import Header from "../common/Header";
// import AudioRecorder from "../therapy/AudioRecorder";
// import FeedbackPanel from "../therapy/FeedbackPanel";
// import ExerciseCard from "../therapy/ExerciseCard";
// import VoiceVisualizer from "../common/VoiceVisualizer";
// import LoadingSpinner, { AnalysisLoader } from '../common/LoadingSpinner';


// const TherapySession = () => {
//   const [currentSession, setCurrentSession] = useState({
//     exercise: {
//       id: 1,
//       text: "Hello",
//       type: "word",
//       difficulty: "easy",
//       targetPhoneme: "h",
//       referenceAudio: "/audio/hello.wav",
//       visualAid: "👋",
//     },
//     progress: {
//       current: 1,
//       total: 10,
//     },
//     feedback: null,
//   });

//   const [sessionStats, setSessionStats] = useState({
//     attempts: 0,
//     bestScore: 0,
//     currentScore: 0,
//   });

//   const handleRecordingComplete = (audioBlob) => {
//     console.log("Audio recorded:", audioBlob);

//     // Simulate AI analysis response
//     const mockFeedback = {
//       score: 85,
//       pronunciation: "Good",
//       mispronouncedPhonemes: ["e"],
//       pitchScore: 78,
//       fluencyScore: 82,
//       suggestions: [
//         "Try opening your mouth wider for the 'e' sound",
//         "Speak a bit louder and clearer",
//       ],
//       comparison: {
//         childPitch: [120, 125, 118, 122],
//         targetPitch: [115, 120, 115, 120],
//       },
//     };

//     setCurrentSession((prev) => ({
//       ...prev,
//       feedback: mockFeedback,
//     }));

//     setSessionStats((prev) => ({
//       attempts: prev.attempts + 1,
//       bestScore: Math.max(prev.bestScore, mockFeedback.score),
//       currentScore: mockFeedback.score,
//     }));
//   };

//   const handleNextExercise = () => {
//     // Mock next exercise
//     const nextExercise = {
//       id: 2,
//       text: "Water",
//       type: "word",
//       difficulty: "easy",
//       targetPhoneme: "w",
//       referenceAudio: "/audio/water.wav",
//       visualAid: "💧",
//     };

//     setCurrentSession((prev) => ({
//       ...prev,
//       exercise: nextExercise,
//       progress: {
//         current: prev.progress.current + 1,
//         total: prev.progress.total,
//       },
//       feedback: null,
//     }));

//     setSessionStats((prev) => ({
//       ...prev,
//       attempts: 0,
//       currentScore: 0,
//     }));
//   };

//   const handlePlayReference = () => {
//     // Play reference audio
//     console.log(
//       "Playing reference audio:",
//       currentSession.exercise.referenceAudio
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//       <Header />

//       <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Session Header */}
//         <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">
//                 Speech Therapy Session
//               </h1>
//               <p className="text-gray-600 mt-1">Practice makes perfect! 🎯</p>
//             </div>

//             {/* Progress */}
//             <div className="flex items-center space-x-4">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {currentSession.progress.current}/
//                   {currentSession.progress.total}
//                 </div>
//                 <div className="text-sm text-gray-500">Exercises</div>
//               </div>

//               <div className="w-32 bg-gray-200 rounded-full h-3">
//                 <div
//                   className="bg-green-500 h-3 rounded-full transition-all duration-500"
//                   style={{
//                     width: `${
//                       (currentSession.progress.current /
//                         currentSession.progress.total) *
//                       100
//                     }%`,
//                   }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Exercise & Recorder */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Exercise Card */}
//             <ExerciseCard
//               exercise={currentSession.exercise}
//               onPlayReference={handlePlayReference}
//             />

//             <VoiceVisualizer
//               isRecording={isRecording}
//               isPlaying={false}
//               volume={75}
//               pitch={150}
//             />

//             {isAnalyzing && <AnalysisLoader />}

//             {/* Audio Recorder */}
//             <div className="bg-white rounded-2xl shadow-sm p-6">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">
//                 Record Your Voice 🎤
//               </h3>
//               <AudioRecorder
//                 onRecordingComplete={handleRecordingComplete}
//                 exerciseText={currentSession.exercise.text}
//               />
//             </div>

//             {/* Session Stats */}
//             <div className="bg-white rounded-2xl shadow-sm p-6">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">
//                 Session Statistics
//               </h3>
//               <div className="grid grid-cols-3 gap-4">
//                 <div className="text-center p-4 bg-blue-50 rounded-lg">
//                   <div className="text-2xl font-bold text-blue-600">
//                     {sessionStats.attempts}
//                   </div>
//                   <div className="text-sm text-blue-800">Attempts</div>
//                 </div>
//                 <div className="text-center p-4 bg-green-50 rounded-lg">
//                   <div className="text-2xl font-bold text-green-600">
//                     {sessionStats.currentScore}%
//                   </div>
//                   <div className="text-sm text-green-800">Current Score</div>
//                 </div>
//                 <div className="text-center p-4 bg-purple-50 rounded-lg">
//                   <div className="text-2xl font-bold text-purple-600">
//                     {sessionStats.bestScore}%
//                   </div>
//                   <div className="text-sm text-purple-800">Best Score</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Feedback */}
//           <div className="space-y-6">
//             {/* Feedback Panel */}
//             <FeedbackPanel
//               feedback={currentSession.feedback}
//               exercise={currentSession.exercise}
//             />

//             {/* Action Buttons */}
//             <div className="bg-white rounded-2xl shadow-sm p-6">
//               <h3 className="text-xl font-semibold text-gray-800 mb-4">
//                 Actions
//               </h3>
//               <div className="space-y-3">
//                 <button
//                   onClick={handlePlayReference}
//                   className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
//                 >
//                   <Volume2 size={20} />
//                   <span>Play Reference</span>
//                 </button>

//                 <button
//                   onClick={handleNextExercise}
//                   className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
//                 >
//                   <SkipForward size={20} />
//                   <span>Next Exercise</span>
//                 </button>

//                 <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
//                   <RotateCcw size={20} />
//                   <span>Practice Again</span>
//                 </button>
//               </div>
//             </div>

//             {/* Tips */}
//             <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
//               <h3 className="text-lg font-semibold text-yellow-800 mb-3">
//                 💡 Pro Tips
//               </h3>
//               <ul className="text-yellow-700 space-y-2 text-sm">
//                 <li>• Speak clearly and at a comfortable pace</li>
//                 <li>• Listen to the reference audio first</li>
//                 <li>• Practice the mouth position shown</li>
//                 <li>• Don't rush - accuracy is more important than speed</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TherapySession;

//frontend/vite-project/src/components/common/LoadingSpinner.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Play, SkipForward, Award, Volume2, RotateCcw, Sparkles, Loader } from 'lucide-react';
import Header from '../common/Header';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-colors duration-300">
      <Header />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Session Header */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-8 border border-white/20 dark:border-gray-800 transition-colors">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Speech Therapy Session</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">Practice makes perfect! 🎯</p>
                </div>
              </div>
            </div>
            
            {/* Progress with Animation */}
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  {currentSession.progress.current}/{currentSession.progress.total}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Exercises</div>
              </div>
              
              <div className="w-48 bg-gray-200 dark:bg-gray-800 rounded-full h-3 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000 shadow-lg shadow-green-500/20"
                  style={{ 
                    width: `${(currentSession.progress.current / currentSession.progress.total) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Exercise & Visualizer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exercise Card */}
            <ExerciseCard 
              exercise={currentSession.exercise}
              onPlayReference={handlePlayReference}
            />

            {/* Voice Visualizer */}
            <VoiceVisualizer 
              isRecording={audioState.isRecording}
              isPlaying={audioState.isPlaying}
              volume={audioState.volume}
              pitch={audioState.pitch}
              type="wave"
            />

            {/* Audio Recorder */}
            <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-800 transition-colors">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2 transition-colors">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Volume2 className="text-red-500 dark:text-red-400" size={18} />
                </div>
                <span>Record Your Voice 🎤</span>
              </h3>
              <AudioRecorder 
                onRecordingComplete={handleRecordingComplete}
                onRecordingStart={handleRecordingStart}
                onRecordingStop={() => setAudioState(prev => ({ ...prev, isRecording: false }))}
                exerciseText={currentSession.exercise.text}
              />
            </div>

            {/* Analysis Loader */}
            {audioState.isAnalyzing && (
              <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-800 transition-colors">
                <AnalysisLoader />
              </div>
            )}

            {/* Session Stats */}
            <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-800 transition-colors">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors">Session Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200 dark:border-blue-800 transition-colors">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sessionStats.attempts}</div>
                  <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">Attempts</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 dark:border-green-800 transition-colors">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{sessionStats.currentScore}%</div>
                  <div className="text-sm text-green-800 dark:text-green-300 font-medium">Current Score</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-200 dark:border-purple-800 transition-colors">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{sessionStats.bestScore}%</div>
                  <div className="text-sm text-purple-800 dark:text-purple-300 font-medium">Best Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Feedback & Actions */}
          <div className="space-y-6">
            {/* Feedback Panel */}
            <FeedbackPanel 
              feedback={currentSession.feedback}
              exercise={currentSession.exercise}
            />

            {/* Action Buttons */}
            <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-800 transition-colors">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handlePlayReference}
                  disabled={audioState.isPlaying}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg flex items-center justify-center space-x-2"
                >
                  <Volume2 size={20} />
                  <span>Play Reference</span>
                </button>

                <button
                  onClick={handleNextExercise}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <SkipForward size={20} />
                  <span>Next Exercise</span>
                </button>

                <button className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2">
                  <RotateCcw size={20} />
                  <span>Practice Again</span>
                </button>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl shadow-xl p-6 border border-yellow-200 dark:border-yellow-800/50 transition-colors">
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-400 mb-3 flex items-center space-x-2 transition-colors">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg">💡</span>
                </div>
                <span>Pro Tips</span>
              </h3>
              <ul className="text-yellow-700 dark:text-yellow-400/80 space-y-2 text-sm transition-colors">
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Speak clearly and at a comfortable pace</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Listen to the reference audio first</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Practice the mouth position shown</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>Don't rush - accuracy is more important than speed</span>
                </li>
              </ul>
            </div>

            {/* Achievement Progress */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl shadow-xl p-6 border border-purple-200 dark:border-purple-800/50 transition-colors">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400 mb-3 flex items-center space-x-2 transition-colors">
                <Award className="text-purple-500 dark:text-purple-400" size={20} />
                <span>Today's Progress</span>
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-purple-700 dark:text-purple-300 mb-1 transition-colors">
                    <span>Session Completion</span>
                    <span>{Math.round((currentSession.progress.current / currentSession.progress.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-purple-200 dark:bg-purple-900/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 shadow-lg shadow-purple-500/20"
                      style={{ width: `${(currentSession.progress.current / currentSession.progress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center pt-2">
                  <span className="text-xs text-purple-600 dark:text-purple-400 transition-colors">
                    Complete {currentSession.progress.total - currentSession.progress.current} more exercises today!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapySession;