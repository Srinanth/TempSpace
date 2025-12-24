import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md z-50">
        <div className="bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in zoom-in-95 duration-200">
          
          <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
             <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
             <button 
                onClick={onClose} 
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
             >
               <X size={20} />
             </button>
          </div>

          <div className="p-5 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;