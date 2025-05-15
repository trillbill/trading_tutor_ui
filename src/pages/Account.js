import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/utils';
import { FaSignOutAlt, FaEnvelope } from 'react-icons/fa';
import accountIcon from '../assets/account-icon-large.png';
import './Account.css';

function Account() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add state for email update modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailUpdateMessage, setEmailUpdateMessage] = useState('');
  const [emailUpdateError, setEmailUpdateError] = useState('');
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get('/api/account/profile');
        if (response.data.success) {
          setProfileData(response.data.profile);
        } else {
          setError('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError(error.response?.data?.error || 'An error occurred while loading your profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle email update
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    
    if (!newEmail) {
      setEmailUpdateError('Please enter a new email address');
      return;
    }

    const emailValidation = validateEmail(newEmail);
    if (!emailValidation.isValid) {
      setEmailUpdateError(emailValidation.message);
      return;
    }
    
    try {
      setEmailUpdateLoading(true);
      setEmailUpdateError('');
      setEmailUpdateMessage('');
      
      const response = await api.post('/api/auth/request-email-update', { newEmail });
      
      if (response.data.success) {
        setEmailUpdateMessage(response.data.message);
        setNewEmail('');
        // Keep the modal open to show the success message
      } else {
        setEmailUpdateError(response.data.error || 'Failed to request email update');
      }
    } catch (error) {
      console.error('Email update error:', error);
      setEmailUpdateError(
        error.response?.data?.error || 'An error occurred while requesting email update'
      );
    } finally {
      setEmailUpdateLoading(false);
    }
  };

  // Close modal and reset state
  const closeEmailModal = () => {
    setShowEmailModal(false);
    setNewEmail('');
    setEmailUpdateMessage('');
    setEmailUpdateError('');
  };

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Extract user data for easier access
  const user = profileData?.user || {};
  const username = user.username || 'Guest';
  const userEmail = user.email || 'No email available';

  return (
    <div className="account-container">
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <div className="account-card">
            <div className="account-profile">
              <img src={accountIcon} alt="Profile" className="profile-avatar" />
              <h2 className="profile-name">{username}</h2>
              <p className="profile-email">{userEmail}</p>
              
              <div className="profile-actions">
                <button 
                  className="action-button primary" 
                  onClick={() => setShowEmailModal(true)}
                >
                  <FaEnvelope /> Update Email
                </button>
                <button 
                  className="action-button secondary" 
                  onClick={handleSignOut}
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </div>
          </div>
          
          {/* Email Update Modal */}
          {showEmailModal && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h2>Update Email Address</h2>
                  <button className="modal-close" onClick={closeEmailModal}>×</button>
                </div>
                <div className="modal-body">
                  {emailUpdateMessage ? (
                    <div className="success-message">
                      <p>{emailUpdateMessage}</p>
                      <button 
                        className="action-button primary"
                        onClick={closeEmailModal}
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleEmailUpdate}>
                      <div className="form-group">
                        <label>Current Email</label>
                        <p className="current-email">{userEmail}</p>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="newEmail">New Email Address</label>
                        <input
                          type="email"
                          id="newEmail"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter your new email address"
                          required
                        />
                      </div>
                      
                      {emailUpdateError && (
                        <div className="error-message">{emailUpdateError}</div>
                      )}
                      
                      <div className="modal-actions">
                        <button 
                          type="button" 
                          className="action-button secondary"
                          onClick={closeEmailModal}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="action-button primary"
                          disabled={emailUpdateLoading}
                        >
                          {emailUpdateLoading ? 'Sending...' : 'Send Verification Email'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Account;
