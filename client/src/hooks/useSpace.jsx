import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';
import { spaceApi } from '../api/space.api';
import { useAuth } from '../context/auth';

export const useSpace = () => {
  const { session, logout } = useAuth();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const visitTracked = useRef(false);

  const refreshSpace = useCallback(async () => {
    if (!session.token) return;
    
    try {
      const data = await spaceApi.getDetails(session.token);
      setSpace(data);
    } catch (err) {
      console.error(err);
      
      // 404 = Space deleted/expired
      // 401 = Token invalid
      if (err.response?.status === 404 || err.response?.status === 401) {
          toast.error("Space has expired or was closed.", {
            icon: <AlertTriangle size={18} className="text-amber-500" />
          });
          logout();
      }
    } finally {
      setLoading(false);
    }
  }, [session.token, logout]);

  useEffect(() => { 
    refreshSpace(); 
  }, [refreshSpace]);

  useEffect(() => {
    if (!session.token || !session.spaceCode || visitTracked.current) return;

    const storageKey = `ts_visited_${session.spaceCode}`;
    const hasVisited = sessionStorage.getItem(storageKey);

    if (!hasVisited) {
        visitTracked.current = true;
        
        spaceApi.trackVisit(session.token)
            .then(() => {
                sessionStorage.setItem(storageKey, 'true');
                
                refreshSpace();
            })
            .catch(err => console.error("Visit tracking failed", err));
    }
  }, [session.token, session.spaceCode, refreshSpace]);

  return { space, setSpace, loading, refreshSpace };
};