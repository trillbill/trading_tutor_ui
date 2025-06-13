import React from 'react';
import { useCredit } from '../context/CreditContext';
import './CreditDisplay.css';

const CreditDisplay = () => {
  const { creditBalance, loading } = useCredit();

  if (loading || !creditBalance) {
    return null;
  }

  return (
    <div className="header-credit-display">
      <div className="credit-container">
        <span className="credit-count">
          {creditBalance.current}/{creditBalance.daily_limit}
        </span>
        <span className="credit-label">Credits</span>
      </div>
    </div>
  );
};

export default CreditDisplay;
