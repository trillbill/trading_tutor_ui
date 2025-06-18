import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTradingProfile } from '../context/TradingProfileContext';
import AuthPrompt from './AuthPrompt';

// This component protects routes that require both authentication and email verification
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isEmailVerified, loading, initialized } = useAuth();
  const { checkOnboardingStatus } = useTradingProfile();
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pages that should be accessible even without completed onboarding
  const skipOnboardingPaths = ['/onboarding', '/account', '/verify-email', '/verification-required', '/update-email'];
  
  // Check onboarding status for authenticated users
  useEffect(() => {
    const checkOnboarding = async () => {
      if (isAuthenticated && isEmailVerified && !checkingOnboarding && onboardingCompleted === null) {
        setCheckingOnboarding(true);
        try {
          const status = await checkOnboardingStatus();
          setOnboardingCompleted(status.onboarding_completed);
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          setOnboardingCompleted(false);
        } finally {
          setCheckingOnboarding(false);
        }
      }
    };

    checkOnboarding();
  }, [isAuthenticated, isEmailVerified, checkOnboardingStatus, checkingOnboarding, onboardingCompleted]);
  
  // Show loading while checking authentication
  if (loading || !initialized) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  // Show auth prompt if not authenticated
  if (!isAuthenticated) {
    return <AuthPrompt />;
  }
  
  // Redirect to verification if email not verified
  if (!isEmailVerified) {
    navigate('/verification-required', { replace: true });
    return null;
  }
  
  // Show loading while checking onboarding
  if (checkingOnboarding || onboardingCompleted === null) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Checking setup...</p>
      </div>
    );
  }
  
  // Redirect to onboarding if not completed (unless on allowed paths)
  if (!onboardingCompleted && !skipOnboardingPaths.includes(location.pathname)) {
    navigate('/onboarding', { replace: true });
    return null;
  }
  
  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;