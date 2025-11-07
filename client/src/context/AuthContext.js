import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/api/users/profile`);
          if (response.data.success) {
            const userData = {
              ...response.data.data.user,
              avatar: response.data.data.avatar
            };
            setUser(userData);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (ten_dang_nhap, mat_khau) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/dang-nhap`, {
        ten_dang_nhap,
        mat_khau
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        // Load avatar after login
        try {
          const profileResponse = await axios.get(`${API_URL}/api/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (profileResponse.data.success) {
            const userData = {
              ...profileResponse.data.data.user,
              avatar: profileResponse.data.data.avatar
            };
            setUser(userData);
          } else {
            setUser(user);
          }
        } catch (error) {
          setUser(user);
        }
        setToken(token);
        localStorage.setItem('token', token);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng nhập thất bại'
      };
    }
  };

  const register = async (userData) => {
    try {
  const response = await axios.post(`${API_URL}/api/users/dang-ky`, userData);

      if (response.data.success) {
        const { user, token } = response.data.data;
        // Load avatar after login
        try {
          const profileResponse = await axios.get(`${API_URL}/api/users/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (profileResponse.data.success) {
            const userData = {
              ...profileResponse.data.data.user,
              avatar: profileResponse.data.data.avatar
            };
            setUser(userData);
          } else {
            setUser(user);
          }
        } catch (error) {
          setUser(user);
        }
        setToken(token);
        localStorage.setItem('token', token);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Đăng ký thất bại',
        errors: error.response?.data?.errors
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};