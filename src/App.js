import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LogoHeader from './components/LogoHeader';
import Learn from './pages/Learn';
import Quiz from './pages/Quiz';
import ChatWindow from './pages/ChatWindow';
import Login from './pages/Login';

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Router>
            <div className="app-layout">
                <header className="header">
                    <div className="header-column logo-column">
                        <LogoHeader />
                    </div>
                    <div className="header-column nav-column">
                        <nav className="nav-options">
                            <Link to="/" className="nav-item">Learn</Link>
                            <Link to="/quiz" className="nav-item">Quiz</Link>
                            <Link to="/chartanalysis" className="nav-item">Chat</Link>
                        </nav>
                    </div>
                    <div className="header-column login-column">
                        <Link to="/login" className="nav-item">Login</Link>
                    </div>
                    <button className="hamburger-button" onClick={toggleMenu}>
                        &#9776;
                    </button>
                </header>
                {isMenuOpen && (
                    <div className="hamburger-menu">
                        <nav className="nav-options">
                            <Link to="/" className="nav-item" onClick={toggleMenu}>Learn</Link>
                            <Link to="/quiz" className="nav-item" onClick={toggleMenu}>Quiz</Link>
                            <Link to="/chartanalysis" className="nav-item" onClick={toggleMenu}>Chat</Link>
                            <Link to="/login" className="nav-item" onClick={toggleMenu}>Login</Link>
                        </nav>
                    </div>
                )}
                <div className="content">
                    <Routes>
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/chartanalysis" element={<ChatWindow />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Learn />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
