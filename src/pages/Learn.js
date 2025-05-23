import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaTimes, FaSearch, FaChevronRight, FaRobot, FaChevronDown, FaLock, FaClock, FaVideo, FaCheckCircle, FaCheck, FaChevronUp } from 'react-icons/fa';
import ChartDisplay from '../components/ChartDisplay';
import AIChatModal from '../components/AIChatModal';
import { useAuth } from '../context/AuthContext';
import './Learn.css';
import terminologyData from '../terminologyData';
import coursesData from '../coursesData';
import heroImage from '../assets/man-trading3.png';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import api from '../api/api';
import QuizComponent from '../components/QuizComponent';

const Learn = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showAIChatModal, setShowAIChatModal] = useState(false);
    const [selectedTermForAI, setSelectedTermForAI] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [activeVideoModule, setActiveVideoModule] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [showAllTerms, setShowAllTerms] = useState(false);
    const [userProgress, setUserProgress] = useState({
        concept: [],
        course: [],
        module: []
    });


    const dropdownRef = useRef(null);
    const progressFetchedRef = useRef(false);
    
    // Add navigate for redirection
    const navigate = useNavigate();

    // Update the useEffect to use the ref
    useEffect(() => {
        if (user && !progressFetchedRef.current) {
            fetchUserProgress();
            progressFetchedRef.current = true;
        }
    }, [user]);

    // Reset the ref when user changes
    useEffect(() => {
        return () => {
            progressFetchedRef.current = false;
        };
    }, []);
    
    // Update the fetchUserProgress function with a guard
    const fetchUserProgress = async () => {
        // Add a guard to prevent duplicate calls
        if (progressFetchedRef.current) {
            return;
        }
        
        try {
            const response = await api.get('/api/progress/user');
            
            if (response.data.success) {
                // Initialize with empty arrays if any property is missing
                const progress = {
                    concept: response.data.progress.concept || [],
                    course: response.data.progress.course || [],
                    module: response.data.progress.module || []
                };
                
                setUserProgress(progress);
            }
        } catch (error) {
            console.error('Error fetching user progress:', error);
        }
    };
    
    // Update the handleModuleComplete function to update local state first
    const handleModuleComplete = async (moduleId) => {
        // Convert moduleId to number to ensure consistent comparison
        const numericModuleId = Number(moduleId);
        
        // Check if the module is already marked as completed
        if (userProgress.module && userProgress.module.includes(numericModuleId)) {
            return; // Already completed, no need to update
        }
        
        try {
            // Update local state immediately for a responsive UI
            setUserProgress(prev => ({
                ...prev,
                module: [...(prev.module || []), numericModuleId]
            }));
            
            // Then update the server
            const response = await api.post('/api/progress/mark-completed', {
                itemType: 'module',
                itemId: moduleId
            });
            
            if (!response.data.success) {
                console.error('Failed to mark module as completed on server');
                // Optionally revert the local state change if server update fails
            }
        } catch (error) {
            console.error('Error marking module as completed:', error);
            // Optionally revert the local state change if there's an error
        }
    };
    
    // Add this function to handle video click
    const handleVideoClick = (e, module) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveVideoModule(module);
    };
    
    // Add this function to close the video modal
    const handleCloseVideo = () => {
        setActiveVideoModule(null);
    };

    useEffect(() => {
        // Preload the hero image
        const img = new Image();
        img.src = heroImage;
        img.onload = () => setImageLoaded(true);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Define topics and their associated categories
    const topics = {
        All: {
            terms: ['Charts', 'Theory', 'Tools'],
        },
        Charts: { 
            terms: ['Charts'],
        },
        Theory: { 
            terms: ['Theory'],
        },
        Tools: { 
            terms: ['Tools'],
        },
    };

    // Filtered terms based on the selected topic
    const filteredTerms = terminologyData
        .filter(term => {
            if (selectedTopic === 'All') return true;
            return topics[selectedTopic].terms.includes(term.category);
        })
        .filter(term => term.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleCardClick = (term) => {
        setSelectedTerm(term);
    };

    const handleCloseModal = () => {
        setSelectedTerm(null);
    };

    const handleAskAITutor = (term, e) => {
        e.stopPropagation(); // Prevent the card click event
        
        if (!user) {
            // Show login prompt
            alert("Please log in to use the AI Tutor feature.");
            return;
        }
        
        setSelectedTermForAI(term);
        setShowAIChatModal(true);
    };
    
    const handleCloseAIChatModal = () => {
        setShowAIChatModal(false);
        setSelectedTermForAI(null);
    };

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
        setIsDropdownOpen(false);
    };
    
    // Course handlers
    const handleCourseClick = (course) => {
        setSelectedCourse(course);
    };
    
    const handleCloseCourseModal = () => {
        setSelectedCourse(null);
    };

    // Calculate total duration for a course
    const calculateCourseDuration = (course) => {
        let totalMinutes = 0;
        course.modules.forEach(module => {
            const durationMatch = module.duration.match(/(\d+)/);
            if (durationMatch) {
                totalMinutes += parseInt(durationMatch[0]);
            }
        });
        
        if (totalMinutes >= 60) {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`;
        } else {
            return `${totalMinutes} min`;
        }
    };

    // Function to handle premium content click
    const handlePremiumContentClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate('/login'); // Redirect to login page
    };

    // Add this function to check if a course is completed
    const isCourseCompleted = (course) => {
        if (!userProgress.course || !course) return false;
        return userProgress.course.includes(course.id);
    };

    // Add this function to calculate how many modules are completed in a course
    const getCompletedModulesCount = (course) => {
        if (!userProgress.module || !course) return 0;
        return course.modules.filter(module => 
            userProgress.module.includes(module.id)
        ).length;
    };

    // Similarly update the markTermAsLearned function
    const markTermAsLearned = async (termId) => {
        // Check if already learned
        if (isTermLearned(termId)) {
            return; // Already learned, no need to update
        }
        
        try {
            // Update local state immediately
            setUserProgress(prev => ({
                ...prev,
                concept: [...(prev.concept || []), termId.toString()]
            }));
            
            // Then update the server
            const response = await api.post('/api/progress/mark-completed', {
                itemType: 'concept',
                itemId: termId
            });
            
            if (!response.data.success) {
                console.error('Failed to mark term as learned on server');
                // Optionally revert the local state change
            }
        } catch (error) {
            console.error('Error marking term as learned:', error);
            // Optionally revert the local state change
        }
    };

    // Add a function to check if a term is already learned
    const isTermLearned = (termId) => {
        return userProgress.concept && userProgress.concept.includes(termId.toString());
    };
    
    return (
        <div className="learn-container">
            <div className="learn-hero-section" style={{ backgroundImage: `url(${heroImage})`, opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                <div className="learn-hero-overlay"></div>
                <div className="learn-hero-content">
                    <h2>Learn the Fundamentals</h2>
                    <p>
                        Explore a range of topics to build your trading knowledge.
                    </p>
                </div>
            </div>

            {/* Courses Section */}
            <div className="courses-section">
                <h2 className="section-title">Courses</h2>
                <p className="quiz-section-description">
                    Discover our comprehensive courses designed to help you get started.
                </p>
                <div className="courses-grid">
                    {coursesData.map((course) => (
                        <div 
                            key={course.id} 
                            className={`course-card ${course.premium && !user ? 'locked' : ''} ${isCourseCompleted(course) ? 'completed' : ''}`}
                            onClick={() => handleCourseClick(course)}
                        >
                            <div className="course-thumbnail">
                                <img src={course.thumbnail} alt={course.title} />
                                {course.premium && !user && (
                                    <div className="course-lock">
                                        <FaLock />
                                    </div>
                                )}
                                {isCourseCompleted(course) && (
                                    <div className="course-completed-badge">
                                        <FaCheckCircle />
                                    </div>
                                )}
                            </div>
                            <div className="course-content">
                                <h3>
                                    {course.title}
                                    {isCourseCompleted(course) && (
                                        <span className="course-completed-indicator">
                                            <FaCheckCircle />
                                        </span>
                                    )}
                                </h3>
                                <p>{course.description}</p>
                                <div className="course-meta">
                                    <span><FaClock /> {calculateCourseDuration(course)}</span>
                                    <span><FaVideo /> {course.modules.length} lessons</span>
                                    {getCompletedModulesCount(course) > 0 && (
                                        <span className="course-progress">
                                            {getCompletedModulesCount(course)}/{course.modules.length} completed
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Terminology Section */}
            <div className="content-section">
                <h2 className="section-title">Concepts</h2>
                <p className="quiz-section-description">
                    Explore the charts patterns, tools and theories that are used in trading.
                </p>
                <div className="section-header">
                    <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search terminology..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            className="search-input"
                        />
                    </div>
                    <div className="filter-dropdown" ref={dropdownRef}>
                        <button 
                            className="dropdown-button" 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {selectedTopic} <FaChevronDown className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                {Object.keys(topics).map(topic => (
                                    <button
                                        key={topic}
                                        className={`dropdown-item ${selectedTopic === topic ? 'active' : ''}`}
                                        onClick={() => handleTopicSelect(topic)}
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                
                {filteredTerms.length > 0 ? (
                    <div className="learn-list">
                        {filteredTerms.slice(0, showAllTerms ? filteredTerms.length : 4).map((term, index) => {
                            const isLearned = isTermLearned(term.id);
                            
                            return (
                                <div 
                                    className={`term-card ${isLearned ? 'learned' : ''}`} 
                                    key={index} 
                                    onClick={() => handleCardClick(term)}
                                >
                                    <div className="term-header">
                                        {!term.longName ? <h3>{term.name}</h3> : <h4>{term.name}</h4>}
                                        <div className="term-header-actions">
                                            {user && (
                                                <button 
                                                    className="ask-ai-button" 
                                                    onClick={(e) => handleAskAITutor(term, e)}
                                                    title="Ask AI Tutor about this term"
                                                >
                                                    <FaRobot />
                                                </button>
                                            )}
                                        </div>
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
                            );
                        })}
                        
                        {filteredTerms.length > 4 && (
                            <div className="expand-list-container">
                                <button 
                                    className="expand-list-button"
                                    onClick={() => setShowAllTerms(!showAllTerms)}
                                >
                                    {showAllTerms ? (
                                        <>
                                            <span>Show Less</span>
                                            <FaChevronUp className="expand-icon" />
                                        </>
                                    ) : (
                                        <>
                                            <span>Show More</span>
                                            <FaChevronDown className="expand-icon" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
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
            
            <QuizComponent />

            {/* Course Modal */}
            {selectedCourse && (
                <div className="modal course-modal" onClick={handleCloseCourseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-button" onClick={handleCloseCourseModal}>
                            <FaTimes />
                        </button>
                        
                        <div className="course-modal-header">
                            <h2>{selectedCourse.title}</h2>
                        </div>
                        
                        <div className="course-modal-info">
                            <div className="course-thumbnail-large">
                                <img src={selectedCourse.thumbnail} alt={selectedCourse.title} />
                            </div>
                            
                            <div className="course-details">
                                <p className="course-full-description">{selectedCourse.fullDescription}</p>
                                
                                <div className="course-meta-info">
                                    <span><FaClock /> {calculateCourseDuration(selectedCourse)}</span>
                                    <span><FaVideo /> {selectedCourse.modules.length} lessons</span>
                                    <span>Level: {selectedCourse.level}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="course-modules">
                            <h3>Course Content</h3>
                            {selectedCourse.modules.map((module, index) => {
                                const isModuleCompleted = userProgress.module && 
                                    (userProgress.module.includes(Number(module.id)) || 
                                     userProgress.module.includes(String(module.id)));
                                
                                return (
                                    <div 
                                        key={index} 
                                        className={`course-module ${isModuleCompleted ? 'completed' : ''}`}
                                    >
                                        <div className="module-container">
                                            <div className="module-info">
                                                <div className="module-header">
                                                    <h4>
                                                        {module.title}
                                                        {isModuleCompleted && (
                                                            <span className="module-completed-indicator">
                                                                <FaCheckCircle />
                                                            </span>
                                                        )}
                                                    </h4>
                                                </div>
                                                <p>{module.description}</p>
                                            </div>
                                            
                                            {/* Video thumbnail with play button or lock */}
                                            {module.thumbnailUrl && module.videoUrl && (
                                                <div className="module-video-container">
                                                    <div className={`module-thumbnail ${selectedCourse.premium && !user ? 'locked' : ''}`}>
                                                        <img src={module.thumbnailUrl} alt={`${module.title} thumbnail`} />
                                                        
                                                        {selectedCourse.premium && !user ? (
                                                            // Lock icon for unauthenticated users
                                                            <div 
                                                                className="module-lock-overlay"
                                                                onClick={handlePremiumContentClick}
                                                            >
                                                                <FaLock className="module-lock-icon" />
                                                            </div>
                                                        ) : (
                                                            // Play button for authenticated users
                                                            <button 
                                                                className="module-play-button"
                                                                onClick={(e) => handleVideoClick(e, module)}
                                                            >
                                                                <FaPlay />
                                                            </button>
                                                        )}
                                                        
                                                        {/* Add duration overlay */}
                                                        <div className="module-duration-overlay">
                                                            <FaClock /> {module.duration}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {selectedCourse.premium && !user && (
                            <div className="premium-content-message">
                                <p>This is premium content. Please log in or subscribe to access all lessons.</p>
                                <button 
                                    className="action-button"
                                    onClick={() => {
                                        handleCloseCourseModal();
                                        navigate('/login');
                                    }}
                                >
                                    Sign In Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Term Modal */}
            {selectedTerm && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-button" onClick={handleCloseModal}>
                            <FaTimes />
                        </button>
                        
                        <div className="modal-header">
                            <h2>{selectedTerm.name}</h2>
                            {selectedTerm.longName && <h3>{selectedTerm.longName}</h3>}
                        </div>
                        
                        <div className="modal-body">
                            {selectedTerm.video ? (
                                <div className="video-container">
                                    <iframe
                                        src={selectedTerm.video}
                                        title={selectedTerm.name}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="chart-container-large">
                                    <ChartDisplay chartType={selectedTerm.chartType} data={selectedTerm.data} lineColor={selectedTerm.lineColor} />
                                </div>
                            )}
                            
                            <div className="term-description-full">
                                <p>{selectedTerm.fullDescription || selectedTerm.shortDescription}</p>
                                
                                {selectedTerm.examples && (
                                    <div className="term-examples">
                                        <h4>Examples:</h4>
                                        <ul>
                                            {selectedTerm.examples.map((example, index) => (
                                                <li key={index}>{example}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {selectedTerm.tips && (
                                    <div className="term-tips">
                                        <h4>Trading Tips:</h4>
                                        <ul>
                                            {selectedTerm.tips.map((tip, index) => (
                                                <li key={index}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            {user ? (
                                <button 
                                    className={`learn-button ${isTermLearned(selectedTerm.id) ? 'learned' : ''}`}
                                    onClick={() => markTermAsLearned(selectedTerm.id)}
                                    disabled={isTermLearned(selectedTerm.id)}
                                >
                                    {isTermLearned(selectedTerm.id) ? (
                                        <>
                                            <FaCheckCircle /> Learned
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck /> Mark as Learned
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button 
                                    className="learn-button login-prompt"
                                    onClick={() => navigate('/login')}
                                >
                                    <FaLock /> Log in to track progress
                                </button>
                            )}
                            
                            {user && (
                                <button 
                                    className="learn-button" 
                                    onClick={(e) => handleAskAITutor(selectedTerm, e)}
                                >
                                    <FaRobot /> Ask AI Tutor
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Chat Modal */}
            {showAIChatModal && selectedTermForAI && (
                <AIChatModal 
                    isOpen={showAIChatModal}
                    onClose={handleCloseAIChatModal}
                    initialTerm={selectedTermForAI.name}
                    initialDescription={selectedTermForAI.longDescription || selectedTermForAI.shortDescription}
                    initialMessage={`Explain this trading term: ${selectedTermForAI.name}`}
                />
            )}

            {/*Video Player Modal */}
            {activeVideoModule && (
                <div className="modal" onClick={handleCloseVideo}>
                    <div className="modal-content video-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-button" onClick={handleCloseVideo}>
                            <FaTimes />
                        </button>
                        
                        <div className="video-modal-header">
                            <h2>{activeVideoModule.title}</h2>
                        </div>
                        
                        <VideoPlayer 
                            videoUrl={activeVideoModule.videoUrl}
                            moduleId={activeVideoModule.id}
                            courseId={selectedCourse?.id}
                            onComplete={handleModuleComplete}
                        />
                        
                        <div className="video-description">
                            <p>{activeVideoModule.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Learn;