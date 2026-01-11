import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { spaceApi } from '../api/space.api';
import { useAuth } from '../context/auth';
import { saveToHistory, getAdminToken } from '../utils/history';

export const useJoinSpace = () => {
  const { login } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockedData, setLockedData] = useState(null); 
  const [password, setPassword] = useState('');

  // Auto-Join Logic
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/join\/([a-zA-Z0-9]{4})/);
    if (match && match[1]) {
        const foundCode = match[1].toUpperCase();
        setCode(foundCode);

        window.history.replaceState({}, document.title, "/");
        
        handleJoin(foundCode);
    }
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    try {
        const data = await spaceApi.create();
        saveToHistory(data);
        login({ ...data, role: 'ADMIN' });
        
        setTimeout(() => window.location.reload(), 100);

    } catch(err) { 
        const errorMessage =  'Server unavailable';
        toast.error(errorMessage);    
    }
    setLoading(false);
  };

  const handleJoin = async (overrideCode) => {
    const codeToUse = typeof overrideCode === 'string' ? overrideCode : code;
    if(!codeToUse || codeToUse.length !== 4) return;
    
    setLoading(true);
    try {
        const savedToken = getAdminToken(codeToUse);

        if (savedToken) {
            try {
                const spaceDetails = await spaceApi.getDetails(savedToken);
                console.log("Restoring Admin Session...");
                login({ token: savedToken, role: 'ADMIN', space: spaceDetails });
                
                setTimeout(() => window.location.reload(), 100);
                
                setLoading(false);
                return;
            } catch (err) {
                console.log("Saved admin token invalid, joining as guest.");
            }
        }

        const data = await spaceApi.join(codeToUse);
        
        if (data.locked) {
            setLockedData({ spaceId: data.space.id, code: codeToUse });
            toast("Password Required", { icon: '🔒' });
        } else {
            login({ ...data, role: 'GUEST' });
            
            setTimeout(() => window.location.reload(), 100);
        }
    } catch(err) { 
        toast.error(err.response?.data?.error || 'Space not found'); 
    }
    setLoading(false);
  };

  const handleUnlock = async () => {
    setLoading(true);
    try {
        const data = await spaceApi.unlock(lockedData.spaceId, password);
        login({ 
            token: data.token, 
            role: data.role || 'GUEST',
            space: data.space || { id: lockedData.spaceId, share_code: lockedData.code }
        });
        setLockedData(null); 
        
        setTimeout(() => window.location.reload(), 100);

    } catch(err) { 
        toast.error('Incorrect password'); 
    }
    setLoading(false);
  };

  return {
    code, setCode,
    loading,
    lockedData, setLockedData,
    password, setPassword,
    handleCreate,
    handleJoin,
    handleUnlock
  };
};