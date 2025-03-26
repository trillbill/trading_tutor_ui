import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Set default auth header for all requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data if needed
          // const response = await api.get('api/auth/me');
          
          setIsAuthenticated(true);
          setIsEmailVerified(localStorage.getItem('emailVerified') === 'true');
          
          setUser({
            id: localStorage.getItem('userId'),
            email: localStorage.getItem('userEmail'),
            username: localStorage.getItem('username'),
            solanaAddress: localStorage.getItem('solanaAddress') || '',
            riskAppetite: localStorage.getItem('riskAppetite') || 5,
          });
        } catch (error) {
          console.error('Auth check error:', error);
          // If token is invalid, clear everything
          logout();
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('api/auth/login', { email, password });
      
      if (!response.data || !response.data.token) {
        return { 
          success: false, 
          error: 'Invalid response from server' 
        };
      }
      
      const { token, user } = response.data;
      
      // Check if email is verified
      if (!user.emailVerified) {
        localStorage.setItem('tempUserId', user.id);
        localStorage.setItem('tempUserEmail', email);
        return { 
          success: false, 
          needsVerification: true,
          message: 'Please verify your email before logging in.'
        };
      }
      
      // Email is verified, proceed with login
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userEmail', user.email);
      localStorage.setItem('username', user.username);
      localStorage.setItem('solanaAddress', user.solana_address || '');
      localStorage.setItem('emailVerified', 'true');
      localStorage.setItem('riskAppetite', user.risk_appetite || 5);
      
      // Set auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setIsAuthenticated(true);
      setIsEmailVerified(true);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (email, password, username) => {
    try {
      const response = await api.post('api/auth/register', { 
        email, 
        password, 
        username 
      });
      
      // Store temporary user info for verification
      localStorage.setItem('tempUserId', response.data.user.id);
      localStorage.setItem('tempUserEmail', email);
      
      return { 
        success: true, 
        needsVerification: true,
        message: response.data.message || 'Registration successful! Please check your email to verify your account.'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    // Clear auth header
    delete api.defaults.headers.common['Authorization'];
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    localStorage.removeItem('solanaAddress');
    localStorage.removeItem('emailVerified');
    localStorage.removeItem('riskAppetite');
    
    // Update state
    setIsAuthenticated(false);
    setIsEmailVerified(false);
    setUser(null);
  };

  const checkEmailVerification = async (email) => {
    try {
      const response = await api.post('api/auth/check-email-verification', { 
        email: email || localStorage.getItem('tempUserEmail') 
      });
      return response.data.verified;
    } catch (error) {
      console.error('Error checking verification:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isEmailVerified,
        user,
        loading,
        login,
        register,
        logout,
        checkEmailVerification
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};