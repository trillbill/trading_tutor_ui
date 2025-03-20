import React, { useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
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

import accountIcon from './assets/account-icon.png';
import learnIcon from './assets/learn-icon.png';
import quizIcon from './assets/quiz-icon.png';
import chatIcon from './assets/chat-icon.png';

const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function AppRoutes() {
  const { isAuthenticated, isEmailVerified } = useContext(AuthContext);
  
  return (
    <Routes>
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={
        <AuthRoute>
          <Login />
        </AuthRoute>
      } />
      <Route path="/verification-required" element={
        isAuthenticated && !isEmailVerified ? 
        <VerificationRequired /> : 
        <Navigate to={isAuthenticated ? "/" : "/login"} />
      } />
      <Route path="/" element={<Learn />} />
      <Route path="/account" element={
        <ProtectedRoute>
          <Account />
        </ProtectedRoute>
      } />
      <Route path="/quiz" element={
        <ProtectedRoute>
          <Quiz />
        </ProtectedRoute>
      } />
      <Route path="/chartanalysis" element={
        <ProtectedRoute>
          <ChatWindow />
        </ProtectedRoute>
      } />
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
                        <Link to="/" className="nav-item">Learn</Link>
                        <Link to="/quiz" className="nav-item">Quiz</Link>
                        <Link to="/chartanalysis" className="nav-item">Chat</Link>
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
                        <Link to="/" className="hamburger-item" onClick={toggleMenu}><img src={learnIcon} className="hamburger-icon" alt="Learn" />Learn</Link>
                        <Link to="/quiz" className="hamburger-item" onClick={toggleMenu}><img src={quizIcon} className="hamburger-icon" alt="Quiz" />Quiz</Link>
                        <Link to="/chartanalysis" className="hamburger-item" onClick={toggleMenu}><img src={chatIcon} className="hamburger-icon" alt="Chat" />Chat</Link>
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
