// trading_tutor_ui/src/components/ChatWindow.js
import React, { useState, useRef } from 'react';
import axios from 'axios';
import './ChatWindow.css';
import heroImage from '../assets/tutor.png'; // Use the same image

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  // We'll store the image as a Base64 data URL (e.g., "data:image/jpeg;base64,...")
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // API Endpoint
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

   // Prompt options
  const prompts = [
    "What are some trading strategies I can use to improve my performance?",
    "Can you explain the concept of support and resistance?",
    "What indicators should I use for technical analysis?",
    "How can I manage risk in my trading?",
    "What are the best practices for trading psychology?"
  ];

  const handlePromptClick = async (prompt) => {
    // Create a new message object for the selected prompt
    const newMessage = {
        text: prompt, // Use the selected prompt as the message text
        sender: 'user',
        image: null, // No image for prompt selection
    };

    // Add the new message to the messages array
    setMessages((prev) => [...prev, newMessage]);

    // Prepare the messages array for the API call
    const messagesForApi = [
        ...messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: [{ type: "text", text: msg.text }]
        })),
        {
            role: 'user',
            content: [{ type: "text", text: prompt }]
        }
    ];

    // Show loading spinner
    setLoading(true);

    // Setup the payload for the text message
    const payload = {
        model: "gpt-4o-mini",
        messages: messagesForApi, // Include previous messages
    };

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
        // Hide loading spinner
        setLoading(false);
    }
};

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

    // Create a new message object for the user's input
    const newMessage = {
        text: inputValue.trim() || '', // User text
        sender: 'user',
        image: image || null, // Include the uploaded image if it exists
    };

    // Add the new message to the messages array
    setMessages((prev) => [...prev, newMessage]);

    // Prepare the messages array for the API call
    const messagesForApi = [
        ...messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: [{ type: "text", text: msg.text }]
        })),
        {
            role: 'user',
            content: [{ type: "text", text: inputValue.trim() }]
        }
    ];

    // Check if an image is uploaded
    if (image) {
        const defaultPrompt = "Please analyze this price chart and provide insights on bullish or bearish momentum, any indicators present (RSI, MACD, volume, price levels, etc.), and suggestions for trading.";

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
                ...messagesForApi // Include previous messages
            ],
            store: true,
        };

        // Reset input fields
        setInputValue('');
        handleRemoveImage(); // Clear the uploaded image after sending
    } else if (inputValue.trim()) { // Handle text-only messages
        // Setup the payload for the text message
        payload = {
            model: "gpt-4o-mini",
            messages: messagesForApi, // Include previous messages
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
    <div className='chat-container'>
      <div className="title-section" style={{ backgroundImage: `url(${heroImage})` }}>
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
                <div className={!msg.image && "user-message-container"}>
                  <p>{msg.text}</p>
                </div>
              )}
              {msg.image && (
                <img src={msg.image} alt="Uploaded chart" className="chat-image" />
              )}
            </div>
          ))}
          {loading && <div className="loading-spinner"></div>}
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
    </div>
  );
};

export default ChatWindow;
