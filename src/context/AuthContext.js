import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  // Use a ref to track if the effect has run
  const effectRan = useRef(false);
  const tokenCheckInterval = useRef(null);

  // Check token status and refresh if needed
  const checkTokenStatus = async () => {
    try {
      const response = await api.get('/api/auth/token-status');
      const { valid, expired, shouldRefresh } = response.data;
      
      if (expired) {
        // Token is expired, log user out
        setUser(null);
        return false;
      }
      
      if (valid && shouldRefresh) {
        // Token is valid but should be refreshed
        try {
          await api.post('/api/auth/refresh-token');
        } catch (refreshError) {
          console.error('Proactive token refresh failed:', refreshError);
          // Don't log out here, let the token expire naturally
        }
      }
      
      return valid;
    } catch (error) {
      console.error('Token status check failed:', error);
      // If the token status check fails, assume token is invalid but don't loop
      return false;
    }
  };

  // Set up periodic token checking
  const startTokenMonitoring = () => {
    // Clear existing interval
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
    }
    
    // Check token status every 2 hours (much less frequent to prevent loops)
    tokenCheckInterval.current = setInterval(() => {
      if (user) {
        checkTokenStatus();
      }
    }, 2 * 60 * 60 * 1000); // 2 hours
  };

  // Stop token monitoring
  const stopTokenMonitoring = () => {
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
      tokenCheckInterval.current = null;
    }
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    // In development, React will run effects twice in strict mode
    // This check prevents the second run in development
    if (effectRan.current === true) {
      return;
    }
    
    const checkAuthStatus = async () => {
      try {
        const response = await api.get('/api/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
          startTokenMonitoring();
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
    
    // Cleanup function that runs when component unmounts
    return () => {
      effectRan.current = true;
    };
  }, []); // Empty dependency array means this runs once on mount

  // Set up event listeners for auth events
  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      stopTokenMonitoring();
    };

    const handleTokenRefreshed = () => {
      // Optionally refresh user data here if needed
    };

    const handleAuthError = (event) => {
      console.log('Authentication error:', event.detail?.error);
      // Handle other auth errors as needed
    };

    // Add event listeners
    window.addEventListener('authExpired', handleAuthExpired);
    window.addEventListener('tokenRefreshed', handleTokenRefreshed);
    window.addEventListener('authError', handleAuthError);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('authExpired', handleAuthExpired);
      window.removeEventListener('tokenRefreshed', handleTokenRefreshed);
      window.removeEventListener('authError', handleAuthError);
    };
  }, []);

  // Cleanup token monitoring on unmount
  useEffect(() => {
    return () => {
      stopTokenMonitoring();
    };
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
        startTokenMonitoring(); // Start monitoring tokens after successful login
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
      stopTokenMonitoring(); // Stop monitoring tokens after logout
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear user state
      setUser(null);
      stopTokenMonitoring();
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

  // Manual token refresh function
  const refreshToken = async () => {
    try {
      await api.post('/api/auth/refresh-token');
      return true;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return false;
    }
  };

  const value = {
    user,
    loading,
    initialized,
    isAuthenticated,
    isEmailVerified,
    login,
    logout,
    register,
    checkEmailVerification,
    refreshToken,
    checkTokenStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};