import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LogoHeader from './components/LogoHeader';
import Learn from './pages/Learn';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VerifyEmail from './pages/VerifyEmail';
import VerificationRequired from './pages/VerificationRequired';
import { AuthContext, AuthProvider, useAuth } from './context/AuthContext';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import RiskAppetiteQuiz from './pages/RiskAppetiteQuiz';
import UpdateEmail from './pages/UpdateEmail';
import Pricing from './pages/Pricing';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Account from './pages/Account';
import AIChatWidget from './components/AIChatWidget';
import chatPrompts from './chatPrompts';
import { AIChatProvider, useAIChat } from './context/AIChatContext';
import { CreditProvider } from './context/CreditContext';
import { TradingProfileProvider, useTradingProfile } from './context/TradingProfileContext';
import { CurrencyProvider } from './context/CurrencyContext';
import CreditDisplay from './components/CreditDisplay';
import OnboardingFlow from './pages/OnboardingFlow';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

import accountIcon from './assets/account-icon.png';
import learnIcon from './assets/learn-icon.png';
import homeIcon from './assets/home-icon.png';
import pricingIcon from './assets/pricing-icon.png';
import dashboardIcon from './assets/dashboard-icon.png';

// Public route component - redirects authenticated users to dashboard page
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div className="loading-spinner" />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Route transition wrapper to prevent flashing
const RouteTransitionWrapper = ({ children }) => {
  return (
    <div style={{ 
      minHeight: 'calc(100vh - 65px)', 
      backgroundColor: '#302e2e',
      position: 'relative'
    }}>
      {children}
    </div>
  );
};

// Create a new component to conditionally render the AIChatWidget
const ConditionalAIChatWidget = ({ chatPrompts }) => {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  const { isAIChatModalOpen } = useAIChat();
  
  // Only show on dashboard and learn pages, and when no modal is open
  const showOnPaths = ['/dashboard', '/learn'];
  const shouldShow = isAuthenticated && 
                   showOnPaths.includes(location.pathname) && 
                   !isAIChatModalOpen;
  
  return shouldShow ? <AIChatWidget chatPrompts={chatPrompts} /> : null;
};

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <RouteTransitionWrapper>
        <Routes>
          {/* Public routes */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/verification-required" element={<VerificationRequired />} />
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* <Route path="/pricing" element={<Pricing />} /> */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          
          {/* Protected routes */}
          <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/risk-quiz" element={<ProtectedRoute><RiskAppetiteQuiz /></ProtectedRoute>} />
          <Route path="/update-email" element={<ProtectedRoute><UpdateEmail /></ProtectedRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingFlow /></ProtectedRoute>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RouteTransitionWrapper>
    </>
  );
}

function AppContent() {
  const { loading, initialized, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Show loading while initializing
  if (loading || !initialized) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="app-layout">
      <header className="App-header">
        <div className="header-column logo-column">
          <nav>
            <Link to={isAuthenticated ? "/dashboard" : "/"}>                 
              <LogoHeader />
            </Link>
          </nav>
        </div>
        <div className="header-column nav-column">
          <nav className="nav-options">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-item">Dashboard</Link>
                <Link to="/learn" className="nav-item">Learn</Link>
                {/* <Link to="/pricing" className="nav-item">Pricing</Link> */}
              </>
            ) : (
              <>
                <Link to="/" className="nav-item">Home</Link>
                {/* <Link to="/pricing" className="nav-item">Pricing</Link> */}
              </>
            )}
          </nav>
        </div>
        <div className="header-column login-column">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditDisplay />
              <Link to="/account">
                <img src={accountIcon} className="account-icon" alt="Account" />
              </Link>
            </div>
          ) : (
            <Link to="/login" className="nav-item">Login</Link>
          )}
        </div>
        <button className="hamburger-button" onClick={toggleMenu}>
          &#9776;
        </button>
      </header>
      {isMenuOpen && (
        <div className="hamburger-menu">
          <nav className="nav-options">
            {isAuthenticated ? (
              <>
                <div className="hamburger-credit-section">
                  <CreditDisplay isMobile={true} />
                </div>
                <Link to="/dashboard" className="hamburger-item" onClick={toggleMenu}>
                  <img src={dashboardIcon} className="hamburger-icon" alt="Dashboard" />Dashboard
                </Link>
                <Link to="/learn" className="hamburger-item" onClick={toggleMenu}>
                  <img src={learnIcon} className="hamburger-icon" alt="Learn" />Learn
                </Link>
                {/* <Link to="/pricing" className="hamburger-item" onClick={toggleMenu}>
                  <img src={pricingIcon} className="hamburger-icon" alt="Pricing" />Pricing
                </Link> */}
                <Link to="/account" className="hamburger-item" onClick={toggleMenu}>
                  <img src={accountIcon} className="hamburger-icon" alt="Account" />Account
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="hamburger-item" onClick={toggleMenu}>
                  <img src={homeIcon} className="hamburger-icon" alt="Home" />Home
                </Link>
                {/* <Link to="/pricing" className="hamburger-item" onClick={toggleMenu}>
                  <img src={pricingIcon} className="hamburger-icon" alt="Pricing" />Pricing
                </Link> */}
                <Link to="/login" className="hamburger-item" onClick={toggleMenu}>
                  <img src={accountIcon} className="hamburger-icon" alt="Login" />Login
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
      <div className="content" onClick={() => setIsMenuOpen(false)}>
        <AppRoutes />
      </div>
      
      <Footer />
      <CookieConsent />
      
      {/* Use the conditional widget component instead of the direct component */}
      <ConditionalAIChatWidget chatPrompts={chatPrompts} />
    </div>
  );
}

function App() {
  return <AppContent />;
}

const AppWithAuth = () => (
  <BrowserRouter>
    <AuthProvider>
      <AIChatProvider>
        <CreditProvider>
          <TradingProfileProvider>
            <CurrencyProvider>
              <App />
            </CurrencyProvider>
          </TradingProfileProvider>
        </CreditProvider>
      </AIChatProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default AppWithAuth;
