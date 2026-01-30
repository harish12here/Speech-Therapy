//src/components/therapy/AudioRecorder.jsx
import React, { useState, useRef } from 'react';
import { Mic, Square, Loader } from 'lucide-react';

const AudioRecorder = ({ onRecordingComplete, onRecordingStart, onRecordingStop, exerciseText }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      if (onRecordingStart) onRecordingStart();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please allow permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (onRecordingStop) onRecordingStop();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative group">
        {/* Pulsating Ring behind button */}
        {isRecording && (
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25 scale-125" />
        )}
        
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-110 active:scale-90 shadow-lg ${
            isRecording 
              ? 'bg-gradient-to-tr from-red-500 to-rose-600 shadow-red-500/40 ring-4 ring-red-100 dark:ring-red-900/30' 
              : 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/40 ring-4 ring-blue-100 dark:ring-blue-900/30 hover:shadow-blue-500/60'
          }`}
        >
          {isRecording ? (
            <div className="flex flex-col items-center gap-1">
               <Square className="text-white fill-white" size={24} />
               <span className="text-[8px] font-black text-white uppercase tracking-widest">Stop</span>
            </div>
          ) : (
             <div className="flex flex-col items-center gap-1">
               <Mic className="text-white" size={28} />
               <span className="text-[8px] font-black text-white uppercase tracking-widest">Speak</span>
            </div>
          )}
        </button>
      </div>

      <div className="text-center space-y-1">
        <p className={`text-sm font-black uppercase tracking-[0.2em] transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
          {isRecording ? 'Listening...' : 'Ready?'}
        </p>
        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 max-w-[150px] mx-auto leading-tight">
          {isRecording ? 'Say the word clearly!' : 'Tap the button to start'}
        </p>
      </div>
    </div>
  );
};

export default AudioRecorder;