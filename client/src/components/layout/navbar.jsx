import React from 'react';
import { FolderOpen, X, Copy, CheckCircle, Moon, Sun, Settings } from 'lucide-react';
import Button from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';

const Navbar = ({ spaceCode, usedBytes, totalBytes, onExit, onSettings }) => {
  const [copied, setCopied] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  
  const percentage = Math.min((usedBytes / totalBytes) * 100, 100);

  const handleCopy = () => {
    navigator.clipboard.writeText(spaceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
           <button 
             onClick={toggleTheme}
             className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-amber-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
             title="Toggle Theme"
           >
             {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} className="text-amber-500" />}
           </button>

           <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1 hidden sm:block"></div>

           <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
               <FolderOpen size={20} />
             </div>
             <h1 className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">TempSpace</h1>
           </div>
        </div>

        {spaceCode && (
           <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
             <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Code</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{spaceCode}</span>
                <button onClick={handleCopy} className="ml-2 text-gray-400 hover:text-indigo-500 transition-colors">
                  {copied ? <CheckCircle size={14} className="text-emerald-500"/> : <Copy size={14}/>}
                </button>
             </div>
           </div>
        )}

        <div className="flex items-center gap-2">
           {onSettings && (
             <Button variant="ghost" onClick={onSettings} className="hidden sm:flex">
               <Settings size={18} />
             </Button>
           )}
           <Button variant="danger" icon={X} onClick={onExit} className="px-3">
             <span className="hidden sm:inline">Exit</span>
           </Button>
        </div>
      </div>

      <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
         <div className="h-full bg-linear-to-r from-indigo-500 to-emerald-500 transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>
    </header>
  );
};
export default Navbar;