import React, { createContext, useState, useEffect } from 'react';
import { api } from '../api/axiosInstance';

export const AuthContext = createContext();

// HARDCODED ADMIN CREDENTIALS
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
  user: {
    id: 'admin_001',
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@shop.com',
    role: 'admin',
    image: 'https://ui-avatars.com/api/?name=Admin+User&background=000000&color=ffffff'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for saved user on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (savedUser && token) {
        const parsedUser = JSON.parse(savedUser);
        
        // Check if it's admin
        if (parsedUser.role === 'admin') {
          setUser(parsedUser);
          setIsLoggedIn(true);
          setLoading(false);
          return;
        }

        // For regular users, try to verify with API
        try {
          const response = await api.getCurrentUser();
          setUser(response.data);
          setIsLoggedIn(true);
        } catch (error) {
          // If API fails, check if it's a locally registered user
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const userExists = registeredUsers.find(u => u.id === parsedUser.id);
          
          if (userExists) {
            setUser(parsedUser);
            setIsLoggedIn(true);
          } else {
            // Invalid, clear storage
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setIsLoggedIn(false);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      // FIRST: Check if it's admin login
      if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const adminToken = `admin_token_${Date.now()}`;
        localStorage.setItem('accessToken', adminToken);
        localStorage.setItem('user', JSON.stringify(ADMIN_CREDENTIALS.user));
        
        setUser(ADMIN_CREDENTIALS.user);
        setIsLoggedIn(true);
        
        return { success: true, user: ADMIN_CREDENTIALS.user };
      }

      // SECOND: Try API login (for demo users like 'emilys')
      try {
        const response = await api.login(username, password, 30);
        
        if (response.data) {
          const { accessToken, refreshToken, ...userData } = response.data;
          
          // Save tokens
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          // Save user data
          localStorage.setItem('user', JSON.stringify(userData));
          
          setUser(userData);
          setIsLoggedIn(true);
          
          return { success: true, user: userData };
        }
      } catch (apiError) {
        console.log('API login failed, checking local users...');
      }

      // THIRD: Check locally registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const localUser = registeredUsers.find(
        u => u.username === username && u.password === password
      );

      if (localUser) {
        const fakeToken = `local_${localUser.id}_${Date.now()}`;
        localStorage.setItem('accessToken', fakeToken);
        
        const { password: _, ...userWithoutPassword } = localUser;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        
        setUser(userWithoutPassword);
        setIsLoggedIn(true);
        
        return { success: true, user: userWithoutPassword };
      }

      // All login methods failed
      return {
        success: false,
        message: 'Invalid username or password'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  // Check if current user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        logout,
        updateUser,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};