//src/components/common/VoiceVisualizer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Mic, Waves, Zap } from 'lucide-react';

const VoiceVisualizer = ({ 
  isRecording = false, 
  isPlaying = false,
  audioContext = null,
  analyser = null,
  volume = 0,
  pitch = 0,
  type = 'wave',
  minimal = false // New minimal mode
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [visualizationData, setVisualizationData] = useState([]);

  // ... (keeping internal logic same)

  if (minimal) {
    return (
      <div className="w-full relative h-16 md:h-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <canvas
          ref={canvasRef}
          width={600}
          height={100}
          className="w-full h-full opacity-80"
        />
        {/* Simple Status Dot */}
        <div className="absolute top-2 right-2">
           <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : isPlaying ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border-2 border-blue-200 dark:border-gray-700 p-6 transition-all duration-500 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-2xl flex items-center justify-center">
            <Waves className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tighter">Voice Coach</h3>
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              {isRecording ? 'Analyzing Voice...' : isPlaying ? 'Feedback Active' : 'Ready for hero'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Volume Indicator */}
          <div className="text-center">
            <div className="flex items-center space-x-2">
              <Volume2 className={`w-4 h-4 ${getVolumeColor()}`} />
              <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">{volume}%</span>
            </div>
          </div>
          
          {/* Pitch Indicator */}
          <div className="text-center">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest">{getPitchLevel()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="relative bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-2 mb-4 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full h-24 rounded-lg"
        />
        
        {/* Center Line */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-full border-t border-gray-400 border-dashed"></div>
        </div>
      </div>

      {/* Audio Levels & Status Badge */}
      <div className="flex items-center justify-between">
         <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            isRecording 
              ? 'bg-red-100 text-red-700 ring-2 ring-red-500/20' 
              : isPlaying 
              ? 'bg-green-100 text-green-700 ring-2 ring-green-500/20' 
              : 'bg-blue-50 text-blue-600 ring-2 ring-blue-500/10'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${
              isRecording ? 'bg-red-500 animate-pulse' : isPlaying ? 'bg-green-500' : 'bg-blue-400'
            }`}></div>
            <span>{isRecording ? 'Recording' : isPlaying ? 'Feedback' : 'System Idle'}</span>
          </div>

        <div className="flex items-center space-x-3 text-[9px] font-black uppercase tracking-widest">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-500">Soft</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-500">Mid</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-gray-500">Max</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceVisualizer;