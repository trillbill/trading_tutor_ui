import React from 'react';
import { FaTrophy, FaChartLine, FaGraduationCap, FaCheckCircle } from 'react-icons/fa';
import './UserPerformanceStats.css';

const UserPerformanceStats = ({ profileData }) => {
  // Show a loading state if profileData is null or undefined
  if (!profileData) {
    return (
      <div className="user-performance-container">
        <div className="performance-header">
          <h3>Learning Progress</h3>
        </div>
        <div className="loading-stats">Loading your stats...</div>
      </div>
    );
  }

  // Extract data safely with fallbacks
  const quizResults = profileData?.profile?.quizResults || [];
  const performance = profileData?.profile?.performance || {
    skillLevel: 'beginner',
    total: 0,
    average: 0
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
  
  // Get recent quiz categories
  const getRecentCategories = () => {
    if (!quizResults || quizResults.length === 0) return [];
    
    const categories = {};
    quizResults.slice(0, 5).forEach(quiz => {
      if (!categories[quiz.category]) {
        categories[quiz.category] = 0;
      }
      categories[quiz.category]++;
    });
    
    return Object.keys(categories).map(category => ({
      name: category,
      count: categories[category]
    })).sort((a, b) => b.count - a.count);
  };
  
  const recentCategories = getRecentCategories();
  
  return (
    <div className="user-performance-container">
      {/* <div className="performance-header">
        <h3>Learning Progress</h3>
      </div> */}
      
      <div className="performance-stats">
        <div className="skill-level-card" style={{ borderColor: skillLevelInfo.color }}>
          <div className="skill-badge" style={{ backgroundColor: skillLevelInfo.color }}>
            {skillLevelInfo.icon}
          </div>
          <div className="skill-info">
            <h4>{skillLevelInfo.title}</h4>
            <p>{skillLevelInfo.description}</p>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaCheckCircle />
            </div>
            <div className="stat-details">
              <h5>Quizzes Completed</h5>
              <div className="stat-value">{performance.total || 0}</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FaTrophy />
            </div>
            <div className="stat-details">
              <h5>Average Score</h5>
              <div className="stat-value">{performance.average || 0}%</div>
            </div>
          </div>
        </div>
        
        {/* {recentCategories.length > 0 && (
          <div className="recent-categories">
            <h5>Recently Studied Topics</h5>
            <div className="category-tags">
              {recentCategories.map((category, index) => (
                <div key={index} className="category-tag">
                  {category.name}
                </div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default UserPerformanceStats;
