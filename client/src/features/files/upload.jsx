import React, { useState } from 'react';
import { Upload, FileUp, Lock } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useFileUpload } from '../../hooks/upload';

const UploadZone = ({ onUploadComplete, disabled }) => {
  const { uploadFiles, uploading } = useFileUpload(onUploadComplete);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault(); 
    setIsDragOver(false);
    if (!disabled && e.dataTransfer.files) {
        uploadFiles(e.dataTransfer.files);
    }
  };

  if (disabled) {
    return (
      <div className="p-6 md:p-8 rounded-2xl border-2 border-dashed border-gray-400 dark:border-white/10 bg-gray-200 dark:bg-white/5 backdrop-blur-sm text-center">
         <div className="mx-auto w-10 h-10 md:w-12 md:h-12 bg-gray-300 dark:bg-white/5 rounded-full flex items-center justify-center mb-3">
            <Lock className="text-gray-600 dark:text-gray-500" size={20} />
         </div>
         <p className="text-gray-600 text-sm font-medium">Uploads locked.</p>
      </div>
    );
  }

  return (
    <div 
        className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-6 md:p-10 text-center transition-all duration-300 cursor-pointer group
            ${isDragOver 
                ? 'border-gray-900 bg-gray-400 dark:border-white dark:bg-white/20 scale-[1.01]' 
                : 'border-gray-400 dark:border-white/20 hover:border-gray-600 dark:hover:border-white/40 bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10'
            }`}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
    >
        {/* Icon Circle */}
        <div className={`mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-4 transition-all duration-300 
            ${isDragOver 
                ? 'bg-gray-900 text-white scale-110' 
                : 'bg-white dark:bg-white/10 text-gray-500 dark:text-gray-400 group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black group-hover:scale-110 shadow-sm'
            }`}
        >
            {uploading ? <FileUp className="animate-bounce" /> : <Upload />}
        </div>
        
        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1">
          {uploading ? 'Uploading...' : 'Upload Files'}
        </h3>
        
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-6 font-medium">
          Drag & drop or click to select (Max 50MB)
        </p>

        <input 
          type="file" 
          multiple 
          id="fileInput" 
          className="hidden" 
          onChange={e => uploadFiles(e.target.files)} 
          disabled={uploading} 
        />
        
        <div className="relative z-10">
            <Button 
                variant="primary" 
                as="span" 
                className="mx-auto pointer-events-none text-sm" 
                disabled={uploading}
            >
               {uploading ? 'Processing...' : 'Select Files'}
            </Button>
        </div>
    </div>
  );
};

export default UploadZone;