//src/components/common/SessionStartModal.jsx
import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Play, FileVideo, Video, Loader, Activity, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeSpeech, analyzeVideo } from '../../services/api';
import VoiceVisualizer from './VoiceVisualizer';

const SessionStartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('select'); // select, camera, audio, upload, analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [analysisType, setAnalysisType] = useState('speech'); // speech, activity
  const [volume, setVolume] = useState(0);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  if (!isOpen) return null;

  const handleStartCamera = async () => {
    setMode('camera');
    setAnalysisType('speech');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setupVisualizer(stream);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera/microphone. Please allow permissions.");
      setMode('select');
    }
  };

  const handleStartAudio = async () => {
    setMode('audio');
    setAnalysisType('speech');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setupVisualizer(stream);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please allow permissions.");
      setMode('select');
    }
  };

  const setupVisualizer = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateVolume = () => {
      if (!streamRef.current) return;
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setVolume(Math.round(average));
      requestAnimationFrame(updateVolume);
    };
    updateVolume();
  };

  const handleStopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleClose = () => {
    handleStopCamera();
    setMode('select');
    setIsAnalyzing(false);
    setIsRecording(false);
    onClose();
  };

  const performAnalysis = async (fileOrBlob) => {
    setIsAnalyzing(true);
    setMode('analysis');
    
    try {
      // Call the appropriate API based on analysisType
      let result;
      if (analysisType === 'activity') {
        result = await analyzeVideo(fileOrBlob);
        console.log("Video Analysis Result:", result);
        // After video analysis, we might want to go to a special results page or progress
        handleClose();
        navigate('/video-analysis', { state: { analysisResult: result } });
      } else {
        result = await analyzeSpeech(fileOrBlob);
        console.log("Speech Analysis Result:", result);
        handleClose();
        navigate('/progress');
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      alert(`Analysis failed: ${error.detail || "Server error"}`);
      setMode('select');
      setIsAnalyzing(false);
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    // Use proper mime type for video if possible, else default
    const options = MediaRecorder.isTypeSupported('video/webm') 
      ? { mimeType: 'video/webm' } 
      : undefined;
      
    const recorder = new MediaRecorder(streamRef.current, options);
    
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const file = new File([blob], "recording.webm", { type: "video/webm" });
      performAnalysis(file);
    };
    
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      handleStopCamera(); 
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setAnalysisType(type || 'speech');
      performAnalysis(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom md:zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
            {mode === 'select' && "Start New Session"}
            {mode === 'camera' && "Camera Session"}
            {mode === 'audio' && "Live Audio Recording"}
            {mode === 'upload' && "Upload Video"}
            {mode === 'analysis' && "AI Analysis"}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors active:scale-90"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 md:p-8 overflow-y-auto scrollbar-hide">
          
          {mode === 'select' && (
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mb-2 md:mb-4 text-center">
                Select your preferred method to begin.
              </p>
              
              <button 
                onClick={handleStartCamera}
                className="group relative flex items-center p-4 md:p-5 border-2 border-blue-50 dark:border-blue-900 shadow-sm bg-white dark:bg-gray-800 rounded-2xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 active:scale-[0.98]"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                  <Camera size={20} className="text-blue-600 dark:text-blue-400 md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-800 dark:text-white text-sm md:text-base">Open Camera</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Analyze real-time activity and speech</p>
                </div>
              </button>

              <button 
                onClick={handleStartAudio}
                className="group relative flex items-center p-4 md:p-5 border-2 border-green-50 dark:border-green-900 shadow-sm bg-white dark:bg-gray-800 rounded-2xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-300 active:scale-[0.98]"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                  <Mic size={20} className="text-green-600 dark:text-green-400 md:w-6 md:h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-800 dark:text-white text-sm md:text-base">Mic Recording</h3>
                  <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Live audio for activity analysis</p>
                </div>
              </button>

              <div className="relative">
                <input 
                  type="file" 
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, 'activity')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <button className="w-full group relative flex items-center p-4 md:p-5 border-2 border-purple-50 dark:border-purple-900 shadow-sm bg-white dark:bg-gray-800 rounded-2xl hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                    <Activity size={20} className="text-purple-600 dark:text-purple-400 md:w-6 md:h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm md:text-base">Recording Analysis</h3>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Analyze patterns & engagement</p>
                  </div>
                </button>
              </div>

              <div className="relative">
                <input 
                  type="file" 
                  accept="video/*,audio/*"
                  onChange={(e) => handleFileUpload(e, 'speech')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <button className="w-full group relative flex items-center p-4 md:p-5 border-2 border-indigo-50 dark:border-indigo-900 shadow-sm bg-white dark:bg-gray-800 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform shrink-0">
                    <Upload size={20} className="text-indigo-600 dark:text-indigo-400 md:w-6 md:h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm md:text-base">Upload Video</h3>
                    <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Detailed articulation analysis</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {mode === 'camera' && (
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-6 shadow-lg">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  onLoadedMetadata={(e) => e.target.play()}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                   <div className={`flex items-center px-2 py-1 rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800/80 text-white'}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${isRecording ? 'bg-white' : 'bg-red-500'}`}></div>
                      {isRecording ? 'RECORDING' : 'LIVE'}
                   </div>
                </div>
              </div>
              
              <button 
                onClick={handleToggleRecording}
                className={`w-full font-semibold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${
                    isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                }`}
              >
                {isRecording ? (
                    <>
                        <div className="w-4 h-4 bg-white rounded-sm mr-2"></div>
                        <span>Stop & Analyze</span>
                    </>
                ) : (
                    <>
                        <div className="w-4 h-4 rounded-full border-2 border-white mr-2"></div>
                        <span>Start Recording</span>
                    </>
                )}
              </button>
            </div>
          )}

          {mode === 'audio' && (
            <div className="flex flex-col items-center">
              <div className="w-full mb-6">
                 <VoiceVisualizer 
                    isRecording={isRecording} 
                    volume={volume} 
                    type="wave"
                 />
              </div>
              
              <button 
                onClick={handleToggleRecording}
                className={`w-full font-semibold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 ${
                    isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' 
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-green-200'
                }`}
              >
                {isRecording ? (
                    <>
                        <div className="w-4 h-4 bg-white rounded-sm mr-2"></div>
                        <span>Stop & Analyze</span>
                    </>
                ) : (
                    <>
                        <div className="w-4 h-4 rounded-full border-2 border-white mr-2"></div>
                        <span>Start Recording</span>
                    </>
                )}
              </button>
            </div>
          )}

          {mode === 'analysis' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-24 h-24 relative mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader size={32} className="text-blue-500 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing Session...</h3>
              <p className="text-gray-500 text-center max-w-xs">
                Our AI is processing your session data. This may take a moment.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SessionStartModal;
