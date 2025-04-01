// trading_tutor_ui/src/components/ChatWindow.js
import React, { useState, useRef, useEffect, useContext } from 'react';
import api from '../api/api';
import './ChatWindow.css';
import heroImage from '../assets/tutor.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faArrowUp, faTimes } from '@fortawesome/free-solid-svg-icons'
import { AuthContext, useAuth } from '../context/AuthContext';
import AuthPrompt from '../components/AuthPrompt';

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
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage({
          data: reader.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && !uploadedImage) || loading) return;

    // Create message text
    const messageText = inputValue.trim();
    
    // Create a new message object
    const newMessage = {
      text: messageText,
      sender: 'user',
      image: uploadedImage ? uploadedImage.data : null
    };

    // Add the new message to the messages array
    setMessages((prev) => [...prev, newMessage]);
    
    // Clear the input and uploaded image
    setInputValue('');
    
    // If there's an image, send it with the message
    if (uploadedImage) {
      await sendImageToAPI(messageText, uploadedImage.data);
      setUploadedImage(null);
    } else {
      // Otherwise just send the text message
      await sendMessageToAPI(messageText);
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

    // If we have image analysis and this appears to be a follow-up about an image
    if (lastImageAnalysis && 
        (text.toLowerCase().includes('chart') || 
         text.toLowerCase().includes('image') || 
         text.toLowerCase().includes('price') ||
         text.toLowerCase().includes('indicator'))) {
      
      // Insert the image analysis as context before the user's latest message
      messagesForApi.splice(messagesForApi.length - 1, 0, {
        role: 'assistant',
        content: `Here's the chart analysis for reference:\n\n${lastImageAnalysis}`
      });
    }

    // Simplified payload - send messages and risk profile separately
    const payload = {
      messages: messagesForApi,
      riskProfile: userRiskProfile // Send the entire risk profile object
    };

    try {
      const response = await api.post(
        'api/chat/completions',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Process the AI's response
      const aiResponse = response.data.choices[0].message.content;
      const formattedResponse = aiResponse
        .replace(/###/g, '<strong>')
        .replace(/\n/g, '<br />')
        .replace(/<\/strong>/g, '</strong><br />');

      const aiMessage = {
        text: formattedResponse,
        sender: 'ai',
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

    const defaultPrompt = text || "Please analyze this price chart and provide insights on bullish or bearish momentum, any indicators present (RSI, MACD, volume, price levels, etc.), and suggestions for trading.";

    // Include conversation history for context
    const conversationHistory = messages
      .slice(-4) // Get last few messages for context
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

    // Add risk profile to the payload if available
    const payload = {
      text: defaultPrompt,
      imageUrl: imageData,
      conversationHistory,
      riskProfile: userRiskProfile // Send the entire risk profile object
    };

    try {
      const response = await api.post(
        'api/chat/image-analysis',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Store the image analysis for future reference
      setLastImageAnalysis(response.data.analysis);

      // Process the AI's response
      const aiResponse = response.data.response.choices[0].message.content;
      const formattedResponse = aiResponse
        .replace(/###/g, '<strong>')
        .replace(/\n/g, '<br />')
        .replace(/<\/strong>/g, '</strong><br />');

      // Add a hidden message with the image analysis (optional)
      const hiddenAnalysisMessage = {
        text: response.data.analysis,
        sender: 'ai',
        hidden: true, // You can use this flag to not display this message
      };

      // Add the visible response
      const aiMessage = {
        text: formattedResponse,
        sender: 'ai',
      };

      setMessages((prevMessages) => [...prevMessages, hiddenAnalysisMessage, aiMessage]);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
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

      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.sender === 'ai' ? (
                <div className="ai-message-container" dangerouslySetInnerHTML={{ __html: msg.text }} />
              ) : (
                <div className="user-message-container">
                  {msg.text}
                  {msg.image && (
                    <div className="user-image">
                      <img src={msg.image} alt="User uploaded" className={msg.text.length ? "chat-image-w-text" : "chat-image"} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {loading && <div className="loading-spinner"></div>}
          <div ref={messagesEndRef} /> {/* Empty div for auto-scrolling */}
        </div>

        {/* Centered Prompt Carousel */}
        {messages.length < 1 && (
          <div className="prompt-carousel">
            {prompts.map((prompt, index) => (
              <button key={index} className="prompt-button" onClick={() => handlePromptClick(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Display uploaded image preview */}
        {uploadedImage && !loading && (
          <div className="uploaded-image-preview">
            <img src={uploadedImage.data} alt="Upload preview" />
            <span>{uploadedImage.name}</span>
            <button onClick={handleRemoveImage}><FontAwesomeIcon icon={faTimes} /></button>
          </div>
        )}

        <div className="chat-input">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message or upload a chart..."
            onKeyPress={handleKeyPress}
          />
          
          <div className="input-buttons">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button 
              onClick={handleFileButtonClick} 
              className="upload-button" 
              title="Upload image"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button 
              onClick={handleSendMessage} 
              className="send-button" 
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
