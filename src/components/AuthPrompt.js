import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AuthPrompt.css';

const AuthPrompt = () => {
  const { isAuthenticated, isEmailVerified } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return (
      <div className="auth-prompt">
        <div className="auth-prompt-content">
          <h2>Login Required</h2>
          <p>Please log in or create an account to access this feature.</p>
          <Link to="/login" className="auth-prompt-button">
            Sign In / Create Account
          </Link>
        </div>
      </div>
    );
  }
  
  if (!isEmailVerified) {
    return (
      <div className="auth-prompt">
        <div className="auth-prompt-content">
          <h2>Email Verification Required</h2>
          <p>Please verify your email to access this feature.</p>
          <p className="auth-prompt-info">
            Check your inbox for a verification link or request a new one from the login page.
          </p>
          <Link to="/login" className="auth-prompt-button">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  
  return null;
};

export default AuthPrompt;
