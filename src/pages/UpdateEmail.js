import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';
import './VerifyEmail.css'; // Reuse the same styles as VerifyEmail

function UpdateEmail() {
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmailUpdate = async () => {
      try {
        // Get token and email from URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const email = params.get('email');

        if (!token || !email) {
          setMessage('Invalid verification link. Missing token or email.');
          setSuccess(false);
          setVerifying(false);
          return;
        }

        // Call API to verify email update
        const response = await api.get(`/api/auth/verify-email-update?token=${token}&email=${email}`);
        
        if (response.data.success) {
          setMessage(response.data.message || 'Your email has been updated successfully!');
          setSuccess(true);
        } else {
          setMessage(response.data.error || 'Failed to update email.');
          setSuccess(false);
        }
      } catch (error) {
        console.error('Email update verification error:', error);
        const errorMessage = error.response?.data?.error || 'An error occurred during email verification.';
        setMessage(errorMessage);
        setSuccess(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyEmailUpdate();
  }, [location.search]);

  const handleContinue = () => {
    navigate('/login');
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <h1>Email Update</h1>
        
        {verifying ? (
          <div className="verifying">
            <div className="loading-spinner"></div>
            <p>Verifying your new email address...</p>
          </div>
        ) : (
          <div className={`verification-result ${success ? 'success' : 'error'}`}>
            <div className={`icon ${success ? 'success-icon' : 'error-icon'}`}>
              {success ? '✓' : '✗'}
            </div>
            <p>{message}</p>
            
            <button 
              className="action-button" 
              onClick={handleContinue}
            >
              {success ? 'Continue to Login' : 'Back to Account'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateEmail;
