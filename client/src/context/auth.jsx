import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { spaceApi } from '../api/space.api';

const AuthContext = createContext(null);

export const Auth = ({ children }) => {
  const [session, setSession] = useState(() =>
 ({
    token: localStorage.getItem('ts_token'),
    role: localStorage.getItem('ts_role'),
    spaceCode: localStorage.getItem('ts_code')
  }));

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      if (!session.token) {
        setIsLoading(false);
        return;
      }

      try {
        await spaceApi.getDetails(session.token);
      } catch (err) {
        console.error("Session Validation Error:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 404)) {
            logout();
            toast.error("Space has expired.");
        } 
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []); 

  const login = (data) => {
    const role = data.role || (data.token ? 'GUEST' : 'ADMIN');
    const code = data.space?.share_code;

    localStorage.setItem('ts_token', data.token);
    localStorage.setItem('ts_role', role);
    if(code) localStorage.setItem('ts_code', code);
    
    setSession({ 
        token: data.token, 
        role, 
        spaceCode: code 
    });
    
    toast.success(role === 'ADMIN' ? "Space Created!" : "Joined Space!");
  };

  const logout = () => {
    localStorage.removeItem('ts_token');
    localStorage.removeItem('ts_role');
    localStorage.removeItem('ts_code');
    setSession({ token: null, role: null, spaceCode: null });
    toast('Disconnected', { icon: '👋' });
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);