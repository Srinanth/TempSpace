import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/auth';
import { useSpace } from '../hooks/useSpace';
import { spaceApi } from '../api/space.api';
import { filesApi } from '../api/files.api';
import { useCountdown } from '../utils/time';

export const useSpaceDashboard = () => {
  const { session, logout } = useAuth();
  const { space, refreshSpace, setSpace } = useSpace();
  
  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [refreshFileTrigger, setRefreshFileTrigger] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  
  // Preview State
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const timeLeft = useCountdown(space?.expires_at);
  const isAdmin = session?.role === 'ADMIN';


  const handleCopyLink = () => {
      const url = `${window.location.origin}/join/${space.share_code}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copied");
  };

  const handleDownloadAll = async () => {
      const toastId = toast.loading("Preparing download...");
      try {
          const files = await filesApi.list(session.token);
          if(files.length === 0) throw new Error("No files");
          
          let count = 0;
          for(const f of files) {
              await filesApi.download(session.token, f.id, f.filename);
              count++;
              await new Promise(r => setTimeout(r, 300));
          }
          toast.success(`Downloading ${count} files`, { id: toastId });
      } catch(err) {
          toast.error("Download failed", { id: toastId });
      }
  };

  const handleExtend = async () => {
    setActiveModal(null); 
    try {
        const response = await spaceApi.extendSpace(session.token);
        const newExpiry = response.expires_at || response.data?.expires_at;

        if (!newExpiry) throw new Error("Invalid server response");

        setSpace(prev => ({
            ...prev,
            expires_at: newExpiry,
            extend_count: (prev.extend_count || 0) + 1
        }));
        
        toast.success("Space extended +24h");
    } catch(err) { 
        console.error("Extension error:", err);
        toast.error(err.response?.data?.error || "Extension failed"); 
    }
  };

  const handleDeleteAllFiles = async () => {
      try {
          await spaceApi.deleteAllFiles(session.token);
          toast.success("All files deleted");
          refreshSpace();
          setRefreshFileTrigger(prev => prev + 1);
      } catch(err) { toast.error("Delete failed"); }
  };

  const handleDeleteSpace = async () => {
      try {
          await spaceApi.deleteSpace(session.token);
          toast.success("Space deleted");
          logout(); 
      } catch(err) { toast.error("Delete failed"); }
  };

  const handlePreview = async (file) => {
      if (!file.mime_type?.startsWith('image/')) return;
      const toastId = toast.loading("Loading preview...");
      try {
          const blob = await filesApi.downloadBlob(session.token, file.id);
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          setPreviewFile(file);
          toast.dismiss(toastId);
      } catch(err) { toast.error("Preview failed", { id: toastId }); }
  };

  const closePreview = () => {
      if(previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewFile(null); setPreviewUrl(null);
  };

  return {
    // Data
    space,
    isAdmin,
    timeLeft,
    refreshSpace,
    setRefreshFileTrigger,
    refreshFileTrigger,
    
    // UI State
    showSettings, setShowSettings,
    activeModal, setActiveModal,
    previewFile, previewUrl,

    // Handlers
    logout,
    handleCopyLink,
    handleDownloadAll,
    handleExtend,
    handleDeleteAllFiles,
    handleDeleteSpace,
    handlePreview,
    closePreview
  };
};