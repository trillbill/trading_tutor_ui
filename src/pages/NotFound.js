import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        
        <h1>Page Not Found</h1>
        
        <div className="not-found-illustration">
          <div className="chart-line"></div>
          <div className="chart-dot"></div>
          <div className="chart-question">?</div>
        </div>
        
        <p className="not-found-message">
          Oops! It seems like the trading chart you're looking for has gone off the grid.
        </p>
        
        <div className="not-found-actions">
          <Link to="/" className="learn-button">
            <i className="fas fa-book"></i> Explore Lessons
          </Link>
        </div>
        
        <div className="not-found-help">
          <p>
            If you believe this is an error, please contact our support team at{' '}
            <a href="mailto:tradingtutorhelp@gmail.com">tradingtutorhelp@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
