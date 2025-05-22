import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaArrowUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import api from '../api/api';
import './AIChatModal.css';

const AIChatModal = ({ isOpen, onClose, initialTerm, initialDescription, initialMessage }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Initialize chat with the term when the modal opens
  useEffect(() => {
    if (isOpen && initialTerm) {
      // Clear previous messages
      setMessages([]);
      
      // Create initial user message about the term
      const initialUserMessage = {
        text: initialMessage || initialTerm, // Use initialMessage if provided, otherwise just use the term
        sender: 'user',
      };
      
      // Add the message and send to API
      setMessages([initialUserMessage]);
      sendMessageToAPI(initialUserMessage.text, initialDescription);
    }
  }, [isOpen, initialTerm, initialDescription, initialMessage]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Send message to API
  const sendMessageToAPI = async (text, contextDescription = null) => {
    setLoading(true);
    
    try {
      // Prepare the payload
      const payload = {
        messages: messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        newMessage: text
      };
      
      // If this is the first message, add context about the term
      if (contextDescription && messages.length === 0) {
        payload.termContext = {
          term: initialTerm,
          description: contextDescription
        };
      }
      
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
      
      // Use a callback function with the previous state to ensure we're working with the latest state
      setMessages(prevMessages => {
        // Check if the last message is from the user (to avoid duplicates)
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && lastMessage.sender === 'user') {
          return [...prevMessages, aiMessage];
        } else {
          // If the last message is not from the user, something went wrong
          // Log for debugging and return a corrected message array
          console.warn('Unexpected message state detected, correcting...');
          return [...prevMessages.filter(msg => msg.sender === 'user'), aiMessage];
        }
      });
    } catch (error) {
      console.error('Error sending message to API:', error);
      
      // Add error message
      const errorMessage = {
        text: "I'm sorry, I encountered an error. Please try again later.",
        sender: 'ai',
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim() === '' || loading) return;
    
    const newMessage = {
      text: inputValue,
      sender: 'user',
    };
    
    // Update messages with the new user message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputValue('');
    
    // Send to API (without adding the message again)
    sendMessageToAPI(inputValue);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Render message content with markdown
  const renderMessageContent = (message) => {
    if (message.sender === 'ai') {
      return (
        <div className="markdown-content">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
            {message.text}
          </ReactMarkdown>
        </div>
      );
    } else {
      return <p>{message.text}</p>;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="ai-chat-modal-overlay" onClick={onClose}>
      <div className="ai-chat-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="ai-chat-modal-header">
          <h3>AI Tutor: {initialTerm}</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="ai-chat-modal-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`modal-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="modal-message-content">
                {renderMessageContent(message)}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="modal-message ai-message">
              <div className="modal-message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <div className="ai-chat-modal-input">
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask a follow-up question..."
            disabled={loading}
          />
          <button 
            onClick={handleSendMessage} 
            disabled={loading || !inputValue.trim()}
            className="send-button"
          >
            <FaArrowUp />
          </button>
        </div>
      </div>
    </div>
  );
};

// Set default props
AIChatModal.defaultProps = {
  initialMessage: '',
  initialDescription: ''
};

export default AIChatModal;