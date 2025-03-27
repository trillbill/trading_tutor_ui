import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthPrompt from './AuthPrompt';

// This component protects routes that require both authentication and email verification
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isEmailVerified, loading, initialized } = useAuth();
  
  // Show loading state while checking authentication
  if (loading || !initialized) {
    return <div className="loading-spinner" />;
  }
  
  // If not authenticated or email not verified, show the page with AuthPrompt overlay
  if (!isAuthenticated || !isEmailVerified) {
    return (
      <>
        {children}
        <AuthPrompt />
      </>
    );
  }
  
  // Render children if authenticated and verified
  return children;
};

export default ProtectedRoute;