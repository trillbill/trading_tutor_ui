import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LogoHeader from './components/LogoHeader';
import Learn from './pages/Learn';
import Quiz from './pages/Quiz';
import ChatWindow from './pages/ChatWindow';
import Login from './pages/Login';
import Account from './pages/Account';

import accountIcon from './assets/account-icon.png';
import learnIcon from './assets/learn-icon.png';
import quizIcon from './assets/quiz-icon.png';
import chatIcon from './assets/chat-icon.png';

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Router>
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
                            <Link to="/account"><img src={accountIcon} className="account-icon"></img></Link>
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
                            <Link to="/" className="hamburger-item" onClick={toggleMenu}><img src={learnIcon} className="hamburger-icon"></img>Learn</Link>
                            <Link to="/quiz" className="hamburger-item" onClick={toggleMenu}><img src={quizIcon} className="hamburger-icon"></img>Quiz</Link>
                            <Link to="/chartanalysis" className="hamburger-item" onClick={toggleMenu}><img src={chatIcon} className="hamburger-icon"></img>Chat</Link>
                            {isAuthenticated ? (
                                <Link to="/account" className="hamburger-item" onClick={toggleMenu}><img src={accountIcon} className="hamburger-icon"></img>Account</Link>
                            ) : (
                                <Link to="/login" className="hamburger-item" onClick={toggleMenu}><img src={accountIcon} className="hamburger-icon"></img>Login</Link>
                            )}
                        </nav>
                    </div>
                )}
                <div className="content" onClick={() => setIsMenuOpen(false)}>
                    <Routes>
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/chartanalysis" element={<ChatWindow />} />
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/account" element={<Account setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/" element={<Learn />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
