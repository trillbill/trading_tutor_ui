import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './VerificationRequired.css';

const VerificationRequired = () => {
  const { user, isEmailVerified, checkEmailVerification, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Check verification status when component mounts
    const verifyStatus = async () => {
      const verified = await checkEmailVerification();
      if (verified) {
        navigate('/dashboard');
      }
    };
    
    verifyStatus();
    
    // Set up interval to check verification status every 30 seconds
    const interval = setInterval(verifyStatus, 30000);
    
    return () => clearInterval(interval);
  }, [checkEmailVerification, navigate]);

  const handleResendVerification = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setMessage('');
    
    try {
      // Use the user email from context instead of localStorage
      if (!user?.email) {
        setMessage('User information not found. Please try logging in again.');
        setLoading(false);
        return;
      }
      
      await api.post('api/auth/resend-verification', { email: user.email });
      setMessage('Verification email has been sent! Please check your inbox.');
      
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
      setMessage(error.response?.data?.error || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-required-container">
      <div className="verification-required-card">
        <h1>Email Verification Required</h1>
        
        <div className="verification-icon">
          <i className="fas fa-envelope-open-text"></i>
        </div>
        
        <p className="verification-message">
          We've sent a verification email to <strong>{user?.email}</strong>.
          Please check your inbox and click the verification link to gain full access to Trading Tutor.
        </p>
        
        <div className="verification-actions">
          <button 
            onClick={handleResendVerification} 
            disabled={loading || countdown > 0}
            className="resend-button"
          >
            {loading ? 'Sending...' : 
             countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
          </button>
          
          <button onClick={logout} className="logout-button">
            Logout
          </button>
        </div>
        
        {message && <p className="verification-status-message">{message}</p>}
        
        <div className="verification-help">
          <p>
            Can't find the email? Check your spam folder or contact support at{' '}
            <a href="mailto:tradingtutorhelp@gmail.com">tradingtutorhelp@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationRequired;
