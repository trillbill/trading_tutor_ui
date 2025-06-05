import React from 'react';
import { FaTrophy, FaChartLine, FaGraduationCap, FaCheckCircle, FaBook, FaRobot, FaChartBar, FaArrowRight, FaBookReader, FaLightbulb, FaCheck } from 'react-icons/fa';
import './UserPerformanceStats.css';

const UserPerformanceStats = ({ profileData }) => {
  // Show a loading state if profileData is null or undefined
  if (!profileData) {
    return (
      <div className="user-performance-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Extract data safely with fallbacks
  const quizResults = profileData?.profile?.quizResults || [];
  const performance = profileData?.profile?.performance || {
    skillLevel: 'beginner',
    quizzes: { total: 0, average: 0 },
    trades: { total: 0 }
  };
  
  // Get the skill level and corresponding badge
  const getSkillLevelInfo = (skillLevel) => {
    const levels = {
      beginner: {
        color: '#4CAF50',
        icon: <FaGraduationCap />,
        title: 'Beginner Trader',
        description: 'You\'re starting your trading journey. Keep learning the fundamentals and building your knowledge base.'
      },
      intermediate: {
        color: '#2196F3',
        icon: <FaChartLine />,
        title: 'Intermediate Trader',
        description: 'You have a solid understanding of trading concepts. Focus on refining strategies and risk management.'
      },
      advanced: {
        color: '#9C27B0',
        icon: <FaTrophy />,
        title: 'Advanced Trader',
        description: 'You demonstrate sophisticated trading knowledge. Continue mastering complex strategies and market analysis.'
      }
    };
    
    return levels[skillLevel] || levels.beginner;
  };
  
  const skillLevelInfo = getSkillLevelInfo(performance.skillLevel);
    
  return (
    <div className="user-performance-container">
      <div className="performance-stats">
        {/* Dashboard Introduction Section - now directly in performance-stats */}
        <div className="dashboard-intro">
          <h2>Dashboard</h2>
          <p className="dashboard-description">
            Welcome to your personal trading hub! Here you can track your learning progress, log and analyze your trades, 
            chat with your AI tutor for personalized guidance, and monitor your overall performance.
          </p>
          <div className="dashboard-features">
            <div className="feature">
              <FaChartBar className="feature-icon" />
              <span>Track Trades</span>
            </div>
            <div className="feature">
              <FaRobot className="feature-icon" />
              <span>AI Guidance</span>
            </div>
            <div className="feature">
              <FaBook className="feature-icon" />
              <span>Learning Progress</span>
            </div>
            <div className="feature">
              <FaChartLine className="feature-icon" />
              <span>Performance Analysis</span>
            </div>
          </div>
        </div>
        
        <div className="skill-level-card" style={{ borderColor: skillLevelInfo.color }}>
          <div className="skill-badge" style={{ backgroundColor: skillLevelInfo.color }}>
            {skillLevelInfo.icon}
          </div>
          <div className="skill-info">
            <h4>{skillLevelInfo.title}</h4>
            <p>{skillLevelInfo.description}</p>
          </div>
        </div>
        
        {/* Next Level Requirements Card */}
        {performance.nextLevel && (
          <div className="next-level-card">
            <div className="skill-info">
              <h4>Skill Level Progress</h4>
              <p>Complete all the requirements below to advance to {performance.nextLevel.name.charAt(0).toUpperCase() + performance.nextLevel.name.slice(1)}</p>
            </div>
            <div className="requirements-grid">
              <div className="requirement">
                <FaBook className="requirement-icon" />
                <div className="requirement-details">
                  <div className="requirement-header">
                    <span className="requirement-label">Quizzes</span>
                    {performance.nextLevel.requirements.quizzes?.completed && <FaCheck className="check-icon" />}
                  </div>
                  <span className="requirement-progress">
                    {performance.nextLevel.requirements.quizzes?.message || performance.nextLevel.requirements.quizzes}
                  </span>
                </div>
              </div>
              <div className="requirement">
                <FaTrophy className="requirement-icon" />
                <div className="requirement-details">
                  <div className="requirement-header">
                    <span className="requirement-label">Average Score</span>
                    {performance.nextLevel.requirements.score?.completed && <FaCheck className="check-icon" />}
                  </div>
                  <span className="requirement-progress">
                    {performance.nextLevel.requirements.score?.message || performance.nextLevel.requirements.score}
                  </span>
                </div>
              </div>
              <div className="requirement">
                <FaChartLine className="requirement-icon" />
                <div className="requirement-details">
                  <div className="requirement-header">
                    <span className="requirement-label">Trades Logged</span>
                    {performance.nextLevel.requirements.trades?.completed && <FaCheck className="check-icon" />}
                  </div>
                  <span className="requirement-progress">
                    {performance.nextLevel.requirements.trades?.message || performance.nextLevel.requirements.trades}
                  </span>
                </div>
              </div>
              <div className="requirement">
                <FaBookReader className="requirement-icon" />
                <div className="requirement-details">
                  <div className="requirement-header">
                    <span className="requirement-label">Modules Completed</span>
                    {performance.nextLevel.requirements.modules?.completed && <FaCheck className="check-icon" />}
                  </div>
                  <span className="requirement-progress">
                    {performance.nextLevel.requirements.modules?.message || performance.nextLevel.requirements.modules}
                  </span>
                </div>
              </div>
              <div className="requirement">
                <FaLightbulb className="requirement-icon" />
                <div className="requirement-details">
                  <div className="requirement-header">
                    <span className="requirement-label">Concepts Mastered</span>
                    {performance.nextLevel.requirements.concepts?.completed && <FaCheck className="check-icon" />}
                  </div>
                  <span className="requirement-progress">
                    {performance.nextLevel.requirements.concepts?.message || performance.nextLevel.requirements.concepts}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPerformanceStats;
