import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaQuestion, FaBook, FaBrain, FaChevronRight } from 'react-icons/fa';
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

    const handleSignUp = () => {
        navigate('/login');
    };

    const handleExploreLearn = () => {
        navigate('/learn');
    };
    
    const handleViewPricing = () => {
        navigate('/pricing');
    };

    return (
        <div className="home-container">
            {/* Hero Section - Simplified */}
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
                    <h1>Welcome to Trading Tutor</h1>
                    <p className="hero-tagline">
                        Your personal guide to mastering trading concepts and strategies
                    </p>
                    <div className="home-buttons">
                        {!isAuthenticated && (
                            <button className="sign-up-button" onClick={handleSignUp}>
                                Get Started <FaChevronRight className="button-icon" />
                            </button>
                        )}
                        <button className="explore-button" onClick={handleViewPricing}>
                            View Pricing Plans <FaChevronRight className="button-icon" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Learning Path Section */}
            <div className="learning-path-section">
                <h2>Your Trading Journey Starts Here</h2>
                <div className="path-steps">
                    <div className="path-step">
                        <div className="step-number">1</div>
                        <div className="step-icon"><FaBook /></div>
                        <h3>Learn the Fundamentals</h3>
                        <p>Master essential trading concepts through our comprehensive library of resources.</p>
                    </div>
                    <div className="path-step">
                        <div className="step-number">2</div>
                        <div className="step-icon"><FaQuestion /></div>
                        <h3>Test Your Knowledge</h3>
                        <p>Reinforce your understanding with interactive quizzes tailored to your skill level.</p>
                    </div>
                    <div className="path-step">
                        <div className="step-number">3</div>
                        <div className="step-icon"><FaBrain /></div>
                        <h3>Harness the Power of AI</h3>
                        <p>Get personalized feedback on your trading strategies from our AI assistant.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <div className="cta-content">
                    <h2>Ready to Take Your Trading to the Next Level?</h2>
                    <p>Join thousands of traders who are improving their skills with Trading Tutor</p>
                    <div className="cta-buttons">
                        {!isAuthenticated ? (
                            <>
                                <button onClick={handleSignUp} className="primary-button">
                                    Create Free Account
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={handleExploreLearn} className="primary-button">
                                    Continue Learning
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
