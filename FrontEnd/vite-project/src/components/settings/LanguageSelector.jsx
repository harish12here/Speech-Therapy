import React, { useState, useEffect } from 'react';
import { Globe, Check, Volume2, Download } from 'lucide-react';
import { getCurrentUser, updateUserProfile } from '../../services/api';

const LanguageSelector = ({ saveTrigger, onSaveComplete }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('ta');
  const [selectedInterfaceLang, setSelectedInterfaceLang] = useState('en');
  const [loading, setLoading] = useState(true);

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
      
      // Show success notification
      const successEvent = new CustomEvent('showNotification', {
        detail: { 
          message: 'Language settings saved successfully! 🌐', 
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
    {
      code: 'ta',
      name: 'Tamil',
      native: 'தமிழ்',
      region: 'Tamil Nadu',
      flag: '🇮🇳',
      voiceAvailable: true,
      downloaded: true
    },
    {
      code: 'hi',
      name: 'Hindi',
      native: 'हिन्दी',
      region: 'North India',
      flag: '🇮🇳',
      voiceAvailable: true,
      downloaded: true
    },
    {
      code: 'te',
      name: 'Telugu',
      native: 'తెలుగు',
      region: 'Andhra Pradesh',
      flag: '🇮🇳',
      voiceAvailable: true,
      downloaded: false
    },
    {
      code: 'kn',
      name: 'Kannada',
      native: 'ಕನ್ನಡ',
      region: 'Karnataka',
      flag: '🇮🇳',
      voiceAvailable: false,
      downloaded: false
    },
    {
      code: 'ml',
      name: 'Malayalam',
      native: 'മലയാളം',
      region: 'Kerala',
      flag: '🇮🇳',
      voiceAvailable: false,
      downloaded: false
    },
    {
      code: 'en',
      name: 'English',
      native: 'English',
      region: 'International',
      flag: '🇺🇸',
      voiceAvailable: true,
      downloaded: true
    }
  ];

  const interfaceLanguages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' }
  ];

  const handleDownloadVoicePack = (langCode) => {
    alert(`Downloading voice pack for ${langCode}...`);
  };

  const handleTestVoice = (langCode) => {
    alert(`Playing test voice for ${langCode}...`);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading language preferences...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="text-purple-600 dark:text-purple-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Language Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Configure speech therapy languages and interface language</p>
      </div>

      {/* Therapy Languages */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
          <Volume2 className="text-purple-500" size={24} />
          <span>Speech Therapy Languages</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languages.map((language) => (
            <div
              key={language.code}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedLanguage === language.code
                  ? 'border-purple-500 bg-white dark:bg-gray-800 shadow-lg transform scale-105'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md'
              }`}
              onClick={() => setSelectedLanguage(language.code)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-white">{language.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{language.native}</div>
                  </div>
                </div>
                {selectedLanguage === language.code && (
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <Check className="text-white" size={14} />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500 dark:text-gray-500">{language.region}</div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    language.voiceAvailable 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {language.voiceAvailable ? 'Voice Available' : 'Voice Coming Soon'}
                  </span>
                  
                  {!language.downloaded && language.voiceAvailable && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadVoicePack(language.code);
                      }}
                      className="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                    >
                      <Download size={14} />
                      <span className="text-xs">Download</span>
                    </button>
                  )}
                </div>

                {language.voiceAvailable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestVoice(language.code);
                    }}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <Volume2 size={14} />
                    <span>Test Voice</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interface Language */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
          <Globe className="text-blue-500" size={24} />
          <span>Interface Language</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {interfaceLanguages.map((language) => (
            <div
              key={language.code}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedInterfaceLang === language.code
                  ? 'border-blue-500 bg-white dark:bg-gray-800 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-500'
              }`}
              onClick={() => setSelectedInterfaceLang(language.code)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {language.code.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-white">{language.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{language.native}</div>
                  </div>
                </div>
                {selectedInterfaceLang === language.code && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="text-white" size={14} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Statistics */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Language Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { language: 'Tamil', progress: 85, exercises: 24 },
            { language: 'Hindi', progress: 72, exercises: 18 },
            { language: 'English', progress: 90, exercises: 30 },
            { language: 'Telugu', progress: 45, exercises: 12 }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-transparent dark:border-gray-700 transition-colors">
              <div className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{stat.language}</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">{stat.progress}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.exercises} exercises</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;