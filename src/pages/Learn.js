import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaTimes, FaSearch, FaChartLine, FaBook, FaTools, FaChevronRight } from 'react-icons/fa';
import ChartDisplay from '../components/ChartDisplay';
import './Learn.css';
import terminologyData from '../terminologyData';
import heroImage from '../assets/btc-price-phone1.png';

// Import your icons
import toolsIcon from '../assets/tools-icon.png';
import chartsIcon from '../assets/charts-icon.png';
import theoryIcon from '../assets/theory-icon.png';

const Learn = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Preload the hero image
        const img = new Image();
        img.src = heroImage;
        img.onload = () => setImageLoaded(true);
    }, []);

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('userId') !== null;

    // Define topics and their associated categories
    const topics = {
        Charts: { 
            icon: chartsIcon, 
            terms: ['Charts'],
            description: 'Learn to read and interpret different chart patterns and indicators'
        },
        Theory: { 
            icon: theoryIcon, 
            terms: ['Theory'],
            description: 'Understand the fundamental concepts behind trading strategies'
        },
        Tools: { 
            icon: toolsIcon, 
            terms: ['Tools'],
            description: 'Master the essential tools used by successful traders'
        },
    };

    // Set the default selected topic to the first item in the topics array
    const defaultTopic = Object.keys(topics)[0];
    const [selectedTopic, setSelectedTopic] = useState(defaultTopic);

    // Filtered terms based on the selected topic
    const filteredTerms = terminologyData
        .filter(term => {
            if (!selectedTopic) return true;
            return topics[selectedTopic].terms.includes(term.category);
        })
        .filter(term => term.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCardClick = (term) => {
        setSelectedTerm(term);
    };

    const handleCloseModal = () => {
        setSelectedTerm(null);
    };

    const handleSignUp = () => {
        navigate('/login');
    };

    return (
        <div className="learn-container">
            {/* Hero Section */}
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
                    <h2>Welcome to Trading Tutor</h2>
                    <p>
                        Your personal guide to mastering trading concepts and strategies.
                    </p>
                    <div className="hero-features">
                        <div className="feature-item">
                            <FaChartLine className="feature-icon" />
                            <div className="feature-text">
                                <h3>AI Analysis</h3>
                                <p>Get insights on your trades with advanced AI tools</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FaBook className="feature-icon" />
                            <div className="feature-text">
                                <h3>Learning Library</h3>
                                <p>Extensive resources for all skill levels</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FaTools className="feature-icon" />
                            <div className="feature-text">
                                <h3>Interactive Quizzes</h3>
                                <p>Test your knowledge and track progress</p>
                            </div>
                        </div>
                    </div>
                    {!isLoggedIn && (
                        <button className="sign-up-button" onClick={handleSignUp}>
                            Get Started <FaChevronRight className="button-icon" />
                        </button>
                    )}
                </div>
            </div>

            {/* Learning Categories Section */}
            <div className="learning-categories-section">
                
                {/* Topic Grid */}
                <div className="topic-grid">
                    {Object.keys(topics).map(topic => (
                        <div
                            key={topic}
                            className={`topic-card ${selectedTopic === topic ? 'selected' : ''}`}
                            onClick={() => setSelectedTopic(topic)}
                        >
                            <img src={topics[topic].icon} alt={`${topic} icon`} className="topic-icon" />
                            <h3 className="topic-name">{topic}</h3>
                            <p className="topic-description">{topics[topic].description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Section */}
            {selectedTopic && (
                <div className="content-section">
                    <div className="section-header">
                        <h2 className="section-title">{selectedTopic} Resources</h2>
                        <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder={`Search ${selectedTopic.toLowerCase()}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className="search-input"
                            />
                        </div>
                    </div>
                    
                    {filteredTerms.length > 0 ? (
                        <div className="learn-list">
                            {filteredTerms.map((term, index) => (
                                <div className="term-card" key={index} onClick={() => handleCardClick(term)}>
                                    <div className="term-header">
                                        {!term.longName ? <h3>{term.name}</h3> : <h4>{term.name}</h4>}
                                        <span className="term-category">{term.category}</span>
                                    </div>
                                    {term.video ? (
                                        <div className="thumbnail-container">
                                            <img
                                                src={term.thumbnail}
                                                alt={`${term.name} thumbnail`}
                                                className="thumbnail"
                                            />
                                            <div className="play-button"><FaPlay /></div>
                                        </div>
                                    ) : (
                                        <div className="chart-container">
                                            <ChartDisplay chartType={term.chartType} data={term.data} lineColor={term.lineColor} />
                                        </div>
                                    )}
                                    <p className="term-description">{term.shortDescription}</p>
                                    <button className="learn-more-button">
                                        Learn More <FaChevronRight className="button-icon" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <p>No resources found for "{searchTerm}" in {selectedTopic}.</p>
                            <button className="clear-search" onClick={() => setSearchTerm('')}>
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {selectedTerm && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close" onClick={handleCloseModal}>
                            <FaTimes />
                        </button>
                        <div className="modal-header">
                            <h2>{selectedTerm.name}</h2>
                            <span className="modal-category">{selectedTerm.category}</span>
                        </div>
                        {selectedTerm.video ? (
                            <div className="video-container">
                                <iframe
                                    width="100%"
                                    height="400"
                                    src={selectedTerm.video}
                                    title={selectedTerm.name}
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="modal-chart">
                                <ChartDisplay chartType={selectedTerm.chartType} data={selectedTerm.data} lineColor={selectedTerm.lineColor} />
                            </div>
                        )}
                        <div className="modal-description">
                            <p>{selectedTerm.value}</p>
                        </div>
                        {isLoggedIn && (
                            <div className="modal-actions">
                                <button className="action-button" onClick={() => navigate('/quiz')}>
                                    Take a Quiz on This Topic
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Learn;