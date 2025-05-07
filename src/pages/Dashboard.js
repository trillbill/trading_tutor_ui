import React, { useState, useEffect, useRef } from 'react';
import { FaChartLine, FaRobot, FaBook, FaLightbulb } from 'react-icons/fa';
import TradingJournal from '../components/TradingJournal';
import AIChatWindow from '../components/AIChatWindow';
import api from '../api/api';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('journal');
  const [journalSummary, setJournalSummary] = useState({
    totalTrades: 0,
    winRate: 0,
    totalPnL: 0
  });
  const [tipOfTheDay, setTipOfTheDay] = useState('');
  const [quickAskInput, setQuickAskInput] = useState('');
  
  // Create a ref for the journal stats updater
  const journalStatsUpdaterRef = useRef((stats) => {
    setJournalSummary({
      totalTrades: stats.total,
      winRate: stats.winRate,
      totalPnL: stats.totalProfit
    });
  });
  
  useEffect(() => {
    // Generate tip of the day
    const tips = [
      "Remember to set stop losses for every trade to manage risk.",
      "The best traders focus on consistency, not hitting home runs.",
      "Review your trading journal weekly to identify patterns in your performance.",
      "Emotional discipline is just as important as technical analysis.",
      "Markets trend only about 30% of the time; the rest is consolidation.",
      "Always have a trading plan before entering a position.",
      "Risk management is more important than finding the perfect entry.",
      "The trend is your friend until it bends at the end.",
      "Don't add to losing positions; add to winning ones.",
      "Keep a trading journal to learn from your mistakes and successes."
    ];
    
    setTipOfTheDay(tips[Math.floor(Math.random() * tips.length)]);
  }, []);
  
  // Handle quick ask submission
  const handleQuickAsk = () => {
    if (quickAskInput.trim() === '') return;
    
    // Switch to chat tab
    setActiveTab('chat');
    
    // The AIChatWindow component will handle the actual message sending
    // We'll need to pass the question to it
    // This will be implemented in a future step
    
    // Clear the input
    setQuickAskInput('');
  };
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Trading Dashboard</h1>
      </div>
      
      {/* Overview Cards */}
      <div className="overview-cards">
        <div className="overview-card">
          <h3>Total Trades</h3>
          <p className="card-value">{journalSummary.totalTrades}</p>
        </div>
        
        <div className="overview-card">
          <h3>Win Rate</h3>
          <p className="card-value">{journalSummary.winRate}%</p>
        </div>
        
        <div className="overview-card">
          <h3>Total P&L</h3>
          <p className={`card-value ${journalSummary.totalPnL >= 0 ? 'positive' : 'negative'}`}>
            ${journalSummary.totalPnL}
          </p>
        </div>
        
        <div className="overview-card tip-card">
          <div className="tip-header">
            <FaLightbulb />
            <h3>Tip of the Day</h3>
          </div>
          <p>{tipOfTheDay}</p>
        </div>
      </div>
      
      {/* Quick AI Ask */}
      <div className="quick-ask-section">
        <h2>Ask AI Tutor</h2>
        <div className="quick-ask-input">
          <input 
            type="text" 
            placeholder="E.g., 'Show me my last 3 trades and suggest improvements'" 
            value={quickAskInput}
            onChange={(e) => setQuickAskInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuickAsk()}
          />
          <button onClick={handleQuickAsk}>Ask</button>
        </div>
      </div>
      
      {/* Main Content Tabs */}
      <div className="dashboard-tabs">
        <div className="tab-buttons">
          <button 
            className={activeTab === 'journal' ? 'active' : ''} 
            onClick={() => setActiveTab('journal')}
          >
            <FaBook /> Trading Journal
          </button>
          <button 
            className={activeTab === 'chat' ? 'active' : ''} 
            onClick={() => setActiveTab('chat')}
          >
            <FaRobot /> AI Chat
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'journal' ? (
            <TradingJournal onStatsUpdate={journalStatsUpdaterRef.current} />
          ) : (
            <AIChatWindow />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
