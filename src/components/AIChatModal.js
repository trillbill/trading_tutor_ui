import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaArrowRight, FaImage, FaCoins } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import api from '../api/api';
import './AIChatModal.css';
import { useCredit } from '../context/CreditContext';
import heic2any from 'heic2any';

const AIChatModal = ({ isOpen, onClose, initialTerm, initialDescription, initialMessage, initialImage }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [lastImageAnalysis, setLastImageAnalysis] = useState(null);
  const [currentImageId, setCurrentImageId] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { refreshCredits } = useCredit();
  
  // Initialize chat with the term when the modal opens
  useEffect(() => {
    if (isOpen && initialTerm) {
      // Clear previous messages and image state
      setMessages([]);
      setUploadedImage(null);
      setLastImageAnalysis(null);
      setCurrentImageId(null);
      
      // If there's an initial image, set it up
      if (initialImage) {
        const newImageId = Date.now().toString();
        setCurrentImageId(newImageId);
        setUploadedImage({
          id: newImageId,
          data: initialImage.data,
          name: initialImage.name
        });
        
        // Create initial user message and send image for analysis
        const initialUserMessage = {
          text: initialMessage || "Please analyze this chart",
          sender: 'user',
          image: initialImage.data
        };
        
        setMessages([initialUserMessage]);
        sendImageToAPI(initialMessage || "Please analyze this chart and provide insights on potential entry/exit points, support and resistance levels, indicators, and trading suggestions based on what you see.", initialImage.data);
      } else {
        // Create initial user message about the term
        const initialUserMessage = {
          text: initialMessage || initialTerm,
          sender: 'user',
        };
        
        // Add the message and send to API
        setMessages([initialUserMessage]);
        sendMessageToAPI(initialUserMessage.text, initialDescription);
      }
    }
  }, [isOpen, initialTerm, initialDescription, initialMessage, initialImage]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle file upload with HEIC support
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Clear any previous image analysis context
    setLastImageAnalysis(null);
    
    // Generate a unique ID for this image
    const newImageId = Date.now().toString();
    setCurrentImageId(newImageId);
    
    try {
      let fileToProcess = file;
      
      // Check if it's a HEIC file (by extension or MIME type)
      const isHEIC = file.type === 'image/heic' || 
                     file.type === 'image/heif' ||
                     file.name.toLowerCase().endsWith('.heic') ||
                     file.name.toLowerCase().endsWith('.heif');
      
      if (isHEIC) {
        
        // Show a loading state or message
        setLoading(true);
        
        try {
          // Convert HEIC to JPEG
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.8
          });
          
          // Create a new file from the converted blob
          const convertedFileName = file.name.replace(/\.(heic|heif)$/i, '.jpg');
          fileToProcess = new File([convertedBlob], convertedFileName, {
            type: 'image/jpeg'
          });
          
        } catch (conversionError) {
          console.error('HEIC conversion failed:', conversionError);
          
          // Add error message to chat
          const errorMessage = {
            text: "Sorry, I couldn't process this HEIC image. Please try converting it to JPEG first, or change your iPhone camera settings to 'Most Compatible' mode in Settings → Camera → Formats.",
            sender: 'ai',
          };
          setMessages((prevMessages) => [...prevMessages, errorMessage]);
          setLoading(false);
          return;
        } finally {
          setLoading(false);
        }
      }
      
      // Process the file (original or converted)
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage({
          id: newImageId,
          data: e.target.result,
          name: fileToProcess.name
        });
      };
      reader.readAsDataURL(fileToProcess);
      
    } catch (error) {
      console.error('Error processing file:', error);
      
      // Add error message to chat
      const errorMessage = {
        text: "Sorry, I encountered an error processing this image. Please try a different image or format.",
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
      setLoading(false);
    }
  };

  // Handle removing uploaded image
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setLastImageAnalysis(null);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle file button click
  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };
  
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

      // Check if this is a follow-up about the most recent image
      const isImageFollowUp = 
        lastImageAnalysis && 
        currentImageId === lastImageAnalysis.imageId &&
        (text.toLowerCase().includes('chart') || 
         text.toLowerCase().includes('image') || 
         text.toLowerCase().includes('price') ||
         text.toLowerCase().includes('indicator') ||
         text.toLowerCase().includes('support') ||
         text.toLowerCase().includes('resistance'));

      if (isImageFollowUp) {
        // Insert the image analysis as context
        payload.messages.push({
          role: 'assistant',
          content: `Here's the chart analysis for reference:\n\n${lastImageAnalysis.analysis}`
        });
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
        // If this was a follow-up to an image, tag it with the image ID
        ...(isImageFollowUp && { imageId: currentImageId })
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
      
      refreshCredits(); // Refresh credit balance after successful chat
    } catch (error) {
      console.error('Error sending message to API:', error);
      
      let errorMessage;
      
      // Handle insufficient credits (402 status)
      if (error.response?.status === 402) {
        const errorData = error.response.data;
        errorMessage = {
          text: `**Insufficient Credits** 💳\n\nYou need **${errorData.required_credits} credit${errorData.required_credits > 1 ? 's' : ''}** to send this message, but you only have **${errorData.current_credits} credit${errorData.current_credits !== 1 ? 's' : ''}** remaining.\n\n✨ **Good news!** Your credits reset daily, so you'll get 50 fresh credits tomorrow. Try again then! In the meantime, you can check out some of our free learning resources on the Learn Page.\n\n💡 **Tip:** Each chat message costs 1 credit, and logging trades costs 2 credits.`,
          sender: 'ai',
        };
      } else {
        // Generic error message for other errors
        errorMessage = {
          text: "I'm sorry, I encountered an error. Please try again later.",
          sender: 'ai',
        };
      }
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Send image to API for analysis
  const sendImageToAPI = async (text, imageData) => {
    setLoading(true);
    
    // Store the current image ID for this analysis
    const imageId = currentImageId;

    const defaultPrompt = text || "Please analyze this chart and provide insights on potential entry/exit points, support and resistance levels, indicators, and trading suggestions based on what you see.";

    const payload = {
      text: defaultPrompt,
      imageUrl: imageData,
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
      refreshCredits(); // Refresh credit balance after successful analysis
    } catch (error) {
      console.error('Error analyzing image:', error);
      
      let errorMessage;
      
      // Handle insufficient credits (402 status)
      if (error.response?.status === 402) {
        const errorData = error.response.data;
        errorMessage = {
          text: `**Insufficient Credits** 💳\n\nYou need **${errorData.required_credits} credit${errorData.required_credits > 1 ? 's' : ''}** to analyze this image, but you only have **${errorData.current_credits} credit${errorData.current_credits !== 1 ? 's' : ''}** remaining.\n\n✨ **Good news!** Your credits reset daily, so you'll get 50 fresh credits tomorrow. Try again then!`,
          sender: 'ai',
        };
      } else {
        // Generic error message for other errors
        errorMessage = {
          text: "Sorry, I encountered an error analyzing this image. Please try again or upload a different image.",
          sender: 'ai',
        };
      }
      
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
  
  // Handle sending a message
  const handleSendMessage = () => {
    if ((!inputValue.trim() && !uploadedImage) || loading) return;
    
    const newMessage = {
      text: inputValue,
      sender: 'user',
    };

    // If there's an uploaded image, add it to the message
    if (uploadedImage) {
      newMessage.image = uploadedImage.data;
    }
    
    // Update messages with the new user message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    
    // Clear the input field
    const messageText = inputValue;
    setInputValue('');
    
    // If there's an image, send it to the image analysis API
    if (uploadedImage) {
      sendImageToAPI(messageText, uploadedImage.data);
    } else {
      // Send to regular API (without adding the message again)
      sendMessageToAPI(messageText);
    }
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
            !message.hidden && (
              <div 
                key={index} 
                className={`modal-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="modal-message-content">
                  {message.image && (
                    <div className="modal-message-image-container">
                      <img 
                        src={message.image} 
                        alt="Chart uploaded by user" 
                        className="modal-message-image" 
                      />
                    </div>
                  )}
                  {renderMessageContent(message)}
                </div>
              </div>
            )
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

        {/* Display uploaded image preview */}
        {uploadedImage && !loading && (
          <div className="ai-chat-uploaded-image-preview">
            <div className="uploaded-image-header">
              <FaImage /> Chart ready to analyze
              <button onClick={handleRemoveImage} className="remove-image-button">
                <FaTimes />
              </button>
            </div>
            <img src={uploadedImage.data} alt="Chart preview" className="uploaded-image-preview" />
            <span className="uploaded-image-name">{uploadedImage.name}</span>
          </div>
        )}
        
        <div className="ai-chat-modal-input">
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={uploadedImage ? "Describe what you'd like me to analyze about this chart..." : "Ask a follow-up question..."}
              disabled={loading}
              className="quick-chat-input"
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
                type="button"
                onClick={handleFileButtonClick} 
                className="upload-button-widget" 
                title="Upload chart image"
                disabled={loading}
              >
                <FaImage />
              </button>
              <button 
                type="submit" 
                onClick={handleSendMessage} 
                className="quick-chat-button"
                disabled={loading || (!inputValue.trim() && !uploadedImage)}
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
          
          {/* Credit Cost Information */}
          <div className="ai-chat-credit-info">
            <div className="credit-cost-items">
              <div className="credit-cost-item">
                <FaCoins className="credit-icon" />
                <span>Text message: <strong>1 credit</strong></span>
              </div>
              <div className="credit-cost-item">
                <FaImage className="credit-icon" />
                <span>Image analysis: <strong>10 credits</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Set default props
AIChatModal.defaultProps = {
  initialMessage: '',
  initialDescription: '',
  initialImage: null
};

export default AIChatModal;