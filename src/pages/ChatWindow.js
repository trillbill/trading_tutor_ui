// trading_tutor_ui/src/components/ChatWindow.js
import React, { useState, useRef, useEffect, useContext } from 'react';
import api from '../api/api';
import './ChatWindow.css';
import heroImage from '../assets/tutor.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faArrowUp, faTimes } from '@fortawesome/free-solid-svg-icons'
import { AuthContext, useAuth } from '../context/AuthContext';
import AuthPrompt from '../components/AuthPrompt';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

const ChatWindow = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const messagesEndRef = useRef(null); // Reference for auto-scrolling
  const { isAuthenticated, isEmailVerified } = useContext(AuthContext);
  const showAuthPrompt = !isAuthenticated || !isEmailVerified;
  const [lastImageAnalysis, setLastImageAnalysis] = useState(null);
  const [userRiskProfile, setUserRiskProfile] = useState(null);
  const [tradeHistory, setTradeHistory] = useState(null);
  const [currentImageId, setCurrentImageId] = useState(null);

  // Prompt options
  const prompts = [
    "Can you explain how perpetual swaps work?",
    "What indicators should I use for technical analysis?",
    "Help me develop a checklist for entering a trade",
    "How can I manage risk in my trading?",
    "What are some good strategies for trading in a bear market?",
  ];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.src = heroImage;
    img.onload = () => setImageLoaded(true);
  }, []);

  // Fetch user risk profile when component mounts
  useEffect(() => {
    const fetchRiskProfile = async () => {
      if (user) {
        try {
          const response = await api.get('/api/account/profile');
          if (response.data.success && response.data.profile) {
            setUserRiskProfile({
              risk_appetite: response.data.profile.user.risk_appetite || null,
              risk_level: getRiskLevel(response.data.profile.user.risk_appetite)
            });
          }
        } catch (error) {
          console.error('Error fetching risk profile:', error);
        }
      }
    };
    
    fetchRiskProfile();
  }, [user]);

  // Update the trade history fetch function to handle the enhanced data
  useEffect(() => {
    const fetchTradeHistory = async () => {
      if (user) {
        try {
          const response = await api.get('/api/journal/summary');
          if (response.data.success && response.data.summary) {
            setTradeHistory(response.data.summary);
          }
        } catch (error) {
          console.error('Error fetching trade history:', error);
        }
      }
    };
    
    fetchTradeHistory();
  }, [user]);

  // Helper function to determine risk level from risk appetite
  const getRiskLevel = (riskAppetite) => {
    if (riskAppetite === null || riskAppetite === undefined) return null;
    if (riskAppetite <= 3) return 'conservative';
    if (riskAppetite <= 6) return 'moderate';
    return 'aggressive';
  };

  const handlePromptClick = async (prompt) => {
    // Create a new message object for the selected prompt
    const newMessage = {
      text: prompt,
      sender: 'user',
    };

    // Add the new message to the messages array
    setMessages((prev) => [...prev, newMessage]);
    
    // Send the message to the API
    await sendMessageToAPI(prompt);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Clear any previous image analysis context
    setLastImageAnalysis(null);
    
    // Generate a unique ID for this image
    const newImageId = Date.now().toString();
    setCurrentImageId(newImageId);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage({
        id: newImageId,
        data: e.target.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    // Also clear any previous image analysis context
    setLastImageAnalysis(null);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !uploadedImage) || loading) return;
    
    // Create a new message with the user's text
    const newMessage = {
      text: inputValue,
      sender: 'user',
    };
    
    // If there's an uploaded image, add it to the message
    if (uploadedImage) {
      newMessage.image = uploadedImage.data;
    }
    
    // Add the message to the chat
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    // Clear the input field
    setInputValue('');
    
    // If there's an image, send it to the API
    if (uploadedImage) {
      await sendImageToAPI(inputValue, uploadedImage.data);
      // Clear the uploaded image after sending
      setUploadedImage(null);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      // Otherwise, just send the text message
      await sendMessageToAPI(inputValue);
    }
  };

  const sendMessageToAPI = async (text) => {
    if (!text) return;
    
    setLoading(true);

    // Prepare the messages array for the API call
    let messagesForApi = [
      ...messages
        .filter(msg => !msg.hidden) // Filter out hidden messages
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
      {
        role: 'user',
        content: text
      }
    ];

    // Check if this is a follow-up about the most recent image
    // Only include image context if the user's message appears to be about the current image
    const isImageFollowUp = 
      lastImageAnalysis && 
      currentImageId === lastImageAnalysis.imageId &&
      (text.toLowerCase().includes('chart') || 
       text.toLowerCase().includes('image') || 
       text.toLowerCase().includes('price') ||
       text.toLowerCase().includes('indicator'));

    if (isImageFollowUp) {
      // Insert the image analysis as context before the user's latest message
      messagesForApi.splice(messagesForApi.length - 1, 0, {
        role: 'assistant',
        content: `Here's the chart analysis for reference:\n\n${lastImageAnalysis.analysis}`
      });
    }

    // Simplified payload - send messages and risk profile separately
    const payload = {
      messages: messagesForApi,
      riskProfile: userRiskProfile
    };

    try {
      const response = await api.post(
        'api/chat/completions',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Process the AI's response
      let aiResponse = response.data.choices[0].message.content;

      const aiMessage = {
        text: aiResponse,
        sender: 'ai',
        // If this was a follow-up to an image, tag it with the image ID
        ...(isImageFollowUp && { imageId: currentImageId })
      };
      
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error communicating with AI API:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendImageToAPI = async (text, imageData) => {
    setLoading(true);
    
    // Store the current image ID for this analysis
    const imageId = currentImageId;

    const defaultPrompt = text || "Please analyze this price chart and provide insights on bullish or bearish momentum, any indicators present (RSI, MACD, volume, price levels, etc.), and suggestions for trading.";

    // Don't include any previous conversation history for image analysis
    // This ensures a clean context for each new image
    const payload = {
      text: defaultPrompt,
      imageUrl: imageData,
      riskProfile: userRiskProfile,
      newImageAnalysis: true
    };

    try {
      const response = await api.post('api/chat/image-analysis', payload);
      
      // Store the analysis with the image ID
      setLastImageAnalysis({
        imageId: imageId,
        analysis: response.data.analysis
      });
      
      // Add a hidden message with the image analysis and image ID
      const hiddenAnalysisMessage = {
        text: response.data.analysis,
        sender: 'ai',
        hidden: true,
        imageId: imageId
      };

      // Add the visible response with the image ID
      const aiMessage = {
        text: response.data.response,
        sender: 'ai',
        imageId: imageId
      };

      setMessages((prevMessages) => [...prevMessages, hiddenAnalysisMessage, aiMessage]);
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      // Add an error message to the chat
      const errorMessage = {
        text: "Sorry, I encountered an error analyzing this image. Please try again or upload a different image.",
        sender: 'ai'
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
      setUploadedImage(null); // Clear the uploaded image after sending
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  
  // Update the trade history analysis handler to include more detailed information
  const handleTradeHistoryAnalysis = async () => {
    if (!tradeHistory || !tradeHistory.stats || tradeHistory.stats.total_trades <= 0) {
      // If no trade history, inform the user
      const newMessage = {
        text: "Analyze my trading history and suggest improvements",
        sender: 'user',
      };
      setMessages((prev) => [...prev, newMessage]);
      
      // Send a response that no trade history is available
      setTimeout(() => {
        const aiMessage = {
          text: "I don't see any trading history in your account yet. Once you've recorded some trades in your journal, I can analyze your performance and provide personalized suggestions for improvement.",
          sender: 'ai',
        };
        setMessages((prev) => [...prev, aiMessage]);
      }, 500);
      return;
    }
    
    // Create a detailed prompt about trade history
    const prompt = "Please analyze my trading history in detail and suggest specific improvements based on my past performance.";
    
    // Add the message to the chat
    const newMessage = {
      text: prompt,
      sender: 'user',
    };
    setMessages((prev) => [...prev, newMessage]);
    
    // Send to API with a special flag
    setLoading(true);
    
    // Create a detailed analysis request
    const payload = {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      riskProfile: userRiskProfile,
      tradeHistory: tradeHistory,
      detailedTradeAnalysis: true // Special flag for detailed analysis
    };
    
    try {
      const response = await api.post(
        'api/chat/completions',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      // Process the AI's response
      const aiResponse = response.data.choices[0].message.content;
      
      const aiMessage = {
        text: aiResponse,
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error analyzing trade history:', error);
      
      // Show error message to user
      const errorMessage = {
        text: "I'm sorry, I encountered an error while analyzing your trade history. Please try again later.",
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Update the message rendering in your JSX
  const renderMessageContent = (message) => {
    if (message.sender === 'ai') {
      // Make sure we're passing a string to ReactMarkdown
      const messageText = typeof message.text === 'object' 
        ? JSON.stringify(message.text) 
        : String(message.text || '');
        
      return (
        <div className="cw-markdown-content">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
            {messageText}
          </ReactMarkdown>
        </div>
      );
    } else {
      return <p>{typeof message.text === 'object' ? JSON.stringify(message.text) : message.text}</p>;
    }
  };

  return (
    <div className='chat-container'>
      <div className="title-section" style={{ backgroundImage: `url(${heroImage})`, opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
        <div className="overlay"></div>
        <div className="title-content">
          <h2>Your AI Trading Tutor</h2>
          <p>
            You can talk to your AI tutor directly to work through trading strategies, learn more about trading terminology, or upload your own charts to receive analysis.
          </p>
        </div>
      </div>

      <div className="cw-chat-window">
        <div className="cw-chat-messages">
          {messages.map((message, index) => (
            !message.hidden && (
              <div 
                key={index} 
                className={`cw-message ${message.sender === 'user' ? 'cw-user-message' : 'cw-ai-message'}`}
              >
                <div className="cw-message-content">
                  {message.image && (
                    <div className="cw-message-image-container">
                      <img 
                        src={message.image} 
                        alt="User uploaded" 
                        className="cw-message-image" 
                      />
                    </div>
                  )}
                  {renderMessageContent(message)}
                </div>
              </div>
            )
          ))}
          {loading && (
            <div className="cw-message cw-ai-message">
              <div className="cw-message-content">
                <div className="cw-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt carousel at the bottom - only show when no messages */}
        {messages.length < 1 && (
          <div className="cw-prompt-carousel">
            {prompts.map((prompt, index) => (
              <button key={index} className="cw-prompt-button" onClick={() => handlePromptClick(prompt)}>
                {prompt}
              </button>
            ))}
            {
              tradeHistory && tradeHistory.stats && tradeHistory.stats.total_trades >= 1 && (
                <button 
                  className={`cw-prompt-button ${!tradeHistory || !tradeHistory.stats || tradeHistory.stats.total_trades <= 0 ? 'cw-disabled-prompt' : 'cw-highlight-prompt'}`} 
                  onClick={handleTradeHistoryAnalysis}
                  disabled={!tradeHistory || !tradeHistory.stats || tradeHistory.stats.total_trades <= 0}
                >
                  Analyze my trading history
                </button>
              )
            }
          </div>
        )}

        {/* Display uploaded image preview */}
        {uploadedImage && !loading && (
          <div className="cw-uploaded-image-preview">
            <img src={uploadedImage.data} alt="Upload preview" />
            <span>{uploadedImage.name}</span>
            <button onClick={handleRemoveImage}><FontAwesomeIcon icon={faTimes} /></button>
          </div>
        )}

        <div className="cw-chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message or upload a chart..."
            onKeyPress={handleKeyPress}
          />
          
          <div className="cw-input-buttons">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button 
              onClick={handleFileButtonClick} 
              className="cw-upload-button" 
              title="Upload image"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button 
              onClick={handleSendMessage} 
              className="cw-send-button" 
              disabled={loading || (!inputValue.trim() && !uploadedImage)}
              title="Send message"
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          </div>
        </div>
      </div>

      {/* Show auth prompt if needed */}
      {showAuthPrompt && <AuthPrompt />}
    </div>
  );
};

export default ChatWindow;