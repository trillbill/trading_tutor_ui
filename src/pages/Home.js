import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaChevronRight, FaJournalWhills, FaTachometerAlt, FaRobot, FaQuestionCircle, FaVideo, FaStar } from 'react-icons/fa';
import './Home.css';
import heroImage from '../assets/candlestick-chart1.png';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Preload the hero image
        const img = new Image();
        img.src = heroImage;
        img.onload = () => setImageLoaded(true);
    }, []);

    const handleExploreDashboard = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="home-container">
            {/* Hero Section - Updated with single button */}
            <div 
                className="hero-section" 
                style={{ 
                    backgroundImage: `url(${heroImage})`, 
                    opacity: imageLoaded ? 1 : 0, 
                    transition: 'opacity 0.5s ease' 
                }}
            >
                <div className="overlay"></div>
                <div className="hero-content">
                    <h1>Track, Analyze, and Improve Your Trading</h1>
                    <p className="hero-tagline">
                        The complete trading platform with journal, analytics, AI insights, and learning resources
                    </p>
                    <div className="home-buttons">
                        <button className="explore-button" onClick={handleExploreDashboard}>
                            {isAuthenticated ? 'Go to Dashboard' : 'Explore Dashboard'} <FaChevronRight className="button-icon" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Core Features Section */}
            <div className="home-features-section">
                <h2>Everything You Need to Master Trading</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon-container">
                            <FaJournalWhills className="feature-card-icon" />
                        </div>
                        <h3>Trading Journal</h3>
                        <p>Log every trade with detailed entries, track your P&L, and visualize your performance with interactive charts.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-container">
                            <FaTachometerAlt className="feature-card-icon" />
                        </div>
                        <h3>Dashboard</h3>
                        <p>Get real-time insights into your trading performance, win rates, and progress towards your skill level goals.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon-container">
                            <FaRobot className="feature-card-icon" />
                        </div>
                        <h3>AI Trading Assistant</h3>
                        <p>Discuss your trades with our AI tutor, get personalized feedback, and analyze your charts for expert technical analysis insights.</p>
                    </div>
                </div>
            </div>

            {/* Learning Resources Section - New */}
            <div className="learning-path-section">
                <h2>Comprehensive Learning Resources</h2>
                <div className="path-steps">
                    <div className="path-step">
                        <div className="step-icon"><FaVideo /></div>
                        <h3>Video Courses</h3>
                        <p>Learn from structured video courses covering everything from basics to advanced trading strategies and market analysis.</p>
                    </div>
                    <div className="path-step">
                        <div className="step-icon"><FaChartLine /></div>
                        <h3>Interactive Charts</h3>
                        <p>Explore trading concepts with interactive charts and visual examples that make complex topics easy to understand.</p>
                    </div>
                    <div className="path-step">
                        <div className="step-icon"><FaQuestionCircle /></div>
                        <h3>Quizzes</h3>
                        <p>Test your understanding with quizzes and track your progress as you advance through different skill levels.</p>
                    </div>
                    <div className="path-step">
                        <div className="step-icon"><FaRobot /></div>
                        <h3>AI Assistant</h3>
                        <p>Get instant answers to your questions and personalized explanations from our AI tutor while you learn.</p>
                    </div>
                </div>
            </div>

            {/* Reviews Section - New */}
            <div className="reviews-section">
                <h2>What Our Traders Say</h2>
                <div className="reviews-grid">
                    <div className="review-card">
                        <div className="review-stars">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <p className="review-text">
                            "This platform completely transformed how I approach trading. The journal helped me identify my mistakes and the AI insights are incredibly valuable."
                        </p>
                        <div className="review-author">
                            <strong>Sarah M.</strong>
                            <span>Day Trader</span>
                        </div>
                    </div>
                    <div className="review-card">
                        <div className="review-stars">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <p className="review-text">
                            "I really found the AI tutor to be helpful. It was able to help me develop a personalized trading stragegy with defined rules and risk management."
                        </p>
                        <div className="review-author">
                            <strong>Mike R.</strong>
                            <span>Swing Trader</span>
                        </div>
                    </div>
                    <div className="review-card">
                        <div className="review-stars">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <p className="review-text">
                            "I watch the videos over and over again to make sure I understand the concepts and when I have a question, the AI tutor is there to help me."
                        </p>
                        <div className="review-author">
                            <strong>Alex T.</strong>
                            <span>Crypto Trader</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Transform Your Trading?</h2>
                    <div className="cta-buttons">
                        <button onClick={handleExploreDashboard} className="primary-button">
                            {isAuthenticated ? 'Go to Your Dashboard' : 'Get Started Today'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
