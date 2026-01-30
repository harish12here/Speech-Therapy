//src/components/common/Header.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, User, Sun, Moon, SearchIcon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const Header = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="h-16 md:h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-all duration-300">
      <div className="h-full px-4 md:px-8 flex items-center justify-between">
        {/* Left Side: Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition-all duration-300"
              placeholder="Search therapy exercises..."
            />
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 relative group"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Toggle Theme
            </span>
          </button>

          {/* Notifications */}
          <button className="p-2.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300 relative group">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Notifications
            </span>
          </button>

          {/* Divider */}
          <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800 mx-2"></div>

          {/* User Profile */}
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                BK
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">Bala Kumar</p>
              <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">Premium Plan</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header