import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LogoHeader from './components/LogoHeader';
import Learn from './pages/Learn';
import Quiz from './pages/Quiz';
import ChatWindow from './pages/ChatWindow';
import Login from './pages/Login';
import Account from './pages/Account';
import VerifyEmail from './pages/VerifyEmail';
import VerificationRequired from './pages/VerificationRequired';
import { AuthContext, AuthProvider } from './context/AuthContext';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import RiskAppetiteQuiz from './pages/RiskAppetiteQuiz';
import UpdateEmail from './pages/UpdateEmail';
import Pricing from './pages/Pricing';
import CookieConsent from './components/CookieConsent';
import Footer from './components/Footer';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';

import accountIcon from './assets/account-icon.png';
import learnIcon from './assets/learn-icon.png';
import quizIcon from './assets/quiz-icon.png';
import chatIcon from './assets/chat-icon.png';
import homeIcon from './assets/home-icon.png';
import pricingIcon from './assets/pricing-icon.png';

const AuthRoute = ({ children }) => {
  const { loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return children;
};

function AppRoutes() {
  
  return (
    <Routes>
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verification-required" element={
        <AuthRoute>
          <VerificationRequired />
        </AuthRoute>
      } />
      <Route path="/" element={<Home />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatWindow /></ProtectedRoute>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/risk-quiz" element={<ProtectedRoute><RiskAppetiteQuiz /></ProtectedRoute>} />
      <Route path="/update-email" element={<UpdateEmail />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="app-layout">
            <header className="App-header">
                <div className="header-column logo-column">
                    <nav>
                        <Link to="/">                 
                            <LogoHeader />
                        </Link>
                    </nav>
                </div>
                <div className="header-column nav-column">
                    <nav className="nav-options">
                        <Link to="/learn" className="nav-item">Learn</Link>
                        <Link to="/quiz" className="nav-item">Quiz</Link>
                        <Link to="/chat" className="nav-item">Chat</Link>
                        <Link to="/pricing" className="nav-item">Pricing</Link>
                    </nav>
                </div>
                <div className="header-column login-column">
                    {isAuthenticated ? (
                        <Link to="/account"><img src={accountIcon} className="account-icon" alt="Account" /></Link>
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
                        <Link to="/" className="hamburger-item" onClick={toggleMenu}><img src={homeIcon} className="hamburger-icon" alt="Home" />Home</Link>
                        <Link to="/learn" className="hamburger-item" onClick={toggleMenu}><img src={learnIcon} className="hamburger-icon" alt="Learn" />Learn</Link>
                        <Link to="/quiz" className="hamburger-item" onClick={toggleMenu}><img src={quizIcon} className="hamburger-icon" alt="Quiz" />Quiz</Link>
                        <Link to="/chat" className="hamburger-item" onClick={toggleMenu}><img src={chatIcon} className="hamburger-icon" alt="Chat" />Chat</Link>
                        <Link to="/pricing" className="hamburger-item" onClick={toggleMenu}><img src={pricingIcon} className="hamburger-icon" alt="Pricing" />Pricing</Link>
                        {isAuthenticated ? (
                            <Link to="/account" className="hamburger-item" onClick={toggleMenu}><img src={accountIcon} className="hamburger-icon" alt="Account" />Account</Link>
                        ) : (
                            <Link to="/login" className="hamburger-item" onClick={toggleMenu}><img src={accountIcon} className="hamburger-icon" alt="Login" />Login</Link>
                        )}
                    </nav>
                </div>
            )}
            <div className="content" onClick={() => setIsMenuOpen(false)}>
                <AppRoutes />
            </div>
            
            <Footer />
            <CookieConsent />
        </div>
    );
};

const AppWithAuth = () => (
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
);

export default AppWithAuth;
