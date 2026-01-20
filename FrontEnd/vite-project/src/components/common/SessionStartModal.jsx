import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Play, FileVideo, Video, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeSpeech } from '../../services/api';

const SessionStartModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('select'); // select, camera, upload
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  if (!isOpen) return null;

  const handleStartCamera = async () => {
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera/microphone. Please allow permissions.");
      setMode('select');
    }
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
      // Call the actual backend API
      const result = await analyzeSpeech(fileOrBlob);
      console.log("Analysis Result:", result);
      
      // Navigate to progress page
      handleClose();
      navigate('/progress');
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      performAnalysis(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === 'select' && "Start New Session"}
            {mode === 'camera' && "Camera Session"}
            {mode === 'upload' && "Upload Video"}
            {mode === 'analysis' && "AI Analysis"}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          
          {mode === 'select' && (
            <div className="grid grid-cols-1 gap-4">
              <p className="text-gray-600 mb-4 text-center">
                Choose how you'd like to analyze the child's activity.
              </p>
              
              <button 
                onClick={handleStartCamera}
                className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera size={32} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Open Camera</h3>
                <p className="text-sm text-gray-500 mt-1">Real-time activity analysis</p>
              </button>

              <div className="relative">
                <input 
                  type="file" 
                  accept="video/*,audio/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="group flex flex-col items-center justify-center p-8 border-2 border-dashed border-purple-200 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload size={32} className="text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Upload Video/Audio</h3>
                  <p className="text-sm text-gray-500 mt-1">Analyze pre-recorded session</p>
                </div>
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
                  muted // Mute locally to avoid feedback, stream has audio
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
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200 scroll-m-2' 
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
