import { useState } from 'react';
import toast from 'react-hot-toast';
import { filesApi } from '../api/files.api';
import { useAuth } from '../context/auth';
import { validateFile } from '../utils/file';

export const useFileUpload = (onComplete) => {
  const { session } = useAuth();
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (fileList) => {
    if (!session.token) return;
    
    setUploading(true);
    const toastId = toast.loading("Starting upload...");

    let successCount = 0;
    let errors = [];

    const files = Array.from(fileList);

    for (const file of files) {
      const errorMsg = validateFile(file);
      if (errorMsg) {
          errors.push(`${file.name}: ${errorMsg}`);
          continue;
      }

      try {
        await filesApi.upload(session.token, file);
        successCount++;
      } catch (err) {
        console.error(err);
        const backendError = err.response?.data?.error || "Upload failed";
        errors.push(`${file.name}: ${backendError}`);
      }
    }

    setUploading(false);

    if (errors.length > 0) {
        toast.dismiss(toastId);
        errors.forEach(e => toast.error(e, { duration: 5000 }));
        
        if (successCount > 0) {
            toast.success(`Uploaded ${successCount} files successfully.`);
        }
    } else {
        toast.success(`Uploaded ${successCount} files!`, { id: toastId });
    }

    if (successCount > 0 && onComplete) {
        onComplete();
    }
  };

  return { uploadFiles, uploading };
};