//src/components/common/BottomNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Video, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Therapy', path: '/therapy', icon: Activity },
    { name: 'Video', path: '/video-analysis', icon: Video },
    { name: 'Stats', path: '/progress', icon: BarChart3 },
    { name: 'More', path: '/settings', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-50 px-6 py-3 flex justify-between items-center safe-area-bottom">
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-300 ${
            isActive 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {({ isActive }) => (
            <>
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-blue-50 dark:bg-blue-900/20 scale-110' : ''
              }`}>
                <item.icon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {item.name}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default BottomNav;
