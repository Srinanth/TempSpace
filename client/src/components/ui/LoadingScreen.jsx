import { Rocket } from 'lucide-react';

const LoadingScreen = ({ message = "Establishing Secure Connection..." }) => {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#020205] flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500">
      
      <div 
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15] pointer-events-none"
        style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px',
            color: 'gray'
        }}
      ></div>
      
      <div className="absolute inset-0 bg-linear-to-t from-slate-50 via-transparent to-slate-50 dark:from-[#020205] dark:via-transparent dark:to-[#020205] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-8">
           <div className="absolute inset-0 bg-indigo-500/30 dark:bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
           
           <div className="relative p-6 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl animate-bounce-slow">
              <Rocket size={40} className="text-indigo-600 dark:text-white fill-current" />
           </div>
        </div>

        <div className="w-64 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-4">
           <div className="h-full bg-indigo-600 dark:bg-white animate-progress-indeterminate rounded-full"></div>
        </div>

        <p className="text-sm font-bold text-slate-600 dark:text-gray-400 animate-pulse tracking-wide">
           {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;