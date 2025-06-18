import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/api';
import './Dashboard.css';
import { FaLightbulb, FaTimes } from 'react-icons/fa';
import TradingJournal from '../components/TradingJournal';
import AIChatModal from '../components/AIChatModal';
import tips from '../dashboardTips';
import UserPerformanceStats from '../components/UserPerformanceStats';

function Dashboard() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [journalStats, setJournalStats] = useState({
    total: 0,
    profitable: 0,
    unprofitable: 0,
    winRate: 0,
    totalProfit: 0,
  });
  
  // AI Chat Modal state
  const [showChatModal, setShowChatModal] = useState(false);
  
  // Tip of the day state
  const [tipOfTheDay, setTipOfTheDay] = useState({
    tip: '',
    category: '',
    isLoading: true
  });
  const [showTip, setShowTip] = useState(true);

  // Memoize the onStatsUpdate callback to prevent it from changing on every render
  const handleStatsUpdate = useCallback((stats) => {
    setJournalStats(stats);
  }, []); // Empty dependency array means this function won't change between renders

  // Fetch user profile data on component mount
  useEffect(() => {
    if (hasInitialized) return;
    
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/account/profile');
        setProfileData(response.data);
      } catch (error) {
        setError('Error fetching profile data');
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
        setHasInitialized(true);
      }
    };

    // Fetch profile data and set a random tip
    fetchProfileData();
    getRandomTip();
  }, [hasInitialized]); // Only depend on hasInitialized

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
        <div className="loading-spinner" />
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
          
          <TradingJournal 
            onStatsUpdate={handleStatsUpdate} 
          />
          
          {/* AI Chat Modal */}
          <AIChatModal
            isOpen={showChatModal}
            onClose={closeChatModal}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;