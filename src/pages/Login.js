import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(endpoint, { email, password });

      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        setMessage('Login successful!');
        navigate('/dashboard');
      } else {
        setMessage('Account created successfully. Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
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