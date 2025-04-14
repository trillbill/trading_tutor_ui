import React from 'react';
import { FaChartLine, FaBalanceScale, FaShieldAlt } from 'react-icons/fa';
import './RiskAppetiteBadge.css';

const RiskAppetiteBadge = ({ riskAppetite }) => {
  // Determine risk profile based on risk appetite score
  const getRiskProfile = (score) => {
    if (score <= 0) return { type: 'none', label: 'Not Set' };
    if (score <= 3) return { type: 'conservative', label: 'Conservative', icon: <FaShieldAlt /> };
    if (score <= 6) return { type: 'moderate', label: 'Moderate', icon: <FaBalanceScale /> };
    return { type: 'aggressive', label: 'Aggressive', icon: <FaChartLine /> };
  };

  const profile = getRiskProfile(riskAppetite);

  if (profile.type === 'none') {
    return (
      <div className="risk-badge not-set">
        <div className="risk-badge-icon">?</div>
        <div className="risk-badge-details">
          <span className="risk-badge-label">Risk Profile Not Set</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`risk-badge ${profile.type}`}>
      <div className="risk-badge-icon">{profile.icon}</div>
      <div className="risk-badge-details">
        <span className="risk-badge-label">{profile.label}</span>
        <span className="risk-badge-score">Risk Appetite: {riskAppetite}/10</span>
      </div>
    </div>
  );
};

export default RiskAppetiteBadge;
