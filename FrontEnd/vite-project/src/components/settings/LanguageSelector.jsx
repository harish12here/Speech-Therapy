// src/components/settings/LanguageSelector.jsx
import React, { useState, useEffect } from 'react';
import { Globe, Check, Volume2, Download, Play, Pause } from 'lucide-react';
import { getCurrentUser, updateUserProfile } from '../../services/api';

const LanguageSelector = ({ saveTrigger, onSaveComplete }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('ta');
  const [selectedInterfaceLang, setSelectedInterfaceLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [playingVoice, setPlayingVoice] = useState(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        if (user.language_preference) setSelectedInterfaceLang(user.language_preference);
        if (user.regional_language) setSelectedLanguage(user.regional_language);
      } catch (err) {
        console.error("Failed to fetch language settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (saveTrigger > 0) {
      handleSave();
    }
  }, [saveTrigger]);

  const handleSave = async () => {
    try {
      await updateUserProfile({
        language_preference: selectedInterfaceLang,
        regional_language: selectedLanguage
      });
      
      const successEvent = new CustomEvent('showNotification', {
        detail: { 
          message: 'Language settings saved successfully!', 
          type: 'success' 
        }
      });
      window.dispatchEvent(successEvent);
      
      if (onSaveComplete) onSaveComplete();
    } catch (err) {
      console.error("Failed to save language settings", err);
    }
  };

  const languages = [
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'Tamil Nadu', flag: '🇮🇳', voiceAvailable: true, downloaded: true },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'North India', flag: '🇮🇳', voiceAvailable: true, downloaded: true },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', region: 'Andhra Pradesh', flag: '🇮🇳', voiceAvailable: true, downloaded: false },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', region: 'Karnataka', flag: '🇮🇳', voiceAvailable: false, downloaded: false },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', region: 'Kerala', flag: '🇮🇳', voiceAvailable: false, downloaded: false },
    { code: 'en', name: 'English', native: 'English', region: 'International', flag: '🇺🇸', voiceAvailable: true, downloaded: true }
  ];

  const interfaceLanguages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' }
  ];

  const handleDownloadVoicePack = (langCode) => {
    const event = new CustomEvent('showNotification', {
      detail: { 
        message: `Downloading voice pack for ${languages.find(l => l.code === langCode)?.name}...`, 
        type: 'success' 
      }
    });
    window.dispatchEvent(event);
  };

  const handleTestVoice = (langCode) => {
    setPlayingVoice(langCode);
    setTimeout(() => {
      setPlayingVoice(null);
      const event = new CustomEvent('showNotification', {
        detail: { 
          message: `Voice test completed for ${languages.find(l => l.code === langCode)?.name}`, 
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
        <p className="text-gray-600 dark:text-gray-300 font-medium">Loading language preferences...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      {/* Interface Language */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-900/10 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center">
            <Globe size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interface Language</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {interfaceLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => setSelectedInterfaceLang(language.code)}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 border-2 ${
                selectedInterfaceLang === language.code
                  ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/10 dark:to-gray-800/30 shadow-sm'
                  : 'border-transparent bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 hover:border-indigo-200 dark:hover:border-indigo-500/30'
              }`}
            >
              <div className="text-left">
                <div className={`font-semibold text-sm ${
                  selectedInterfaceLang === language.code 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {language.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{language.native}</div>
              </div>
              {selectedInterfaceLang === language.code && (
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Therapy Languages */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/30 dark:to-teal-900/10 text-teal-600 dark:text-teal-400 rounded-lg flex items-center justify-center">
            <Volume2 size={16} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Therapy Languages</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languages.map((language) => (
            <div
              key={language.code}
              onClick={() => setSelectedLanguage(language.code)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedLanguage === language.code
                  ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/10 dark:to-gray-800/30 shadow-sm'
                  : 'border-gray-200 dark:border-gray-600 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 hover:border-indigo-300 dark:hover:border-indigo-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl bg-white dark:bg-gray-700 w-10 h-10 flex items-center justify-center rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                    {language.flag}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{language.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{language.region}</div>
                  </div>
                </div>
                {selectedLanguage === language.code && (
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                    language.voiceAvailable 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {language.voiceAvailable ? 'Voice Available' : 'Coming Soon'}
                  </span>
                  
                  {!language.downloaded && language.voiceAvailable && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDownloadVoicePack(language.code); }}
                      className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center space-x-1"
                    >
                      <Download size={12} />
                      <span>Download</span>
                    </button>
                  )}
                </div>

                {language.voiceAvailable && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleTestVoice(language.code); }}
                    disabled={playingVoice === language.code}
                    className={`w-full flex items-center justify-center space-x-2 py-2 rounded-lg font-medium text-xs transition-all duration-200 ${
                      playingVoice === language.code
                        ? 'bg-indigo-600 text-white cursor-wait'
                        : selectedLanguage === language.code
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                          : 'bg-gradient-to-r from-gray-100 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-500/30'
                    }`}
                  >
                    {playingVoice === language.code ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Playing...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 size={12} />
                        <span>Test Voice</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Language Fluency Progress */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Language Fluency Progress</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">Updated daily</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { lang: 'Tamil', val: 85, color: 'indigo' },
            { lang: 'Hindi', val: 72, color: 'teal' },
            { lang: 'English', val: 90, color: 'orange' },
            { lang: 'Telugu', val: 45, color: 'rose' }
          ].map((stat) => (
            <div key={stat.lang} className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/30 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{stat.lang}</div>
              <div className="flex items-end space-x-2 mb-2">
                <span className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.val}%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">fluent</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600`} 
                  style={{ width: `${stat.val}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LanguageSelector;