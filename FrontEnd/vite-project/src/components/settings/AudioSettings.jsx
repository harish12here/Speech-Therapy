// src/components/settings/AudioSettings.jsx
import React, { useState, useEffect } from 'react';
import { Volume2, Mic, Headphones, Waves, Zap, Play, Pause } from 'lucide-react';
import { getCurrentUser, updateUserProfile } from '../../services/api';

const AudioSettings = ({ saveTrigger, onSaveComplete }) => {
  const [loading, setLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(null);
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
        if (user) {
          setSettings(prev => ({
            ...prev,
            soundEnabled: user.sound_enabled ?? true
          }));
        }
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
      localStorage.setItem('audioSettings', JSON.stringify(settings));

      const successEvent = new CustomEvent('showNotification', {
        detail: { 
          message: 'Audio settings updated successfully!', 
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
      { id: 'default', name: 'Default Microphone' },
      { id: 'internal', name: 'Built-in Microphone' },
      { id: 'external', name: 'External USB Mic' }
    ],
    speakers: [
      { id: 'default', name: 'Default Speakers' },
      { id: 'headphones', name: 'Headphones' },
      { id: 'bluetooth', name: 'Bluetooth Speaker' }
    ]
  };

  const handleTestMicrophone = () => {
    setIsTesting('microphone');
    setTimeout(() => {
      setIsTesting(null);
      const event = new CustomEvent('showNotification', {
        detail: { 
          message: 'Microphone test completed!', 
          type: 'success' 
        }
      });
      window.dispatchEvent(event);
    }, 2000);
  };

  const handleTestSpeakers = () => {
    setIsTesting('speakers');
    setTimeout(() => {
      setIsTesting(null);
      const event = new CustomEvent('showNotification', {
        detail: { 
          message: 'Speaker test completed!', 
          type: 'success' 
        }
      });
      window.dispatchEvent(event);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading audio settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      {/* Input Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-900/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
              <Mic size={16} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Microphone Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Input Device
              </label>
              <select
                value={settings.microphone}
                onChange={(e) => setSettings({...settings, microphone: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
              >
                {audioDevices.microphones.map(device => (
                  <option key={device.id} value={device.id}>{device.name}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Input Volume
                </label>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{settings.inputVolume}%</span>
              </div>
              <div className="relative">
                <input
                  type="range" min="0" max="100"
                  value={settings.inputVolume}
                  onChange={(e) => setSettings({...settings, inputVolume: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleTestMicrophone}
              disabled={isTesting === 'microphone'}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                isTesting === 'microphone'
                  ? 'bg-indigo-600 text-white cursor-wait'
                  : 'bg-gradient-to-r from-indigo-50 to-white dark:from-gray-700 dark:to-gray-800 border border-indigo-200 dark:border-indigo-700/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700'
              }`}
            >
              {isTesting === 'microphone' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Mic size={16} />
                  <span>Test Microphone</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Output Settings */}
        <section className="space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/30 dark:to-teal-900/10 text-teal-600 dark:text-teal-400 rounded-lg flex items-center justify-center">
              <Headphones size={16} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Speaker Settings</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Output Device
              </label>
              <select
                value={settings.speakers}
                onChange={(e) => setSettings({...settings, speakers: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
              >
                {audioDevices.speakers.map(device => (
                  <option key={device.id} value={device.id}>{device.name}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Output Volume
                </label>
                <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{settings.outputVolume}%</span>
              </div>
              <div className="relative">
                <input
                  type="range" min="0" max="100"
                  value={settings.outputVolume}
                  onChange={(e) => setSettings({...settings, outputVolume: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleTestSpeakers}
              disabled={isTesting === 'speakers'}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                isTesting === 'speakers'
                  ? 'bg-teal-600 text-white cursor-wait'
                  : 'bg-gradient-to-r from-teal-50 to-white dark:from-gray-700 dark:to-gray-800 border border-teal-200 dark:border-teal-700/30 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-gray-700'
              }`}
            >
              {isTesting === 'speakers' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Volume2 size={16} />
                  <span>Test Speakers</span>
                </>
              )}
            </button>
          </div>
        </section>
      </div>

      {/* Enhancements */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-900/10 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
            <Zap size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audio Enhancements</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'noiseCancellation', label: 'Noise Cancellation', desc: 'Reduce background noise' },
            { id: 'echoCancellation', label: 'Echo Cancellation', desc: 'Remove echo effects' },
            { id: 'autoGain', label: 'Auto Gain Control', desc: 'Automatic volume adjustment' }
          ].map((feature) => (
            <label key={feature.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors group">
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feature.label}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{feature.desc}</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings[feature.id]}
                  onChange={(e) => setSettings({...settings, [feature.id]: e.target.checked})}
                  className="sr-only"
                />
                <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                  settings[feature.id] 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
                    settings[feature.id] ? 'translate-x-4' : ''
                  }`} />
                </div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Quality Settings */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <Waves size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processing Quality</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Sample Rate
            </label>
            <select
              value={settings.sampleRate}
              onChange={(e) => setSettings({...settings, sampleRate: parseInt(e.target.value)})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
            >
              <option value="16000">16 kHz - Recommended</option>
              <option value="44100">44.1 kHz - High Fidelity</option>
              <option value="48000">48 kHz - Professional</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400">Higher sample rate = Better quality</p>
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quality Profile
            </label>
            <select
              value={settings.audioQuality}
              onChange={(e) => setSettings({...settings, audioQuality: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
            >
              <option value="low">Performance Priority</option>
              <option value="medium">Balanced</option>
              <option value="high">Accuracy Priority</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400">Choose based on your device capability</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AudioSettings;