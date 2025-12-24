const Input = ({ className = '', ...props }) => (
  <input 
    className={`w-full px-4 py-3 rounded-xl outline-none transition-all duration-200
      bg-slate-50 dark:bg-black/50
      border border-slate-300 dark:border-white/10
      text-slate-900 dark:text-white
      focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 
      focus:bg-white dark:focus:bg-black
      placeholder:text-slate-400 dark:placeholder:text-gray-600
      disabled:opacity-60 disabled:cursor-not-allowed
      font-medium
      ${className}`}
    {...props}
  />
);

export default Input;