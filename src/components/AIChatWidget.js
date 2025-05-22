import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaChevronLeft, FaChevronRight, FaArrowRight, FaMinus, FaPlus, FaTimes } from 'react-icons/fa';
import AIChatModal from './AIChatModal';
import './AIChatWidget.css';

const AIChatWidget = ({ chatPrompts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [quickChatInput, setQuickChatInput] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatTerm, setChatTerm] = useState('');
  const [chatDescription, setChatDescription] = useState('');
  const [showThoughtBubble, setShowThoughtBubble] = useState(true);
  
  const carouselIntervalRef = useRef(null);
  
  // Setup carousel rotation
  useEffect(() => {
    if (!isOpen || isMinimized) return;
    
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
  }, [isPaused, chatPrompts.length, isOpen, isMinimized]);
  
  // Hide thought bubble when widget is open
  useEffect(() => {
    if (isOpen) {
      setShowThoughtBubble(false);
    } else {
      // Show thought bubble with delay when widget is closed
      const timeout = setTimeout(() => {
        setShowThoughtBubble(true);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);
  
  // Auto-hide thought bubble after 10 seconds
  useEffect(() => {
    if (showThoughtBubble) {
      const timeout = setTimeout(() => {
        setShowThoughtBubble(false);
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [showThoughtBubble]);
  
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
  
  // Toggle widget open/closed
  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };
  
  // Toggle minimized state
  const toggleMinimized = (e) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };
  
  // Close widget
  const closeWidget = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };
  
  return (
    <>
      <div className={`ai-chat-widget ${isOpen ? 'open' : ''} ${isMinimized ? 'minimized' : ''}`}>
        {/* Widget Button - only show when widget is closed */}
        {!isOpen && (
          <>
            <div className="widget-button" onClick={toggleWidget}>
              <FaRobot />
            </div>
            
            {/* Simple Thought Bubble */}
            {showThoughtBubble && (
              <div className="thought-bubble">
                <p>Chat with your AI tutor!</p>
                <div className="thought-bubble-arrow"></div>
              </div>
            )}
          </>
        )}
        
        {/* Widget Content */}
        <div className="widget-content">
          <div className="widget-header" onClick={() => setIsMinimized(false)}>
            <div className="widget-title">
              <FaRobot /> AI Tutor
            </div>
            <div className="widget-controls">
              <button className="widget-control-button" onClick={toggleMinimized}>
                {isMinimized ? <FaPlus /> : <FaMinus />}
              </button>
              <button className="widget-control-button" onClick={closeWidget}>
                <FaTimes />
              </button>
            </div>
          </div>
          
          {!isMinimized && (
            <div className="widget-body">
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
                <h4>Quick Prompts</h4>
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
          )}
        </div>
      </div>
      
      {/* AI Chat Modal */}
      <AIChatModal
        isOpen={showChatModal}
        onClose={closeChatModal}
        initialTerm={chatTerm}
        initialDescription={chatDescription}
      />
    </>
  );
};

// Default props
AIChatWidget.defaultProps = {
  chatPrompts: [
    "Explain what a bull market is",
    "How do I read candlestick charts?",
    "What's the difference between a limit and stop order?",
    "Explain the concept of support and resistance",
    "What is dollar-cost averaging?",
    "How do I calculate risk-reward ratio?",
    "What are the best indicators for trend following?",
    "Explain what market capitalization means"
  ]
};

export default AIChatWidget;
