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

      // Reset input fields
      setInputValue('');
      setLoading(true);
      handleRemoveImage(); // Clear the uploaded image after sending

      try {
        const payload = {
          model: "gpt-4o-mini", // Ensure you have access to this model.
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: defaultPrompt },
                { type: "image_url", image_url: { url: image } },
              ],
            },
          ],
          store: true, // if you want to store the image for future reference; remove if not needed.
        };

        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          payload,
          {
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
              'Content-Type': 'application/json',
            },
          }
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
        console.error('Error communicating with OpenAI API:', error);
      } finally {
        setLoading(false);
      }
    } else if (inputValue.trim()) { // Handle text-only messages
        const newMessage = {
            text: inputValue, // User text
            sender: 'user',
        };
        setMessages((prev) => [...prev, newMessage]);

        // Reset input fields
        setInputValue('');
        setLoading(true);

        try {
            const payload = {
                model: "gpt-4o-mini", // Ensure you have access to this model.
                messages: [
                    {
                        role: "user",
                        content: [{ type: "text", text: inputValue }],
                    },
                ],
            };

            const response = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
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
            console.error('Error communicating with OpenAI API:', error);
        } finally {
            setLoading(false);
        }
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
            <button className="remove-button" onClick={handleRemoveImage} disabled={loading && true}>
              <i className="fas fa-file"></i> X
            </button>
          </div>
        ) : (
          <button onClick={handleFileButtonClick} className="upload-button" disabled={loading && true}>
            <i className="fas fa-paperclip"></i> Upload Chart
          </button>
        )}
        <button onClick={handleSendMessage} className="send-button" disabled={loading && true}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
