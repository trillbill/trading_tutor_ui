import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Call the endpoint that uses the cookie to authenticate
        const response = await api.get('/api/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        // If error, user is not authenticated
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuthStatus();
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!user;
  
  // Check if email is verified
  const isEmailVerified = user?.email_verified || false;

  // Check email verification status
  const checkEmailVerification = async () => {
    try {
      const response = await api.get('/api/auth/me');
      if (response.data.success && response.data.user.email_verified) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Verification check error:', error);
      return false;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      } else if (response.data.needsVerification) {
        return { success: false, needsVerification: true };
      } else {
        return { success: false, error: response.data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        return { success: false, error: error.response.data.error || 'Invalid credentials' };
      }
      return { success: false, error: 'An error occurred during login' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Register function
  const register = async (email, password, username) => {
    try {
      const response = await api.post('/api/auth/register', {
        email,
        password,
        username
      });
      
      // Ensure we have a consistent response format
      return { 
        success: response.data.success === true,
        message: response.data.message || '',
        error: response.data.error || ''
      };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data) {
        return { 
          success: false, 
          error: error.response.data.error || 'Registration failed'
        };
      }
      return { 
        success: false, 
        error: 'An error occurred during registration'
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      initialized,
      isAuthenticated,
      isEmailVerified,
      checkEmailVerification,
      login, 
      logout, 
      register 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);