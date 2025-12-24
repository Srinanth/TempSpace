const Button = ({ children, variant = 'primary', icon: Icon, className = '', ...props }) => {
  const variants = {
    primary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',
    
    secondary: 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5',
    
    danger: 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/50 dark:hover:bg-rose-900/40 transition-colors',
    
    ghost: 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-gray-400',
  };
  
  return (
    <button 
      className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${variants[variant]} ${className}`} 
      {...props}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;