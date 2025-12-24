import { useState, useEffect } from 'react';
import { filesApi } from '../api/files.api';
import { useAuth } from '../context/auth';

export const useFileList = (refreshTrigger) => {
  const { session } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = session.role === 'ADMIN';

  const fetchFiles = async () => {
    if(!session.token) return;
    try {
        const data = await filesApi.list(session.token);
        setFiles(data);
    } catch(err) { 
        console.error("Failed to load files", err); 
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, [session.token, refreshTrigger]);

  const handleDownload = (file) => filesApi.download(session.token, file.id, file.filename);
  
  const handleDelete = async (id) => {
      if(!window.confirm('Permanently delete this file?')) return;
      
      setFiles(prev => prev.filter(f => f.id !== id));
      
      try {
          await filesApi.delete(session.token, id);
          fetchFiles();
      } catch (err) {
          console.error("Delete failed", err);
          fetchFiles();
      }
  };

  return { files, loading, isAdmin, handleDownload, handleDelete };
};