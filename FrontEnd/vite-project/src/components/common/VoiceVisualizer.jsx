import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Mic, Waves, Zap } from 'lucide-react';

const VoiceVisualizer = ({ 
  isRecording = false, 
  isPlaying = false,
  audioContext = null,
  analyser = null,
  volume = 0,
  pitch = 0,
  type = 'wave'
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [visualizationData, setVisualizationData] = useState([]);

  // Simulate voice data for demonstration
  useEffect(() => {
    if (!isRecording && !isPlaying) {
      setVisualizationData([]);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (type === 'wave') {
        // Draw waveform
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = isRecording ? '#3B82F6' : '#10B981';
        
        const data = Array.from({ length: 100 }, (_, i) => 
          Math.sin((Date.now() / 200) + (i * 0.2)) * (volume / 100) * 40 + 
          Math.random() * 10 * (volume / 100)
        );

        data.forEach((value, i) => {
          const x = (i / data.length) * width;
          const y = (value + height / 2);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();

        // Draw gradient fill
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, isRecording ? '#60A5FA' : '#34D399');
        gradient.addColorStop(1, isRecording ? '#1D4ED8' : '#059669');
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;

      } else if (type === 'bars') {
        // Draw frequency bars
        const barCount = 50;
        const barWidth = width / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const barHeight = (Math.sin((Date.now() / 100) + (i * 0.3)) + 1) * 
                           (volume / 100) * (height / 2) * 
                           (0.5 + Math.random() * 0.5);
          
          const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
          gradient.addColorStop(0, isRecording ? '#8B5CF6' : '#F59E0B');
          gradient.addColorStop(1, isRecording ? '#4C1D95' : '#B45309');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
        }
      }

      animationRef.current = requestAnimationFrame(drawWaveform);
    };

    drawWaveform();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, isPlaying, volume, type]);

  const getVolumeColor = () => {
    if (volume < 30) return 'text-gray-400';
    if (volume < 60) return 'text-yellow-500';
    if (volume < 80) return 'text-orange-500';
    return 'text-red-500';
  };

  const getPitchLevel = () => {
    if (pitch < 100) return 'Low';
    if (pitch < 200) return 'Medium';
    return 'High';
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-blue-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
            <Waves className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Voice Visualizer</h3>
            <p className="text-sm text-gray-600">
              {isRecording ? 'Recording...' : isPlaying ? 'Playing...' : 'Ready to record'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Volume Indicator */}
          <div className="text-center">
            <div className="flex items-center space-x-2">
              <Volume2 className={`w-4 h-4 ${getVolumeColor()}`} />
              <span className="text-sm font-semibold text-gray-700">{volume}%</span>
            </div>
            <div className="text-xs text-gray-500">Volume</div>
          </div>
          
          {/* Pitch Indicator */}
          <div className="text-center">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold text-gray-700">{getPitchLevel()}</span>
            </div>
            <div className="text-xs text-gray-500">Pitch</div>
          </div>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="relative bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full h-32 rounded-lg"
        />
        
        {/* Center Line */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full border-t border-gray-300 border-dashed"></div>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
            isRecording 
              ? 'bg-red-100 text-red-700' 
              : isPlaying 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              isRecording ? 'bg-red-500' : isPlaying ? 'bg-green-500' : 'bg-blue-500'
            }`}></div>
            <span className="text-sm font-medium">
              {isRecording ? 'REC' : isPlaying ? 'PLAY' : 'IDLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Visualization Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {['wave', 'bars'].map((visType) => (
            <button
              key={visType}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === visType
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {visType === 'wave' ? 'Waveform' : 'Bars'}
            </button>
          ))}
        </div>

        {/* Audio Levels */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-gray-600">Good</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-600">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-gray-600">High</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-700 text-center">
          💡 {isRecording 
            ? 'Speak clearly and maintain consistent volume' 
            : 'Click record to start visualizing your voice'}
        </p>
      </div>
    </div>
  );
};

export default VoiceVisualizer;