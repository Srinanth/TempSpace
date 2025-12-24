import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { LogOut, CheckCircle } from 'lucide-react';
import { spaceApi } from '../api/space.api';

const AuthContext = createContext();

const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const Auth = ({ children }) => {
  const [session, setSession] = useState(() => {
    try {
        const stored = localStorage.getItem('space_session');
        return stored ? JSON.parse(stored) : { token: null, role: null, spaceCode: null };
    } catch {
        return { token: null, role: null, spaceCode: null };
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      if (!session.token) {
          setIsLoading(false);
          return;
      }

      const decoded = parseJwt(session.token);
      if (decoded && session.role && decoded.role) {
          if (session.role.toUpperCase() === 'ADMIN' && decoded.role.toUpperCase() !== 'ADMIN') {
               console.warn("Role Mismatch Detected. Downgrading.");
               const fixedSession = { ...session, role: decoded.role };
               setSession(fixedSession);
               localStorage.setItem('space_session', JSON.stringify(fixedSession));
               setIsLoading(false);
               return;
          }
      }

      try {
        await spaceApi.getDetails(session.token);
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403 || err.response.status === 404)) {
            console.log("Session expired or invalid. Logging out.");
            logout(false);
        } else {
            console.warn("Network error during validation. Keeping session.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  const login = (data) => {
    const newSession = {
      token: data.token,
      role: data.role,
      spaceCode: data.space?.share_code || session.spaceCode,
      spaceId: data.space?.id || session.spaceId
    };
    
    setSession(newSession);
    localStorage.setItem('space_session', JSON.stringify(newSession));
    
    toast.success(data.role === 'ADMIN' ? "Space Created!" : "Joined Space!", {
        icon: <CheckCircle size={18} className="text-emerald-500" />
    });
  };

  const logout = (showToast = true) => {
    setSession({ token: null, role: null, spaceCode: null });
    localStorage.removeItem('space_session');
    sessionStorage.clear(); 

    if (showToast) {
        toast("Disconnected", {
            icon: <LogOut size={18} className="text-gray-500" />
        });
    }
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);