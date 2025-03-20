import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { FaLock, FaArrowRight } from 'react-icons/fa';
import './ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null);
  const [resetComplete, setResetComplete] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const verifyToken = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const email = params.get('email');
      
      if (!token || !email) {
        setTokenValid(false);
        setMessage('Invalid reset link. Please request a new password reset.');
        return;
      }
      
      try {
        await api.get(`api/auth/verify-reset-token?token=${token}&email=${email}`);
        setTokenValid(true);
      } catch (error) {
        console.error('Token verification error:', error);
        setTokenValid(false);
        setMessage(error.response?.data?.error || 'Invalid or expired reset link. Please request a new password reset.');
      }
    };
    
    verifyToken();
  }, [location]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setLoading(false);
      return;
    }
    
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }
    
    try {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const email = params.get('email');
      
      const response = await api.post('api/auth/reset-password', {
        token,
        email,
        password
      });
      
      setMessage(response.data.message || 'Password has been reset successfully!');
      setResetComplete(true);
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage(error.response?.data?.error || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Reset Your Password</h2>
        
        {tokenValid === null && (
          <div className="verifying">
            <div className="spinner"></div>
            <p>Verifying your reset link...</p>
          </div>
        )}
        
        {tokenValid === false && (
          <div className="invalid-token">
            <div className="error-icon">✗</div>
            <p>{message}</p>
            <button onClick={() => navigate('/login')} className="redirect-button">
              Return to Login
            </button>
          </div>
        )}
        
        {tokenValid === true && !resetComplete && (
          <>
            <p className="reset-instructions">
              Please enter your new password below.
            </p>
            
            {message && <div className="reset-message error">{message}</div>}
            
            <form onSubmit={handleSubmit} className="reset-form">
              <div className="form-group">
                <label htmlFor="password">
                  <FaLock className="input-icon" />
                  <span>New Password</span>
                </label>
                <input 
                  type="password" 
                  id="password"
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  required 
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <FaLock className="input-icon" />
                  <span>Confirm Password</span>
                </label>
                <input 
                  type="password" 
                  id="confirmPassword"
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)}
                  required 
                  placeholder="Confirm new password"
                />
              </div>
              
              <button 
                type="submit" 
                className="reset-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <div className="button-spinner"></div>
                ) : (
                  <>
                    Reset Password
                    <FaArrowRight className="button-icon" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
        
        {resetComplete && (
          <div className="reset-success">
            <div className="success-icon">✓</div>
            <p>{message}</p>
            <button onClick={() => navigate('/login')} className="redirect-button">
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
