//src/components/common/Layout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      {/* Sidebar - Desktop Only */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div 
        className={`transition-all duration-500 ease-in-out pb-24 md:pb-0 ${
          isCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Header />
        
        <main className="p-4 md:p-8 animate-fadeIn">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>

        {/* Bottom Nav - Mobile Only */}
        <BottomNav />

        {/* Decorative Background Elements */}
        <div className="fixed top-0 right-0 -z-10 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 -z-10 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />
      </div>
    </div>
  );
};

export default Layout;
