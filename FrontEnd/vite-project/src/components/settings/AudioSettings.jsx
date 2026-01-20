import React, { useState, useEffect } from 'react';
import { Volume2, Mic, Headphones, Waves, Zap, CheckCircle } from 'lucide-react';
import { getCurrentUser, updateUserProfile } from '../../services/api';

const AudioSettings = ({ saveTrigger, onSaveComplete }) => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    microphone: 'default',
    speakers: 'default',
    inputVolume: 75,
    outputVolume: 80,
    noiseCancellation: true,
    echoCancellation: true,
    autoGain: true,
    sampleRate: 16000,
    audioQuality: 'high',
    soundEnabled: true
  });

  useEffect(() => {
    const fetchAudioSettings = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        setSettings(prev => ({
          ...prev,
          soundEnabled: user.sound_enabled ?? true
        }));
      } catch (err) {
        console.error("Failed to fetch audio settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAudioSettings();
  }, []);

  useEffect(() => {
    if (saveTrigger > 0) {
      handleSave();
    }
  }, [saveTrigger]);

  const handleSave = async () => {
    try {
      await updateUserProfile({
        sound_enabled: settings.soundEnabled
      });
      
      // Save other settings to localStorage for persistence since backend doesn't have fields for them yet
      localStorage.setItem('audioSettings', JSON.stringify(settings));

      // Show success notification
      const successEvent = new CustomEvent('showNotification', {
        detail: { 
          message: 'Audio settings updated! 🔊', 
          type: 'success' 
        }
      });
      window.dispatchEvent(successEvent);
      
      if (onSaveComplete) onSaveComplete();
    } catch (err) {
      console.error("Failed to save audio settings", err);
    }
  };

  const audioDevices = {
    microphones: [
      { id: 'default', name: 'Default Microphone', quality: 'Good' },
      { id: 'internal', name: 'Built-in Microphone', quality: 'Average' },
      { id: 'external', name: 'External USB Mic', quality: 'Excellent' }
    ],
    speakers: [
      { id: 'default', name: 'Default Speakers', quality: 'Good' },
      { id: 'headphones', name: 'Headphones', quality: 'Excellent' },
      { id: 'bluetooth', name: 'Bluetooth Speaker', quality: 'Good' }
    ]
  };

  const handleTestMicrophone = async () => {
    // Simulate microphone test
    alert('🎤 Testing microphone... Speak now!');
  };

  const handleTestSpeakers = () => {
    // Simulate speaker test
    alert('🔊 Testing speakers... Check if you hear sound!');
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading audio settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Volume2 className="text-blue-600 dark:text-blue-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Audio Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Configure your microphone and speakers for optimal speech practice</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Microphone Settings */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Mic className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Microphone</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Settings for speech input</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Microphone
              </label>
              <select
                value={settings.microphone}
                onChange={(e) => setSettings({...settings, microphone: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {audioDevices.microphones.map(device => (
                  <option key={device.id} value={device.id}>
                    {device.name} ({device.quality})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Input Volume: <span className="text-blue-600 dark:text-blue-400 font-semibold">{settings.inputVolume}%</span>
              </label>
              <div className="flex items-center space-x-3">
                <Mic className="text-gray-500 dark:text-gray-400" size={20} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.inputVolume}
                  onChange={(e) => setSettings({...settings, inputVolume: e.target.value})}
                  className="w-full h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500"
                />
                <div className="w-6 text-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {settings.inputVolume}
                </div>
              </div>
            </div>

            <button
              onClick={handleTestMicrophone}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Waves size={18} />
              <span>Test Microphone</span>
            </button>
          </div>
        </div>

        {/* Speaker Settings */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
              <Headphones className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Speakers</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Settings for audio output</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Output Device
              </label>
              <select
                value={settings.speakers}
                onChange={(e) => setSettings({...settings, speakers: e.target.value})}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                {audioDevices.speakers.map(device => (
                  <option key={device.id} value={device.id}>
                    {device.name} ({device.quality})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Output Volume: <span className="text-green-600 dark:text-green-400 font-semibold">{settings.outputVolume}%</span>
              </label>
              <div className="flex items-center space-x-3">
                <Volume2 className="text-gray-500 dark:text-gray-400" size={20} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.outputVolume}
                  onChange={(e) => setSettings({...settings, outputVolume: e.target.value})}
                  className="w-full h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-green-500"
                />
                <div className="w-6 text-center text-sm font-semibold text-green-600 dark:text-green-400">
                  {settings.outputVolume}
                </div>
              </div>
            </div>

            <button
              onClick={handleTestSpeakers}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Zap size={18} />
              <span>Test Speakers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audio Enhancements */}
      <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center space-x-2">
          <Zap className="text-purple-500" size={24} />
          <span>Audio Enhancements</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'noiseCancellation', label: 'Noise Cancellation', description: 'Reduce background noise' },
            { id: 'echoCancellation', label: 'Echo Cancellation', description: 'Remove echo effects' },
            { id: 'autoGain', label: 'Auto Gain Control', description: 'Automatic volume adjustment' }
          ].map((feature) => (
            <label key={feature.id} className="flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer transition-all group">
              <div className="flex items-center h-5 mt-1">
                <input
                  type="checkbox"
                  checked={settings[feature.id]}
                  onChange={(e) => setSettings({...settings, [feature.id]: e.target.checked})}
                  className="w-4 h-4 text-purple-500 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-900 transition-colors"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800 dark:text-white group-hover:text-purple-500 transition-colors">{feature.label}</span>
                  {settings[feature.id] && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Audio Quality */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Audio Quality</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sample Rate
            </label>
            <select
              value={settings.sampleRate}
              onChange={(e) => setSettings({...settings, sampleRate: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="8000">8 kHz - Telephone Quality</option>
              <option value="16000">16 kHz - Good Quality</option>
              <option value="44100">44.1 kHz - CD Quality</option>
              <option value="48000">48 kHz - Studio Quality</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Audio Quality Preset
            </label>
            <select
              value={settings.audioQuality}
              onChange={(e) => setSettings({...settings, audioQuality: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="low">Low - Faster Processing</option>
              <option value="medium">Medium - Balanced</option>
              <option value="high">High - Best Quality</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioSettings;