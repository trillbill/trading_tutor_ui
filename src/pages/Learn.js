import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChartDisplay from '../components/ChartDisplay';
import './Learn.css';
import terminologyData from '../terminologyData';
import heroImage from '../assets/btc-price-phone1.png'; // Import the hero image

// Import your icons
import toolsIcon from '../assets/tools-icon.png'; // Adjust the path as necessary
import chartsIcon from '../assets/charts-icon.png'; // Adjust the path as necessary
import theoryIcon from '../assets/theory-icon.png'; // Adjust the path as necessary

const Learn = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTerm, setSelectedTerm] = useState(null);
    const navigate = useNavigate();

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('userId') !== null;

    // Define topics and their associated categories
    const topics = {
        Charts: { icon: chartsIcon, terms: ['Charts'] },
        Tools: { icon: toolsIcon, terms: ['Tools'] },
        Theory: { icon: theoryIcon, terms: ['Theory'] }, // No concepts associated with Theory for now
    };

    // Set the default selected topic to the first item in the topics array
    const defaultTopic = Object.keys(topics)[0];
    const [selectedTopic, setSelectedTopic] = useState(defaultTopic);

    // Filtered terms based on the selected topic
    const filteredTerms = terminologyData
        .filter(term => {
            if (!selectedTopic) return true; // Show all if no topic is selected
            return topics[selectedTopic].terms.includes(term.category);
        })
        .filter(term => term.name.toLowerCase().includes(searchTerm.toLowerCase())); // Search filter

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
            <div className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="overlay"></div>
                <div className="hero-content"> {/* New div for content */}
                    <h2>Welcome to Trading Tutor</h2>
                    <p>
                        Trading Tutor is your go-to platform for mastering trading concepts and strategies. 
                        Our website offers a variety of features designed to enhance your trading skills, including:
                    </p>
                    <ul>
                        <li><strong>AI Analysis:</strong> Get insights on your trades and charts with our advanced AI analysis tools.</li>
                        <li><strong>Learning:</strong> Learn the fundamentals of trading and technical analysis with our extensive library of content.</li>
                        <li><strong>Quizzes:</strong> Test your knowledge and reinforce your learning with interactive quizzes.</li>
                    </ul>
                    <p>
                        Whether you're a beginner or an experienced trader, Trading Tutor provides the resources you need to succeed in the trading world.
                    </p>
                    {/* Conditionally render the sign-up button */}
                    {!isLoggedIn && (
                        <button className="sign-up-button" onClick={handleSignUp}>Sign Up</button>
                    )}
                </div>
            </div>

            {/* Grid of Topics */}
            <div className="topic-grid">
                {Object.keys(topics).map(topic => (
                    <div
                        key={topic}
                        className={`topic-card ${selectedTopic === topic ? 'selected' : ''}`}
                        onClick={() => setSelectedTopic(topic)}
                    >
                        <img src={topics[topic].icon} alt={`${topic} icon`} className="topic-icon" />
                        <h3 className="topic-name">{topic}</h3>
                    </div>
                ))}
            </div>

            {/* Search Bar and Filtered Terminology List */}
            {selectedTopic && (
                <div>
                    <div className="search-filter">
                        <input
                            type="text"
                            placeholder="Search terms..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="learn-list">
                        {filteredTerms.map((term, index) => (
                            <div className="term-card" key={index} onClick={() => handleCardClick(term)}>
                                <h3>{term.name}</h3>
                                <ChartDisplay chartType={term.chartType} data={term.data} lineColor={term.lineColor} />
                                <p>{term.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedTerm && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>{selectedTerm.name}</h2>
                        <ChartDisplay chartType={selectedTerm.chartType} data={selectedTerm.data} lineColor={selectedTerm.lineColor} />
                        <p>{selectedTerm.value}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Learn;