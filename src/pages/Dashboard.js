import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { FaSignOutAlt, FaEnvelope, FaLightbulb, FaRobot, FaChartLine, FaBook, FaArrowRight, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import accountIcon from '../assets/account-icon-large.png';
import { useAuth } from '../context/AuthContext';
import TradingJournal from '../components/TradingJournal';
import AIChatModal from '../components/AIChatModal';
import tips from '../dashboardTips';
import chatPrompts from '../chatPrompts';

function Dashboard() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('journal');
  const [error, setError] = useState(null);
  const [journalStats, setJournalStats] = useState({
    total: 0,
    profitable: 0,
    unprofitable: 0,
    winRate: 0,
    totalProfit: 0,
  });
  
  // AI Chat Modal state
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatTerm, setChatTerm] = useState('');
  const [chatDescription, setChatDescription] = useState('');
  
  // Tip of the day state
  const [tipOfTheDay, setTipOfTheDay] = useState({
    tip: '',
    category: '',
    isLoading: true
  });
  const [showTip, setShowTip] = useState(false);
  
  // Quick chat input state
  const [quickChatInput, setQuickChatInput] = useState('');
  
  // Carousel state
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselIntervalRef = useRef(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  // Use a ref to track if the effect has run
  const effectRan = useRef(false);

  // Setup carousel rotation
  useEffect(() => {
    // Start the carousel rotation
    carouselIntervalRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentPromptIndex(prevIndex => 
          prevIndex === chatPrompts.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 3000); // Rotate every 3 seconds
    
    // Cleanup interval on component unmount
    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [isPaused, chatPrompts.length]);
  
  // Handle manual navigation of carousel
  const navigateCarousel = (direction) => {
    // Pause automatic rotation temporarily when manually navigating
    setIsPaused(true);
    
    if (direction === 'prev') {
      setCurrentPromptIndex(prevIndex => 
        prevIndex === 0 ? chatPrompts.length - 1 : prevIndex - 1
      );
    } else {
      setCurrentPromptIndex(prevIndex => 
        prevIndex === chatPrompts.length - 1 ? 0 : prevIndex + 1
      );
    }
    
    // Resume automatic rotation after a delay
    clearTimeout(carouselIntervalRef.current);
    carouselIntervalRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 5000); // Resume after 5 seconds of inactivity
  };

  // Memoize the onStatsUpdate callback to prevent it from changing on every render
  const handleStatsUpdate = useCallback((stats) => {
    setJournalStats(stats);
  }, []); // Empty dependency array means this function won't change between renders

  // Fetch user profile data on component mount
  useEffect(() => {
    // In development, React will run effects twice in strict mode
    // This check prevents the second run in development
    if (effectRan.current === true) {
      return;
    }
    
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/account/profile');
        if (response.data.success) {
          setProfileData(response.data.profile);
        } else {
          setError('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError(error.response?.data?.error || 'An error occurred while loading your profile');
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch both profile data and tip of the day simultaneously
    fetchProfileData();
    fetchTipOfTheDay();
    
    // Cleanup function that runs when component unmounts
    return () => {
      effectRan.current = true;
    };
  }, []); // Empty dependency array means this runs once on mount

  // Fetch tip of the day
  const fetchTipOfTheDay = async () => {
    try {
      // Simulate API delay - but make it shorter to reduce staggered appearance
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Select a random tip
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      
      setTipOfTheDay({
        tip: randomTip.tip,
        category: randomTip.category,
        isLoading: false
      });
      
      // Show the tip after a very short delay to ensure smooth rendering
      setTimeout(() => {
        setShowTip(true);
      }, 50);
    } catch (error) {
      console.error('Error fetching tip of the day:', error);
      setTipOfTheDay({
        tip: "Focus on consistent strategy rather than chasing quick profits.",
        category: "Trading Basics",
        isLoading: false
      });
      setShowTip(true);
    }
  };

  // Handle quick chat submit
  const handleQuickChatSubmit = (e) => {
    e.preventDefault();
    if (quickChatInput.trim()) {
      setChatTerm(quickChatInput);
      setChatDescription('');
      setShowChatModal(true);
      setQuickChatInput('');
    }
  };

  // Handle prompt click - use the current carousel prompt
  const handlePromptClick = () => {
    setChatTerm(chatPrompts[currentPromptIndex]);
    setChatDescription('');
    setShowChatModal(true);
  };

  // Close chat modal
  const closeChatModal = () => {
    setShowChatModal(false);
  };

  // Dismiss tip of the day
  const dismissTip = () => {
    setShowTip(false);
  };

  return (
    <div className="dashboard-container">
      {isLoading ? (
        <div className="loading-spinner">Loading your dashboard...</div>
      ) : error ? (
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button className="action-button primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Tip of the Day Popup */}
          {!tipOfTheDay.isLoading && showTip && (
            <div className="tip-popup">
              <div className="tip-popup-content">
                <div className="tip-popup-header">
                  <div className="tip-popup-icon">
                    <FaLightbulb />
                  </div>
                  <div className="tip-popup-category">{tipOfTheDay.category}</div>
                  <button className="tip-popup-close" onClick={dismissTip}>
                    <FaTimes />
                  </button>
                </div>
                <p className="tip-popup-text">{tipOfTheDay.tip}</p>
                <button className="tip-popup-refresh" onClick={fetchTipOfTheDay}>
                  Get Another Tip
                </button>
              </div>
            </div>
          )}
          
          {/* AI Tutor Card */}
          <div className="dashboard-card ai-chat-card">
            <h2 className="card-title">
              <FaRobot className="card-icon" /> AI Tutor
            </h2>
            <div className="quick-chat-container">
              <form onSubmit={handleQuickChatSubmit} className="quick-chat-form">
                <input
                  type="text"
                  value={quickChatInput}
                  onChange={(e) => setQuickChatInput(e.target.value)}
                  placeholder="Ask anything about trading..."
                  className="quick-chat-input"
                />
                <button 
                  type="submit" 
                  className="quick-chat-button"
                  disabled={!quickChatInput.trim()}
                >
                  <FaArrowRight />
                </button>
              </form>
              
              <div className="chat-prompts">
                <h3>Quick Prompts</h3>
                <div className="prompt-carousel">
                  <button 
                    className="carousel-nav prev"
                    onClick={() => navigateCarousel('prev')}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    <FaChevronLeft />
                  </button>
                  
                  <div 
                    className="prompt-slide"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    <button
                      className="prompt-button carousel-prompt"
                      onClick={handlePromptClick}
                    >
                      {chatPrompts[currentPromptIndex]}
                    </button>
                  </div>
                  
                  <button 
                    className="carousel-nav next"
                    onClick={() => navigateCarousel('next')}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    <FaChevronRight />
                  </button>
                </div>
                
                <div className="carousel-indicators">
                  {chatPrompts.map((_, index) => (
                    <span 
                      key={index} 
                      className={`carousel-dot ${index === currentPromptIndex ? 'active' : ''}`}
                      onClick={() => {
                        setCurrentPromptIndex(index);
                        setIsPaused(true);
                        clearTimeout(carouselIntervalRef.current);
                        carouselIntervalRef.current = setTimeout(() => {
                          setIsPaused(false);
                        }, 5000);
                      }}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Trading Journal Card */}
          <div className="dashboard-card journal-card">
            <h2 className="card-title">
              <FaBook className="card-icon" /> Trading Journal
            </h2>
            <TradingJournal 
              onStatsUpdate={handleStatsUpdate} 
            />
          </div>
          
          {/* AI Chat Modal */}
          <AIChatModal
            isOpen={showChatModal}
            onClose={closeChatModal}
            initialTerm={chatTerm}
            initialDescription={chatDescription}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;