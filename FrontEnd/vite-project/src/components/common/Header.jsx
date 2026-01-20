import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mic, User, Settings, Home, Activity, BookOpen, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Therapy', path: '/therapy', icon: Activity },
    { name: 'Progress', path: '/progress', icon: BookOpen },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Mic className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Speech<span className="text-blue-500">Therapy</span>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-1">
              <button 
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={() => navigate('/settings')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Settings size={20} />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <User size={20} />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header