import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './modal';
import Button from './Button';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDangerous = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
           <div className={`p-2.5 rounded-lg shrink-0 ${isDangerous ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-amber-100 text-amber-600'}`}>
              <AlertTriangle size={20} strokeWidth={2.5} />
           </div>
           <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
              {message}
           </p>
        </div>
        
        <div className="flex gap-3 justify-end pt-2">
           <Button variant="secondary" onClick={onClose} className="flex-1 md:flex-none">Cancel</Button>
           <Button 
             variant={isDangerous ? "danger" : "primary"} 
             onClick={() => { onConfirm(); onClose(); }}
             className="flex-1 md:flex-none"
           >
             {confirmText}
           </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;