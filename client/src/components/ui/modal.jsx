import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
             <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
               <X size={20} />
             </button>
          </div>

          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;