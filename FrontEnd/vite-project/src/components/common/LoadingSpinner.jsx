//src/components/common/LoadingSpinner.jsx
import React from 'react';
import { Mic, Activity, Zap } from 'lucide-react';

const LoadingSpinner = ({ 
  type = 'default', 
  size = 'medium', 
  message = '', 
  color = 'blue' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    red: 'text-red-500',
    yellow: 'text-yellow-500'
  };

  const renderSpinner = () => {
    switch (type) {
      case 'audio':
        return (
          <div className="flex items-center justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-2 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full animate-bounce`}
                style={{
                  height: `${Math.random() * 24 + 8}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-pulse`}>
            <Zap className="w-full h-full" />
          </div>
        );
      
      case 'voice':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
              <Mic className="w-full h-full" />
            </div>
            <div className="absolute inset-0 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
          </div>
        );
      
      case 'analysis':
        return (
          <div className="flex items-center space-x-1">
            <Activity className={`${colorClasses[color]} animate-pulse`} size={24} />
            <div className="flex space-x-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1 h-4 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className={`${sizeClasses[size]} border-4 border-t-transparent border-current rounded-full animate-spin`}></div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {renderSpinner()}
      {message && (
        <p className={`text-sm font-medium text-center ${colorClasses[color]}`}>
          {message}
        </p>
      )}
    </div>
  );
};

// Pre-built loading components for common use cases
export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="text-center">
      <LoadingSpinner type="voice" size="xlarge" color="purple" />
      <p className="mt-4 text-lg font-semibold text-gray-700">Loading Speech Therapy...</p>
    </div>
  </div>
);

export const ButtonLoader = ({ text = 'Loading...' }) => (
  <div className="flex items-center space-x-2">
    <LoadingSpinner type="default" size="small" color="blue" />
    <span>{text}</span>
  </div>
);

export const AudioLoader = () => (
  <div className="flex flex-col items-center space-y-3 p-4">
    <LoadingSpinner type="audio" size="medium" color="blue" />
    <p className="text-sm text-blue-600 font-medium">Processing Audio...</p>
  </div>
);

export const AnalysisLoader = () => (
  <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
    <LoadingSpinner type="analysis" size="medium" color="purple" />
    <div>
      <p className="text-sm font-semibold text-purple-700">AI Analysis</p>
      <p className="text-xs text-purple-600">Checking pronunciation...</p>
    </div>
  </div>
);

export default LoadingSpinner;