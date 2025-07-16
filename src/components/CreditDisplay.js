import React, { useState, useEffect, useRef } from 'react';
import { FaCoins, FaComments, FaJournalWhills, FaImage, FaVideo, FaQuestionCircle } from 'react-icons/fa';
import { useCredit } from '../context/CreditContext';
import './CreditDisplay.css';

const CreditDisplay = ({ showTooltip = true, isMobile = false }) => {
  const { creditBalance, loading } = useCredit();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isActuallyMobile, setIsActuallyMobile] = useState(false);
  const containerRef = useRef(null);

  const creditCosts = [
    { icon: <FaComments />, feature: 'AI Chat Message', cost: 1, description: 'Ask AI questions about trading' },
    { icon: <FaJournalWhills />, feature: 'Trade Journal Entry', cost: 2, description: 'Log a trade in your journal' },
    { icon: <FaImage />, feature: 'AI Image Analysis', cost: 10, description: 'Upload chart images for AI analysis' },
  ];

  // Auto-detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsActuallyMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use either the passed prop or auto-detected mobile state
  const effectiveIsMobile = isMobile || isActuallyMobile;

  // Handle clicking outside to close tooltip on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (effectiveIsMobile && containerRef.current && !containerRef.current.contains(event.target)) {
        setIsTooltipVisible(false);
      }
    };

    if (isTooltipVisible && effectiveIsMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTooltipVisible, effectiveIsMobile]);

  const handleMouseEnter = () => {
    if (showTooltip && !effectiveIsMobile) {
      setIsTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (showTooltip && !effectiveIsMobile) {
      setIsTooltipVisible(false);
    }
  };

  const handleClick = (e) => {
    if (showTooltip && effectiveIsMobile) {
      e.preventDefault();
      setIsTooltipVisible(!isTooltipVisible);
    }
  };

  if (loading || !creditBalance) {
    return null;
  }

  return (
    <div className="header-credit-display" ref={containerRef}>
      <div 
        className={`credit-container ${showTooltip ? 'hoverable' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <span className="credit-count">
          {creditBalance.current}/{creditBalance.daily_limit}
        </span>
        <span className="credit-label">Credits</span>
        
        {/* Tooltip */}
        {showTooltip && isTooltipVisible && (
          <div className={`credit-cost-tooltip ${effectiveIsMobile ? 'mobile' : 'desktop'}`}>
            <div className="tooltip-header">
              <FaCoins className="header-icon" />
              <h3>Credit Costs</h3>
            </div>
            
            <div className="tooltip-content">
              {creditCosts.map((item, index) => (
                <div key={index} className="cost-item">
                  <div className="cost-icon">{item.icon}</div>
                  <div className="cost-details">
                    <div className="cost-feature">{item.feature}</div>
                    <div className="cost-description">{item.description}</div>
                  </div>
                  <div className="cost-amount">
                    <FaCoins className="coin-icon" />
                    <span>{item.cost}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="tooltip-footer">
              <small>Credits reset daily at midnight</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditDisplay;
