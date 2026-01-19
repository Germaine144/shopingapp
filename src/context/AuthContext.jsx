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
      try {
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

          // For regular users, check locally first (faster)
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const userExists = registeredUsers.find(u => u.id === parsedUser.id);
          
          if (userExists) {
            setUser(parsedUser);
            setIsLoggedIn(true);
            setLoading(false);
            return;
          }

          // Only try API if user is not found locally
          // Add timeout to prevent hanging
          if (api.getCurrentUser) {
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 3000)
            );

            try {
              const response = await Promise.race([
                api.getCurrentUser(),
                timeoutPromise
              ]);
              
              setUser(response.data);
              setIsLoggedIn(true);
            } catch (error) {
              console.log('API verification failed, clearing session');
              // Invalid, clear storage
              localStorage.removeItem('user');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              setUser(null);
              setIsLoggedIn(false);
            }
          } else {
            // API method doesn't exist, clear invalid session
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
        // On any error, just clear and continue
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []); // Empty array - runs only once!

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
        // Add timeout for API call
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API timeout')), 5000)
        );

        const response = await Promise.race([
          api.login(username, password, 30),
          timeoutPromise
        ]);
        
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
        console.log('API login failed, checking local users...', apiError.message);
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