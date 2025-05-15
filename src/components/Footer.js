import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import LogoHeader from './LogoHeader';
import { FaTwitter, FaInstagram, FaYoutube, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();
  
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <img 
                src={require('../assets/TextOnly_NoBuffer.png')} 
                alt="Trading Tutor Logo" 
                className="footer-logo-image" 
            />
          </div>
          <p className="footer-description">
            Your personal guide to mastering trading concepts and strategies
          </p>
          <div className="social-links">
            <a href="https://x.com/tradingtutorai" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/tradingtutorai/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com/@TradingTutorAI" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            {isAuthenticated ? (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/learn">Learn</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/account">Account</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Legal</h3>
          <ul className="footer-links">
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <div className="not-found-help">
            <p>
              <a href="mailto:support@tradingtutorai.com">support@tradingtutorai.com</a>
            </p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Trading Tutor. All rights reserved.</p>
        <p className="footer-disclaimer">
          Trading involves risk. Past performance is not indicative of future results.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
