//src/components/common/Sidebar.jsx
import React, { useState } from 'react';
import { 
  Home, 
  Activity, 
  BarChart3, 
  BookOpen, 
  Settings, 
  User, 
  Award, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Mic,
  Video,
  LayoutDashboard,
  BrainCircuit
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Therapy Session', path: '/therapy', icon: Activity, badge: 'Live' },
    { name: 'Video Analysis', path: '/video-analysis', icon: Video },
    { name: 'Progress', path: '/progress', icon: BarChart3 },
    { name: 'Exercises', path: '/exercises', icon: BookOpen },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-500 ease-in-out z-50 flex-col hidden md:flex ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-3 overflow-hidden">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Mic className="text-white" size={20} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col animate-fadeIn">
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              SpeechTherapy
            </span>
            <span className="text-[10px] uppercase tracking-wider text-blue-500 font-bold">AI Assistant</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`w-full group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative ${
                active 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className={`p-2 rounded-lg transition-all duration-300 ${
                active 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40' 
                  : 'bg-transparent group-hover:bg-white dark:group-hover:bg-gray-800 shadow-none'
              }`}>
                <Icon size={18} />
              </div>
              
              {!isCollapsed && (
                <span className="font-semibold text-sm whitespace-nowrap animate-fadeIn">
                  {item.name}
                </span>
              )}

              {item.badge && !isCollapsed && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}

              {/* Active Indicator */}
              {active && (
                <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
        >
          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </div>
          {!isCollapsed && <span className="text-sm font-semibold">Collapse Sidebar</span>}
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-300"
        >
          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <LogOut size={18} />
          </div>
          {!isCollapsed && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;