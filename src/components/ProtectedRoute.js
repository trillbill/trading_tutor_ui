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
  
  // Check onboarding status when user is authenticated and verified
  useEffect(() => {
    const checkOnboardingStatusInternal = async () => {
      // Reset states when route changes
      setCheckingOnboarding(false);
      
      if (!isAuthenticated || !isEmailVerified) {
        setOnboardingCompleted(null);
        return;
      }
      
      // If on a page that should skip onboarding check, allow access without API call
      if (skipOnboardingPaths.includes(location.pathname)) {
        setOnboardingCompleted(true); // Set to true to bypass redirect logic for this page
        return;
      }
      
      // For pages that require onboarding check, reset state and check
      setOnboardingCompleted(null);
      setCheckingOnboarding(true);
      
      try {
        // Use the context method to avoid duplicate API calls
        const status = await checkOnboardingStatus();
        if (status && status.onboarding_completed !== undefined) {
          setOnboardingCompleted(status.onboarding_completed);
          
          // If onboarding not completed, redirect to onboarding
          if (!status.onboarding_completed) {
            navigate('/onboarding');
          }
        } else {
          // If we can't determine status, assume onboarding is needed
          setOnboardingCompleted(false);
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // If we can't check, assume onboarding is needed
        setOnboardingCompleted(false);
        navigate('/onboarding');
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkOnboardingStatusInternal();
  }, [isAuthenticated, isEmailVerified, navigate, location.pathname, checkOnboardingStatus]);
  
  // Show loading state while checking authentication or onboarding
  if (loading || !initialized || checkingOnboarding) {
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
  
  // If we're on a skip path, always allow access
  if (skipOnboardingPaths.includes(location.pathname)) {
    return children;
  }
  
  // For regular pages, only allow access if onboarding is completed
  if (onboardingCompleted === false) {
    return <div className="loading-spinner" />; // Will redirect via useEffect
  }
  
  // If onboarding status is still being determined, show loading
  if (onboardingCompleted === null) {
    return <div className="loading-spinner" />;
  }
  
  // Render children if all checks pass
  return children;
};

export default ProtectedRoute;