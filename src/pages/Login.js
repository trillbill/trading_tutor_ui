import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // API Endpoint
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT_DEV || 'http://trading-tutor-api-prod.eba-scnpdj3m.us-east-2.elasticbeanstalk.com/' 

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update the endpoint URLs with the correct API server address and port
      const endpoint = isLogin
        ? `${API_ENDPOINT}api/auth/login`
        : `${API_ENDPOINT}api/auth/register`;
        
      const response = await axios.post(endpoint, { email, password });
      
      if (isLogin) {
        // On Login: store token and email, then update state
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userEmail', response.data.user.email);
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('solanaAddress', response.data.user.solana_address);
        setIsAuthenticated(true);
        setMessage('Login successful!');
        navigate('/'); // Adjust as needed
      } else {
        // For registration, prompt user to log in after a successful account creation
        setMessage('Account created successfully. Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('API error:', error);
      setMessage(error.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className="login-container">
      <h1>{isLogin ? 'Login' : 'Create Account'}</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">Email:</label>
        <input 
          type="email" 
          id="email"
          value={email} 
          onChange={e => setEmail(e.target.value)}
          required 
        />
        <label htmlFor="password">Password:</label>
        <input 
          type="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required 
        />
        <button type="submit" className="submit-button">
          {isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>
      <button onClick={() => setIsLogin(prev => !prev)} className="toggle-button">
        {isLogin ? 'Need to create an account?' : 'Already have an account?'}
      </button>
    </div>
  );
}

export default Login;