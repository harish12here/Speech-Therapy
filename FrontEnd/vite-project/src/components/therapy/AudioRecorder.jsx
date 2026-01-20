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
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' }); // Use webm for browser compatibility
        onRecordingComplete(blob);
        stream.getTracks().forEach(track => track.stop()); // Stop microphone
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
      <div className="text-center">
        <p className="text-gray-600 mb-2 font-medium">Read out loud:</p>
        <p className="text-2xl font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg inline-block">
          {exerciseText}
        </p>
      </div>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-200' 
            : 'bg-blue-500 hover:bg-blue-600 ring-4 ring-blue-200'
        }`}
      >
        {isRecording ? (
          <Square className="text-white" size={32} fill="currentColor" />
        ) : (
          <Mic className="text-white" size={32} />
        )}
      </button>

      <p className={`text-sm font-medium ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>
        {isRecording ? 'Recording... Tap to stop' : 'Tap microphone to start'}
      </p>
    </div>
  );
};

export default AudioRecorder;