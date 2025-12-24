import { useState } from 'react';
import toast from 'react-hot-toast';
import { spaceApi } from '../api/space.api';
import { useAuth } from '../context/auth';

export const useSettings = (settings, onUpdate, onClose) => {
  const { session } = useAuth();
  
  const [view, setView] = useState('MENU'); 
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleClose = () => {
      setView('MENU');
      setPasswordInput('');
      setShowRemoveConfirm(false);
      onClose();
  };

  const handleTogglePublic = async () => {
      try {
          await spaceApi.updateSettings(session.token, { public_upload: !settings.public_upload });
          onUpdate();
      } catch (err) { toast.error("Update failed"); }
  };

  const onPasswordToggleClick = () => {
      if (settings.password_protected) {
          setShowRemoveConfirm(true);
      } else {
          setView('PASSWORD_INPUT');
      }
  };

  const handleRemovePassword = async () => {
      try {
          await spaceApi.updateSettings(session.token, { password_protected: false });
          onUpdate();
          toast.success("Password removed");
          setShowRemoveConfirm(false);
      } catch(err) { 
          toast.error("Failed to remove password"); 
      }
  };

  const handleSubmitPassword = async () => {
      const finalPassword = passwordInput.trim();
      if (!finalPassword || finalPassword.length < 4) {
          toast.error("Password must be at least 4 chars");
          return;
      }
      setLoading(true);
      try {
          await spaceApi.updateSettings(session.token, { 
              password_protected: true, 
              password: finalPassword 
          });
          onUpdate();
          toast.success("Space locked successfully");
          handleClose();
      } catch (err) {
          toast.error("Failed to set password");
      }
      setLoading(false);
  };

  return {
    view, setView,
    passwordInput, setPasswordInput,
    loading,
    showRemoveConfirm, setShowRemoveConfirm,
    handleClose,
    handleTogglePublic,
    onPasswordToggleClick,
    handleRemovePassword,
    handleSubmitPassword
  };
};