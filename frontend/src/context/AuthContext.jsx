import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('faceguard_token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
        } catch (err) {
          console.error("Auth initialization failed:", err);
          localStorage.removeItem('faceguard_token');
          localStorage.removeItem('faceguard_user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password, remember = true) => {
    const res = await authAPI.login({ email, password });
    const { access_token, user_id, name, role } = res.data;
    
    if (remember) {
      localStorage.setItem('faceguard_token', access_token);
    } else {
      sessionStorage.setItem('faceguard_token', access_token);
      localStorage.setItem('faceguard_token', access_token);
    }

    const userData = { id: user_id, name, email, role };
    setUser(userData);
    localStorage.setItem('faceguard_user', JSON.stringify(userData));
    return res.data;
  };

  const register = async (name, email, password, phone) => {
    const res = await authAPI.register({ name, email, password, phone });
    const { access_token, user_id, role } = res.data;
    localStorage.setItem('faceguard_token', access_token);
    const userData = { id: user_id, name, email, role };
    setUser(userData);
    localStorage.setItem('faceguard_user', JSON.stringify(userData));
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('faceguard_token');
    localStorage.removeItem('faceguard_user');
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
