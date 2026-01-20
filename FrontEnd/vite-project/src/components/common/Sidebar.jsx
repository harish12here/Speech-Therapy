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
  Mic
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen = true, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = {
    name: 'Rohan Kumar',
    avatar: null,
    level: 'Beginner',
    progress: 65
  };

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, badge: null },
    { name: 'Therapy', path: '/therapy', icon: Activity, badge: 'New' },
    { name: 'Progress', path: '/progress', icon: BarChart3, badge: null },
    { name: 'Exercises', path: '/exercises', icon: BookOpen, badge: '12' },
    { name: 'Settings', path: '/settings', icon: Settings, badge: null },
  ];

  const quickStats = [
    { label: 'Today', value: '15 min', icon: Calendar },
    { label: 'Streak', value: '7 days', icon: Award },
    { label: 'Accuracy', value: '85%', icon: BarChart3 },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Mic className="text-white" size={24} />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">
                Speech<span className="text-blue-500">Therapy</span>
              </h1>
              <p className="text-xs text-gray-500">AI Assistant</p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-gray-200">
        <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.level}</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${user.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-2">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                  <Icon className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                  <div className="text-xs font-semibold text-gray-800">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <div className="relative">
                <Icon size={20} />
                {item.badge && (
                  <span className={`absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full ${
                    active 
                      ? 'bg-white text-purple-600' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
              
              {!isCollapsed && (
                <>
                  <span className="font-medium flex-1 text-left">{item.name}</span>
                  {active && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="w-full flex items-center space-x-3 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <>
              <ChevronLeft size={20} />
              <span className="font-medium">Collapse</span>
            </>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={() => navigate('/login')}
          className={`w-full flex items-center space-x-3 px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;