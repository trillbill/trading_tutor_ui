import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import './Account.css';
import { FaSignOutAlt, FaEnvelope, FaIdCard, FaHistory, FaStar, FaGraduationCap, FaTrophy, FaShieldAlt, FaBalanceScale, FaChartLine, FaChartBar, FaBook } from 'react-icons/fa';
import accountIcon from '../assets/account-icon-large.png';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/utils';
import TradingJournal from '../components/TradingJournal';

function Account() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState(null);
  
  // Add state for email update modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailUpdateMessage, setEmailUpdateMessage] = useState('');
  const [emailUpdateError, setEmailUpdateError] = useState('');
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await api.get('/api/account/profile');
        if (response.data.success) {
          setProfileData(response.data.profile);
        } else {
          setError('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError(error.response?.data?.error || 'An error occurred while loading your profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Handle email update
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    
    if (!newEmail) {
      setEmailUpdateError('Please enter a new email address');
      return;
    }

    const emailValidation = validateEmail(newEmail);
    if (!emailValidation.isValid) {
      setEmailUpdateError(emailValidation.message);
      return;
    }
    
    try {
      setEmailUpdateLoading(true);
      setEmailUpdateError('');
      setEmailUpdateMessage('');
      
      const response = await api.post('/api/auth/request-email-update', { newEmail });
      
      if (response.data.success) {
        setEmailUpdateMessage(response.data.message);
        setNewEmail('');
        // Keep the modal open to show the success message
      } else {
        setEmailUpdateError(response.data.error || 'Failed to request email update');
      }
    } catch (error) {
      console.error('Email update error:', error);
      setEmailUpdateError(
        error.response?.data?.error || 'An error occurred while requesting email update'
      );
    } finally {
      setEmailUpdateLoading(false);
    }
  };

  // Close modal and reset state
  const closeEmailModal = () => {
    setShowEmailModal(false);
    setNewEmail('');
    setEmailUpdateMessage('');
    setEmailUpdateError('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Group quiz results by category
  const getResultsByCategory = () => {
    if (!profileData?.quizResults || profileData.quizResults.length === 0) {
      return {};
    }
    
    const categories = {};
    
    profileData.quizResults.forEach(result => {
      const category = result.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(result);
    });
    
    return categories;
  };

  const resultsByCategory = getResultsByCategory();

  const RiskAppetiteBadge = ({ riskAppetite }) => {
    // Determine risk level category
    let riskLevel, riskColor;
    
    if (riskAppetite <= 3) {
      riskLevel = "Conservative";
      riskColor = "#4CAF50"; // Green
    } else if (riskAppetite <= 6) {
      riskLevel = "Moderate";
      riskColor = "#2196F3"; // Blue
    } else {
      riskLevel = "Aggressive";
      riskColor = "#F44336"; // Red
    }
    
    return (
      <div className={`risk-level-badge ${riskLevel.toLowerCase()}`}>
        <div className="risk-icon">
          {riskLevel === "Conservative" && <FaShieldAlt />}
          {riskLevel === "Moderate" && <FaBalanceScale />}
          {riskLevel === "Aggressive" && <FaChartLine />}
        </div>
        <div className="risk-details">
          <div className="risk-level-text">{riskLevel} Investor</div>
          <div className="risk-description">
            Risk Appetite: {riskAppetite}/10
          </div>
          <div className="risk-meter">
            <div 
              className="risk-meter-fill" 
              style={{ width: `${riskAppetite * 10}%`, backgroundColor: riskColor }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  // Calculate user's skill level based on performance data
  const getSkillLevelInfo = () => {
    if (!profileData) {
      return { 
        level: 'beginner', 
        icon: <FaStar />, 
        description: 'Just starting out' 
      };
    }
    
    const { performance } = profileData;
    
    if (performance.total < 3) {
      return { 
        level: 'beginner', 
        icon: <FaStar />, 
        description: 'Just starting out' 
      };
    } else if (performance.skillLevel === 'advanced') {
      return { 
        level: 'advanced', 
        icon: <FaTrophy />, 
        description: 'Market master' 
      };
    } else if (performance.skillLevel === 'intermediate') {
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

  const skillLevel = getSkillLevelInfo();

  if (isLoading) {
    return <div className='loading-spinner' />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Extract user data for easier access
  const user = profileData?.user || {};
  const username = user.username || 'Guest';
  const userEmail = user.email || 'No email available';
  const performance = profileData?.performance || { total: 0, average: 0 };

  return (
    <div className="account-page">
      <div className="account-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaIdCard /> <span className="tab-text">Profile</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'quiz-results' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz-results')}
        >
          <FaHistory /> <span className="tab-text">Quiz Results</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'risk-profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('risk-profile')}
        >
          <FaChartBar /> <span className="tab-text">Risk Profile</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'journal' ? 'active' : ''}`}
          onClick={() => setActiveTab('journal')}
        >
          <FaBook /> <span className="tab-text">Trading Journal</span>
        </button>
      </div>

      <div className="account-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="profile-card">
              <img src={accountIcon} alt="Profile" className="profile-avatar" />
              <div className="profile-info">
                <h2>{username}'s Profile</h2>
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
                  <button className="action-button primary" onClick={() => setShowEmailModal(true)}>
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
            {!profileData?.quizResults || profileData.quizResults.length === 0 ? (
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
                            <th>Quiz Title</th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultsByCategory[category].map((result, index) => (
                            <tr key={index}>
                              <td>{formatDate(result.date)}</td>
                              <td>{result.video_name ?  result.video_name : result.category}</td>
                              <td>
                                <span className={`score-badge ${(result.score / result.total_questions) >= 0.7 ? 'good' : 'needs-work'}`}>
                                  {result.score}/{result.total_questions} ({Math.round((result.score / result.total_questions) * 100)}%)
                                </span>
                              </td>
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

        {activeTab === 'risk-profile' && (
          <div className="risk-profile-section">            
            {profileData?.user?.risk_appetite ? (
              <div className="risk-profile-content">
                <RiskAppetiteBadge riskAppetite={user.risk_appetite} />
                
                {user.risk_appetite <= 3 ? (
                  <div className="risk-description-card conservative">
                    <h4>Conservative Investor</h4>
                    <p>You prefer stability and security over high returns. Your trading strategies should focus on:</p>
                    <ul>
                      <li>Blue-chip stocks with stable dividends</li>
                      <li>Government and high-grade corporate bonds</li>
                      <li>ETFs that track major indices</li>
                      <li>Longer-term positions with less frequent trading</li>
                    </ul>
                  </div>
                ) : user.risk_appetite <= 6 ? (
                  <div className="risk-description-card moderate">
                    <h4>Moderate Investor</h4>
                    <p>You seek a balance between growth and security. Your trading strategies may include:</p>
                    <ul>
                      <li>A mix of growth and value stocks</li>
                      <li>Some exposure to international markets</li>
                      <li>Moderate position sizing</li>
                      <li>A combination of short and long-term positions</li>
                    </ul>
                  </div>
                ) : (
                  <div className="risk-description-card aggressive">
                    <h4>Aggressive Investor</h4>
                    <p>You prioritize growth potential and are comfortable with volatility. Your trading strategies might include:</p>
                    <ul>
                      <li>Growth stocks and emerging markets</li>
                      <li>Options trading and leveraged positions</li>
                      <li>Sector rotation and momentum strategies</li>
                      <li>More active trading with shorter holding periods</li>
                    </ul>
                  </div>
                )}
                
                <div className="risk-actions">
                  <button 
                    className="action-button primary" 
                    onClick={() => navigate('/risk-quiz')}
                  >
                    Retake Risk Quiz
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-risk-profile-large">
                <div className="no-risk-icon">
                  <FaChartBar />
                </div>
                <h3>You haven't set your risk profile yet</h3>
                <p>Take our quick risk assessment quiz to receive personalized trading recommendations that match your risk tolerance.</p>
                <button 
                  className="action-button primary" 
                  onClick={() => navigate('/risk-quiz')}
                >
                  Take Risk Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'journal' && (
          <TradingJournal />
        )}
      </div>
      
      {/* Email Update Modal */}
      {showEmailModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Update Email Address</h2>
              <button className="modal-close" onClick={closeEmailModal}>×</button>
            </div>
            
            <div className="modal-body">
              {emailUpdateMessage ? (
                <div className="success-message">
                  <p>{emailUpdateMessage}</p>
                  <button className="action-button primary" onClick={closeEmailModal}>
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEmailUpdate}>
                  <div className="form-group">
                    <label>Current Email</label>
                    <p className="current-email">{userEmail}</p>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="newEmail">New Email Address</label>
                    <input
                      type="email"
                      id="newEmail"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter your new email address"
                      required
                    />
                  </div>
                  
                  {emailUpdateError && (
                    <div className="error-message">{emailUpdateError}</div>
                  )}
                  
                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="action-button secondary"
                      onClick={closeEmailModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="action-button primary"
                      disabled={emailUpdateLoading}
                    >
                      {emailUpdateLoading ? 'Sending...' : 'Send Verification Email'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
