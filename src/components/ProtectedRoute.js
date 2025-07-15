import React, { useState, useEffect, useRef } from 'react';
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const hasNavigatedRef = useRef(false);
  
  // Pages that should be accessible even without completed onboarding
  const skipOnboardingPaths = ['/onboarding', '/account', '/verify-email', '/verification-required', '/update-email'];
  
  // Reset onboarding status when navigating to onboarding page
  // This ensures we don't get stuck in a loop
  useEffect(() => {
    if (location.pathname === '/onboarding') {
      setOnboardingCompleted(null);
      setRetryCount(0);
      hasNavigatedRef.current = false;
    }
  }, [location.pathname]);
  
  // Force refresh onboarding status when coming from onboarding with welcome state
  useEffect(() => {
    if ((location.state?.showWelcome || location.state?.onboardingJustCompleted) && !forceRefresh) {
      setOnboardingCompleted(null);
      setForceRefresh(true);
      setRetryCount(0);
      
      // Clear the navigation state to prevent issues - but do it without causing a re-render flash
      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [location.state, forceRefresh, navigate, location.pathname]);
  
  // Check onboarding status for authenticated users
  useEffect(() => {
    const checkOnboarding = async () => {
      if (isAuthenticated && isEmailVerified && !checkingOnboarding && (onboardingCompleted === null || forceRefresh)) {
        setCheckingOnboarding(true);
        try {
          const status = await checkOnboardingStatus();
          
          if (status && status.onboarding_completed !== undefined) {
            setOnboardingCompleted(status.onboarding_completed);
            if (forceRefresh) {
              setForceRefresh(false);
            }
            setRetryCount(0);
            setIsInitialLoad(false);
          } else {
            console.warn('Invalid onboarding status response:', status);
            
            // If we're forcing a refresh and got an invalid response, retry up to 3 times
            if (forceRefresh && retryCount < 3) {
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
              setIsInitialLoad(false);
            }
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          
          // If we're forcing a refresh and got an error, retry up to 3 times
          if (forceRefresh && retryCount < 3) {
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
            setIsInitialLoad(false);
          }
        } finally {
          setCheckingOnboarding(false);
        }
      }
    };

    checkOnboarding();
  }, [isAuthenticated, isEmailVerified, checkOnboardingStatus, checkingOnboarding, onboardingCompleted, forceRefresh, retryCount]);
  
  // Consolidate all loading states to prevent flashing
  const isLoading = loading || !initialized || checkingOnboarding || (isAuthenticated && isEmailVerified && onboardingCompleted === null);
  
  // Show loading while checking authentication or onboarding
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{loading || !initialized ? 'Loading...' : 'Checking setup...'}</p>
      </div>
    );
  }
  
  // Show auth prompt if not authenticated
  if (!isAuthenticated) {
    return <AuthPrompt />;
  }
  
  // Redirect to verification if email not verified
  if (!isEmailVerified) {
    if (!hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      navigate('/verification-required', { replace: true });
    }
    return null;
  }
  
  // Redirect to onboarding if not completed (unless on allowed paths)
  if (!onboardingCompleted && !skipOnboardingPaths.includes(location.pathname)) {
    if (!hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      navigate('/onboarding', { replace: true });
    }
    return null;
  }
  
  // All checks passed, render the protected content
  return children;
};

export default ProtectedRoute;