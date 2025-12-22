const Input = ({ className = '', ...props }) => (
  <input 
    className={`w-full px-4 py-3 rounded-xl outline-none transition-all duration-200
      bg-white dark:bg-gray-900 
      border border-gray-200 dark:border-gray-700 
      text-gray-900 dark:text-gray-100 
      focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 
      placeholder:text-gray-400 dark:placeholder:text-gray-600
      ${className}`}
    {...props}
  />
);
export default Input;