import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import './Account.css';
import { FaSignOutAlt, FaEnvelope, FaHistory, FaStar, FaGraduationCap, FaTrophy } from 'react-icons/fa';
import accountIcon from '../assets/account-icon-large.png';
import { AuthContext } from '../context/AuthContext';

function Account() {
  const [quizResults, setQuizResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const userEmail = user?.email || localStorage.getItem('userEmail');
  const userId = user?.id || localStorage.getItem('userId');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      
      // Fetch quiz results
      try {
        if (!userId) {
            console.log('User not logged in, skipping retrieve results');
            setIsLoading(false);
            return;
        }

        // Pass userId as a query parameter
        const response = await api.get(
          `api/quiz/results?userId=${userId}`
        );
        setQuizResults(response.data);
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
      
      setIsLoading(false);
    };

    fetchUserData();
  }, [userId]);

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate performance metrics
  const calculatePerformance = () => {
    if (quizResults.length === 0) return { average: 0, improvement: 0, total: 0 };
    
    const total = quizResults.length;
    const scores = quizResults.map(result => (result.score / result.total_questions) * 100);
    const average = scores.reduce((sum, score) => sum + score, 0) / total;
    
    // Calculate improvement (comparing first and most recent quiz)
    let improvement = 0;
    if (total >= 4) {
      const firstThreeAvg = (scores[total-1] + scores[total-2] + scores[total-3]) / 3;
      const latestScore = scores[0];
      improvement = latestScore - firstThreeAvg;
    }
    
    return { average: average.toFixed(1), improvement: improvement.toFixed(1), total };
  };

  // Calculate user's skill level based on quiz results
  const calculateSkillLevel = () => {
    if (quizResults.length === 0) return { 
      level: 'beginner', 
      icon: <FaStar />, 
      description: 'Just starting out' 
    };
    
    // Point system:
    // - Each beginner quiz: 1 point per correct answer
    // - Each intermediate quiz: 2 points per correct answer
    // - Each advanced quiz: 3 points per correct answer
    
    let totalPoints = 0;
    let maxPossiblePoints = 0;
    
    quizResults.forEach(result => {
      const difficultyMultiplier = 
        result.difficulty === 'beginner' ? 1 :
        result.difficulty === 'intermediate' ? 2 :
        result.difficulty === 'advanced' ? 3 : 1;
      
      totalPoints += result.score * difficultyMultiplier;
      maxPossiblePoints += result.total_questions * difficultyMultiplier;
    });
    
    // Calculate percentage of possible points earned
    const percentageScore = maxPossiblePoints > 0 ? (totalPoints / maxPossiblePoints) * 100 : 0;
    
    // Determine skill level based on percentage and number of quizzes taken
    if (quizResults.length < 3) {
      // Not enough quizzes to determine accurate skill level
      return { 
        level: 'beginner', 
        icon: <FaStar />, 
        description: 'Just starting out' 
      };
    } else if (percentageScore >= 80 && quizResults.some(r => r.difficulty === 'advanced')) {
      // High score with some advanced quizzes
      return { 
        level: 'advanced', 
        icon: <FaTrophy />, 
        description: 'Market master' 
      };
    } else if (percentageScore >= 70) {
      // Good score or has taken advanced quizzes
      return { 
        level: 'intermediate', 
        icon: <FaGraduationCap />, 
        description: 'Sharpening your skills' 
      };
    } else {
      return { 
        level: 'beginner', 
        icon: <FaStar />, 
        description: 'Learning the basics' 
      };
    }
  };

  const skillLevel = calculateSkillLevel();
  const performance = calculatePerformance();

  // Group quiz results by category
  const getResultsByCategory = () => {
    const categories = {};
    
    quizResults.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = [];
      }
      categories[result.category].push(result);
    });
    
    return categories;
  };

  const resultsByCategory = getResultsByCategory();

  return (
    <div className="account-page">
      <div className="account-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaEnvelope /> Profile
        </button>
        <button 
          className={`tab-button ${activeTab === 'quiz-results' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz-results')}
        >
          <FaHistory /> Quiz Results
        </button>
      </div>

      {isLoading ? (
        <div className='loading-spinner' />
      ) : (
        <div className="account-content">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="profile-card">
                <img src={accountIcon} alt="Profile" className="profile-avatar" />
                <div className="profile-info">
                  <h2>My Profile</h2>
                  {userEmail ? (
                    <p className="user-email"><FaEnvelope /> {userEmail}</p>
                  ) : (
                    <p className="user-email">No user info available.</p>
                  )}
                  
                  <div className={`skill-level-badge ${skillLevel.level}`}>
                    <span className="skill-icon">{skillLevel.icon}</span>
                    <div className="skill-details">
                      <span className="skill-level-text">{skillLevel.level.charAt(0).toUpperCase() + skillLevel.level.slice(1)} Trader</span>
                      <span className="skill-description">{skillLevel.description}</span>
                    </div>
                  </div>
                  
                  <div className="profile-stats">
                    <div className="stat-card">
                      <span className="stat-value">{performance.total}</span>
                      <span className="stat-label">Quizzes Taken</span>
                    </div>
                    <div className="stat-card">
                      <span className="stat-value">{performance.average}%</span>
                      <span className="stat-label">Avg. Score</span>
                    </div>
                  </div>
                  
                  <div className="profile-actions">
                    <button className="action-button primary">
                      <FaEnvelope /> Update Email
                    </button>
                    <button className="action-button secondary" onClick={handleSignOut}>
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quiz-results' && (
            <div className="quiz-results-section">
              <h2>Quiz Results</h2>
              
              {quizResults.length === 0 ? (
                <div className="no-results">
                  <p>You haven't taken any quizzes yet.</p>
                  <button className="action-button primary" onClick={() => navigate('/quiz')}>
                    Take a Quiz
                  </button>
                </div>
              ) : (
                <>
                  <div className="results-summary">
                    <p>You've completed <strong>{performance.total}</strong> quizzes with an average score of <strong>{performance.average}%</strong>.</p>
                  </div>
                  
                  {Object.keys(resultsByCategory).map(category => (
                    <div key={category} className="category-results">
                      <h3>{category}</h3>
                      <div className="results-table-container">
                        <table className="results-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Quiz Type</th>
                              <th>Score</th>
                              <th>Difficulty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {resultsByCategory[category].map((result, index) => (
                              <tr key={index}>
                                <td>{formatDate(result.date)}</td>
                                <td>
                                  {result.quiz_type === 'video' 
                                    ? `Video: ${result.video_name || 'Unnamed'}` 
                                    : `Topic Quiz: ${result.category || 'Unnamed'}`
                                  }
                                </td>
                                <td>
                                  <span className={`score-badge ${(result.score / result.total_questions) >= 0.7 ? 'good' : 'needs-work'}`}>
                                    {result.score}/{result.total_questions} ({((result.score / result.total_questions) * 100).toFixed(0)}%)
                                  </span>
                                </td>
                                <td>{result.difficulty.charAt(0).toUpperCase() + result.difficulty.slice(1)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Account;
