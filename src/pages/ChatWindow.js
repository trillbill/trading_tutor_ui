// trading_tutor_ui/src/components/ChatWindow.js
import React, { useState, useRef } from 'react';
import axios from 'axios';
import './ChatWindow.css';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  // We'll store the image as a Base64 data URL (e.g., "data:image/jpeg;base64,...")
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // API Endpoint
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT_DEV || 'http://trading-tutor-api-prod.eba-scnpdj3m.us-east-2.elasticbeanstalk.com/'

  // When a user selects an image, convert it to a Base64 data URL.
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result will be a data URL (e.g., "data:image/jpeg;base64,...")
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setImage(null); // Clear the uploaded image
  };

  const handleSendMessage = async () => {
    setLoading(true);
    let payload = null;

    if (image) {
      // Default prompt for AI analysis
      const defaultPrompt = "Please analyze this price chart and provide insights on bullish or bearish momentum, any indicators present (RSI, MACD, volume, price levels, etc.), and suggestions for trading.";

      // Display the user's message with the image
      const newMessage = {
        text: '', // No user text
        image: image, // for preview purposes
        sender: 'user',
      };
      setMessages((prev) => [...prev, newMessage]);

      // Setup the payload for the image
      payload = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: defaultPrompt },
              { type: "image_url", image_url: { url: image } },
            ],
          },
        ],
        store: true,
      };

      // Reset input fields
      setInputValue('');
      handleRemoveImage(); // Clear the uploaded image after sending
    } else if (inputValue.trim()) { // Handle text-only messages
        // Display the user's text message
        const newMessage = {
            text: inputValue, // User text
            sender: 'user',
        };
        setMessages((prev) => [...prev, newMessage]);
        
        // Setup the payload for the text message
        payload = {
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [{ type: "text", text: inputValue }],
                },
            ],
        };

        // Reset input fields
        setInputValue('');
    }

    // Make API call to your backend chat endpoint
    try {
      const response = await axios.post(
        `${API_ENDPOINT}api/chat/completions`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Process the AI's response and format it for better readability
      const aiResponse = response.data.choices[0].message.content;
      const formattedResponse = aiResponse
        .replace(/###/g, '<strong>') // Replace ### with <strong> for bold
        .replace(/\n/g, '<br />') // Replace new lines with <br />
        .replace(/<\/strong>/g, '</strong><br />'); // Ensure each section ends with a line break

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

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            {msg.sender === 'ai' ? (
              <div dangerouslySetInnerHTML={{ __html: msg.text }} />
            ) : (
              <p>{msg.text}</p>
            )}
            {msg.image && (
              <img src={msg.image} alt="Uploaded chart" className="chat-image" />
            )}
          </div>
        ))}
        {loading && <div className="loading-spinner"></div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={handleKeyPress}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        {image ? (
          <div className="uploaded-image">
            <button className="remove-button" onClick={handleRemoveImage} disabled={loading}>
              <i className="fas fa-file"></i> X
            </button>
          </div>
        ) : (
          <button onClick={handleFileButtonClick} className="upload-button" disabled={loading}>
            <i className="fas fa-paperclip"></i> Upload Chart
          </button>
        )}
        <button onClick={handleSendMessage} className="send-button" disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
