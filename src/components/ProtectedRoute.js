import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// This component protects routes that require both authentication and email verification
const ProtectedRoute = ({ children, requireVerification = true }) => {
  const { isAuthenticated, isEmailVerified, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireVerification && !isEmailVerified) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default ProtectedRoute;