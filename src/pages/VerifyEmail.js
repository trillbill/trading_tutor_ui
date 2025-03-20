import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const email = params.get('email');
      
      if (!token) {
        setVerificationStatus('error');
        setMessage('Verification token is missing.');
        return;
      }
      
      try {
        const endpoint = email 
          ? `api/auth/verify-email?token=${token}&email=${email}`
          : `api/auth/verify-email?token=${token}`;
          
        const response = await api.get(endpoint);
        
        setVerificationStatus('success');
        setMessage(response.data.message);
        
        // If verification was successful, we can try to log the user in automatically
        if (email) {
          try {
            // Store that the email is verified
            localStorage.setItem('emailVerified', 'true');
            
            // If we have a token in the response, use it to log in
            if (response.data.token) {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('userId', response.data.user.id);
              localStorage.setItem('userEmail', response.data.user.email);
              localStorage.setItem('username', response.data.user.username);
              localStorage.setItem('solanaAddress', response.data.user.solana_address || '');
            }
          } catch (loginError) {
            console.error('Auto-login error:', loginError);
            // If auto-login fails, we'll just redirect to the login page
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setMessage(error.response?.data?.error || 'An error occurred during verification.');
      }
    };
    
    verifyEmail();
  }, [location]);

  const handleRedirect = () => {
    // If verification was successful and we have a token, go to account page
    if (verificationStatus === 'success' && localStorage.getItem('token')) {
      navigate('/account');
    } else {
      // Otherwise go to login
      navigate('/login');
    }
  };

  const handleResendVerification = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);
    setResendMessage('');
    
    try {
      const params = new URLSearchParams(location.search);
      const email = params.get('email');
      
      if (!email) {
        setResendMessage('Email address is missing. Please go back to login.');
        setResendLoading(false);
        return;
      }
      
      await api.post('api/auth/resend-verification', { email });
      setResendMessage('Verification email has been resent! Please check your inbox.');
      
      // Set a 60-second countdown before allowing another resend
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error resending verification:', error);
      setResendMessage(error.response?.data?.error || 'Failed to resend verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <h2>Email Verification</h2>
        
        {verificationStatus === 'verifying' && (
          <div className="verifying">
            <div className="spinner"></div>
            <p>{message}</p>
          </div>
        )}
        
        {verificationStatus === 'success' && (
          <div className="success">
            <div className="success-icon">✓</div>
            <p>{message}</p>
            <button onClick={handleRedirect} className="redirect-button">
              {localStorage.getItem('token') ? 'Go to Account' : 'Go to Login'}
            </button>
          </div>
        )}
        
        {verificationStatus === 'error' && (
          <div className="error">
            <div className="error-icon">✗</div>
            <p>{message}</p>
            
            <div className="verification-actions">
              <button 
                onClick={handleResendVerification} 
                disabled={resendLoading || countdown > 0}
                className="resend-button"
              >
                {resendLoading ? 'Sending...' : 
                 countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
              </button>
              
              <button onClick={() => navigate('/login')} className="login-button">
                Return to Login
              </button>
            </div>
            
            {resendMessage && <p className="resend-message">{resendMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
