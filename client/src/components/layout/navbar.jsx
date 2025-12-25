import { LogOut, Settings, Moon, Sun, Copy } from 'lucide-react';
import Button from '../ui/Button';
import { useNavbar } from '../../hooks/useNavbar';

const Navbar = ({ spaceCode, usedBytes = 0, totalBytes = 52428800, onExit, onSettings }) => {
  const { 
    theme, 
    toggleTheme, 
    copyCode, 
    formattedUsed, 
    formattedTotal, 
    percentage, 
    progressColor 
  } = useNavbar(spaceCode, usedBytes, totalBytes);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#020205]/80 backdrop-blur-xl transition-all duration-300">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 md:gap-3">
                <img 
                  src="/TempSpaceLogo.png" 
                  alt="TempSpace" 
                  className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-sm" 
                />
                
                <div className="hidden sm:block font-bold text-lg md:text-xl tracking-tight text-slate-900 dark:text-white">
                    TempSpace
                </div>
            </div>
            
            <div onClick={copyCode} className="cursor-pointer group flex items-center gap-2 px-2.5 py-1 md:px-3 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-all">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-400 tracking-widest group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {spaceCode}
                </span>
                <Copy size={12} className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
            </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
            
            <div className="hidden md:flex flex-col items-end mr-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-500 mb-1">
                    Storage Used
                </div>
                <div className="relative w-24 md:w-32 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className={`absolute top-0 left-0 h-full ${progressColor} transition-all duration-700 ease-out`} 
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-700 dark:text-gray-400 mt-1">
                    {formattedUsed} / {formattedTotal}
                </div>
            </div>

            <div className="h-6 md:h-8 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>

            <button 
                onClick={toggleTheme}
                className="p-2 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {onSettings && (
                <Button variant="ghost" icon={Settings} onClick={onSettings} className="p-2 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/10" />
            )}
            
            <Button 
                variant="danger" 
                icon={LogOut} 
                onClick={onExit} 
                className="py-1.5 px-3 text-xs h-9 font-bold bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30"
            >
                Exit
            </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;