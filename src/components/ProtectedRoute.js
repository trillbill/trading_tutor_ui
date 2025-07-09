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
  const [forceRefresh, setForceRefresh] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Pages that should be accessible even without completed onboarding
  const skipOnboardingPaths = ['/onboarding', '/account', '/verify-email', '/verification-required', '/update-email'];
  
  // Reset onboarding status when navigating to onboarding page
  // This ensures we don't get stuck in a loop
  useEffect(() => {
    if (location.pathname === '/onboarding') {
      setOnboardingCompleted(null);
      setRetryCount(0);
    }
  }, [location.pathname]);
  
  // Force refresh onboarding status when coming from onboarding with welcome state
  useEffect(() => {
    if ((location.state?.showWelcome || location.state?.onboardingJustCompleted) && !forceRefresh) {
      console.log('Detected onboarding completion, forcing onboarding status refresh...');
      setOnboardingCompleted(null);
      setForceRefresh(true);
      setRetryCount(0);
      
      // Clear the navigation state to prevent issues
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, forceRefresh, navigate, location.pathname]);
  
  // Check onboarding status for authenticated users
  useEffect(() => {
    const checkOnboarding = async () => {
      if (isAuthenticated && isEmailVerified && !checkingOnboarding && (onboardingCompleted === null || forceRefresh)) {
        setCheckingOnboarding(true);
        try {
          console.log('Checking onboarding status...', forceRefresh ? '(forced refresh)' : '', `(attempt ${retryCount + 1})`);
          const status = await checkOnboardingStatus();
          console.log('Onboarding status result:', status);
          
          if (status && status.onboarding_completed !== undefined) {
            setOnboardingCompleted(status.onboarding_completed);
            if (forceRefresh) {
              setForceRefresh(false);
            }
            setRetryCount(0);
          } else {
            console.warn('Invalid onboarding status response:', status);
            
            // If we're forcing a refresh and got an invalid response, retry up to 3 times
            if (forceRefresh && retryCount < 3) {
              console.log(`Retrying onboarding status check (${retryCount + 1}/3)...`);
              setRetryCount(prev => prev + 1);
              // Retry after a short delay
              setTimeout(() => {
                setCheckingOnboarding(false);
              }, 1000);
              return;
            } else {
              setOnboardingCompleted(false);
              if (forceRefresh) {
                setForceRefresh(false);
              }
            }
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          
          // If we're forcing a refresh and got an error, retry up to 3 times
          if (forceRefresh && retryCount < 3) {
            console.log(`Retrying onboarding status check after error (${retryCount + 1}/3)...`);
            setRetryCount(prev => prev + 1);
            // Retry after a short delay
            setTimeout(() => {
              setCheckingOnboarding(false);
            }, 1000);
            return;
          } else {
            setOnboardingCompleted(false);
            if (forceRefresh) {
              setForceRefresh(false);
            }
          }
        } finally {
          setCheckingOnboarding(false);
        }
      }
    };

    checkOnboarding();
  }, [isAuthenticated, isEmailVerified, checkOnboardingStatus, checkingOnboarding, onboardingCompleted, forceRefresh, retryCount]);
  
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
    console.log('Redirecting to onboarding - status:', onboardingCompleted);
    navigate('/onboarding', { replace: true });
    return null;
  }
  
  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;