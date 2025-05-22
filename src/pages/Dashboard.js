import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { FaSignOutAlt, FaEnvelope, FaLightbulb, FaRobot, FaChartLine, FaBook, FaArrowRight, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import TradingJournal from '../components/TradingJournal';
import AIChatModal from '../components/AIChatModal';
import tips from '../dashboardTips';
import chatPrompts from '../chatPrompts';
import UserPerformanceStats from '../components/UserPerformanceStats';

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
  const [showTip, setShowTip] = useState(true);
  
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
      setIsLoading(true);
      try {
        const response = await api.get('/api/account/profile');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Set default profile data structure
        setProfileData({
          profile: {
            performance: {
              skillLevel: 'beginner',
              total: 0,
              average: 0
            },
            quizResults: []
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch profile data and set a random tip
    fetchProfileData();
    getRandomTip();
    
    // Cleanup function that runs when component unmounts
    return () => {
      effectRan.current = true;
    };
  }, []); // Empty dependency array means this runs once on mount

  // Get a random tip from the local tips array
  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    const randomTip = tips[randomIndex];
    
    setTipOfTheDay({
      tip: randomTip.tip,
      category: randomTip.category,
      isLoading: false
    });
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
                <button className="tip-popup-refresh" onClick={getRandomTip}>
                  Get Another Tip
                </button>
              </div>
            </div>
          )}
          
          {/* User Performance Stats */}
          <UserPerformanceStats profileData={profileData} />
          
          {/* Trading Journal Card */}
          <div className="dashboard-card journal-card">
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