const Toggle = ({ checked, onChange }) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
      checked ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-white/20'
    }`}
  >
    <span className="sr-only">Toggle settings</span>
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

export default Toggle;