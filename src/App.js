import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Terminology from './pages/Terminology';
import Quiz from './pages/Quiz';
import ChartAnalysis from './pages/ChartAnalysis';

function App() {
    const [menuActive, setMenuActive] = useState(false); // State to manage menu visibility

    const toggleMenu = () => {
        setMenuActive(!menuActive); // Toggle menu visibility
    };

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <div className="hamburger-menu" onClick={toggleMenu}>
                        <div style={{ width: '30px', height: '3px', backgroundColor: 'white', margin: '5px' }} />
                        <div style={{ width: '30px', height: '3px', backgroundColor: 'white', margin: '5px' }} />
                        <div style={{ width: '30px', height: '3px', backgroundColor: 'white', margin: '5px' }} />
                    </div>
                    <h1 style={{ textAlign: 'center', flex: 1 }}>TradingTutor</h1>
                </header>
                <div className={`menu ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
                    <div onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside the modal */}
                        <Link to="/" className="menu-item" onClick={toggleMenu}>Terminology</Link>
                        <Link to="/quiz" className="menu-item" onClick={toggleMenu}>Quiz</Link>
                        <Link to="/chartanalysis" className="menu-item" onClick={toggleMenu}>Chart Analysis</Link>
                    </div>
                </div>
                <div className="page-content">
                    <Routes>
                        <Route path="/" element={<Terminology />} />
                        <Route path="/quiz" element={<Quiz />} />
                        <Route path="/chartanalysis" element={<ChartAnalysis />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
