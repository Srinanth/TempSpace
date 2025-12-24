import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Layout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-[#020205]">
      
            <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-[#020205]"></div>
          <div className="absolute inset-0 bg-deep-space opacity-80"></div>
      </div>

      <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-slate-50"></div>
          
          <div className="absolute top-0 inset-x-0 h-128 bg-linear-to-b from-blue-50/80 to-transparent"></div>
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[32px_32px] mask-[linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen text-slate-900 dark:text-gray-100">
        {children}
      </div>
    </div>
  );
};

export default Layout;