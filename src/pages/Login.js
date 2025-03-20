import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaExchangeAlt, FaArrowLeft } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import './Login.css';
import heroImage from '../assets/btc-price-phone1.png'; // Use the same hero image as your Learn page

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Preload the hero image
    const img = new Image();
    img.src = heroImage;
    img.onload = () => setImageLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      if (isLogin) {
        // Handle login using the AuthContext login function
        const result = await login(email, password);
        
        if (result.success) {
          // Successful login, redirect to account page
          setMessage('Login successful!');
          navigate('/account');
        } else if (result.needsVerification) {
          // Email needs verification
          setNeedsVerification(true);
          setMessage('Please verify your email before logging in. Check your inbox for a verification link.');
        } else {
          // Login failed for other reasons
          setMessage(result.error || 'Login failed. Please check your credentials.');
        }
      } else {
        // Handle registration using the AuthContext register function
        const result = await register(email, password, username);
        
        if (result.success) {
          // Registration successful, show verification notice
          setMessage(result.message || 'Registration successful! Please check your email to verify your account.');
          setNeedsVerification(true);
        } else {
          // Registration failed
          setMessage(result.error || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add a function to resend verification email
  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem('tempUserEmail');
      if (!email) {
        setMessage('User information not found. Please try logging in again.');
        return;
      }
      
      await api.post('api/auth/resend-verification', { email });
      setMessage('Verification email has been resent. Please check your inbox.');
    } catch (error) {
      console.error('Error resending verification:', error);
      setMessage(error.response?.data?.error || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  // Add a function to return to login form
  const handleReturnToLogin = () => {
    setNeedsVerification(false);
    setIsLogin(true);
    setMessage('');
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-form-card">
          <h2 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Sign in to continue your learning journey' 
              : 'Join our community of traders and start learning'}
          </p>
          
          {message && <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</div>}
          
          {needsVerification ? (
            <div className="verification-notice">
              <h3>Email Verification Required</h3>
              <p>Please check your email and click the verification link to activate your account.</p>
              <p>Once verified, you can log in and access all features.</p>
              
              <div className="verification-actions">
                <button 
                  onClick={handleResendVerification} 
                  className="resend-button"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Resend Verification Email'}
                </button>
                
                <button 
                  onClick={handleReturnToLogin} 
                  className="return-login-button"
                >
                  <FaArrowLeft className="button-icon-left" /> Return to Login
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="username">
                    <FaUser className="input-icon" />
                    <span>Username</span>
                  </label>
                  <input 
                    type="text" 
                    id="username"
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    required 
                    placeholder="Choose a username"
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="input-icon" />
                  <span>Email</span>
                </label>
                <input 
                  type="email" 
                  id="email"
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  required 
                  placeholder="Your email address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">
                  <FaLock className="input-icon" />
                  <span>Password</span>
                </label>
                <input 
                  type="password"
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required 
                  placeholder="Your password"
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <div className="button-spinner"></div>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'} 
                    <FaArrowRight className="button-icon" />
                  </>
                )}
              </button>
            </form>
          )}
          
          {!needsVerification && (
            <div className="auth-toggle">
              <button onClick={() => setIsLogin(prev => !prev)} className="toggle-button">
                <FaExchangeAlt className="toggle-icon" />
                {isLogin ? 'Need to create an account?' : 'Already have an account?'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;