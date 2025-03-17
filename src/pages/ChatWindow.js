// trading_tutor_ui/src/components/ChatWindow.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatWindow.css';
import heroImage from '../assets/tutor.png';
import { FaPlus, FaArrowUp, FaTimes } from 'react-icons/fa'; // Import icons

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const messagesEndRef = useRef(null); // Reference for auto-scrolling

  // API Endpoint
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

  // Prompt options
  const prompts = [
    "What are some trading strategies I can use to improve my performance?",
    "Can you explain the concept of support and resistance?",
    "What indicators should I use for technical analysis?",
    "How can I manage risk in my trading?",
    "What are the best practices for trading psychology?"
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
    const messagesForApi = [
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: [{ type: "text", text: msg.text }]
      })),
      {
        role: 'user',
        content: [{ type: "text", text: text }]
      }
    ];

    // Setup the payload for the text message
    const payload = {
      model: "gpt-4o-mini",
      messages: messagesForApi,
    };

    try {
      const response = await axios.post(
        `${API_ENDPOINT}api/chat/completions`,
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

    // Setup the payload for the image analysis
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: defaultPrompt },
            { type: "image_url", image_url: { url: imageData } },
          ],
        }
      ],
      store: true,
    };

    try {
      const response = await axios.post(
        `${API_ENDPOINT}api/chat/completions`,
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
            <button onClick={handleRemoveImage}><FaTimes /></button>
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
              <FaPlus />
            </button>
            <button 
              onClick={handleSendMessage} 
              className="send-button" 
              disabled={loading || (!inputValue.trim() && !uploadedImage)}
              title="Send message"
            >
              <FaArrowUp />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
