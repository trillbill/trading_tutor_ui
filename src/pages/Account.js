import React, { useState, useEffect, useRef } from 'react';
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
  const [activeTab, setActiveTab] = useState('journal');
  const [error, setError] = useState(null);
  
  // Add state for email update modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailUpdateMessage, setEmailUpdateMessage] = useState('');
  const [emailUpdateError, setEmailUpdateError] = useState('');
  const [emailUpdateLoading, setEmailUpdateLoading] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  // Add this state for journal stats
  const [journalStats, setJournalStats] = useState({
    total: 0,
    winRate: 0,
    totalProfit: 0
  });

  // Create a ref to store the update function
  const journalStatsUpdaterRef = useRef((stats) => {
    setJournalStats(stats);
  });

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
    <div className="account-dashboard">
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {/* Clean Profile Header - No Background */}
          <div className="clean-profile-header">
            <img src={accountIcon} alt="Profile" className="profile-avatar" />
            <h2 className="profile-name">{username}</h2>
            <p className="profile-email">{userEmail}</p>
            <div className="profile-actions">
              <button className="action-button primary" onClick={() => setShowEmailModal(true)}>
                <FaEnvelope /> Update Email
              </button>
              <button className="action-button secondary" onClick={handleSignOut}>
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          </div>

          {/* Section Selector Cards */}
          <div className="section-cards">
            <div 
              className={`section-card ${activeTab === 'journal' ? 'active' : ''}`}
              onClick={() => setActiveTab('journal')}
            >
              <div className="card-header">
                <div className="card-icon"><FaBook /></div>
                <h3>Trading Journal</h3>
              </div>
              <div className="card-stats">
                <div className="card-stat">
                  <span className="stat-value">{journalStats.total}</span>
                  <span className="stat-label">Trades</span>
                </div>
                <div className="card-stat">
                  <span className="stat-value">{journalStats.winRate}%</span>
                  <span className="stat-label">Win Rate</span>
                </div>
              </div>
            </div>

            <div 
              className={`section-card ${activeTab === 'quiz-results' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz-results')}
            >
              <div className="card-header">
                <div className="card-icon"><FaHistory /></div>
                <h3>Quiz Results</h3>
              </div>
              <div className="card-stats">
                <div className="card-stat">
                  <span className="stat-value">{performance.total || 0}</span>
                  <span className="stat-label">Quizzes</span>
                </div>
                <div className="card-stat">
                  <span className="stat-value">{performance.average || 0}%</span>
                  <span className="stat-label">Avg. Score</span>
                </div>
              </div>
            </div>

            <div 
              className={`section-card ${activeTab === 'risk-profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('risk-profile')}
            >
              <div className="card-header">
                <div className="card-icon"><FaChartBar /></div>
                <h3>Risk Profile</h3>
              </div>
              <div className="card-stats">
                {profileData?.user?.risk_appetite > 0 ? (
                  <>
                    <div className="card-stat">
                      <span className="stat-value">
                        {profileData.user.risk_appetite}/10
                      </span>
                      <span className="stat-label">Risk Appetite</span>
                    </div>
                    <div className="card-stat">
                      <span className="stat-value">
                        {profileData.user.risk_appetite <= 3 ? 'Conservative' : 
                         profileData.user.risk_appetite <= 6 ? 'Moderate' : 'Aggressive'}
                      </span>
                      <span className="stat-label">Profile</span>
                    </div>
                  </>
                ) : (
                  <div className="card-stat full-width">
                    <span className="stat-value">Not Set</span>
                    <span className="stat-label">Take the Risk Quiz</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section Content */}
          <div className="section-content">
            {activeTab === 'journal' && (
              <TradingJournal onStatsUpdate={journalStatsUpdaterRef.current} />
            )}

            {activeTab === 'quiz-results' && (
              <div className="quiz-results-section">            
                {!profileData?.quizResults || profileData.quizResults.length === 0 ? (
                  <div className="no-results">
                    <h3>You haven't taken any quizzes yet</h3>
                    <p>Take your first quiz to get started</p>
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
                    <div className="risk-profile-header">
                      <h3>Your Risk Profile</h3>
                      <p>This profile helps us tailor trading recommendations to your risk tolerance.</p>
                    </div>
                    
                    <RiskAppetiteBadge riskAppetite={profileData.user.risk_appetite} />
                    
                    {profileData.user.risk_appetite <= 3 ? (
                      <div className="risk-description-card conservative">
                        <h4>Conservative Investor</h4>
                        <p>You prefer stability and security over high returns. Your trading strategies should focus on:</p>
                        <ul>
                          <li>Blue-chip assets</li>
                          <li>Government and high-grade corporate bonds</li>
                          <li>ETFs that track major indices</li>
                          <li>Longer-term positions with less frequent trading</li>
                        </ul>
                      </div>
                    ) : profileData.user.risk_appetite <= 6 ? (
                      <div className="risk-description-card moderate">
                        <h4>Moderate Investor</h4>
                        <p>You seek a balance between growth and security. Your trading strategies may include:</p>
                        <ul>
                          <li>A mix of growth and value assets</li>
                          <li>Some exposure to more volatile markets</li>
                          <li>Moderate position sizing</li>
                          <li>A combination of short and long-term positions</li>
                        </ul>
                      </div>
                    ) : (
                      <div className="risk-description-card aggressive">
                        <h4>Aggressive Investor</h4>
                        <p>You prioritize growth potential and are comfortable with volatility. Your trading strategies might include:</p>
                        <ul>
                          <li>Growth assets and volatile markets</li>
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
                  <div className="no-results">
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
          </div>
          
          {/* Keep your existing Email Update Modal */}
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
                      <button 
                        className="action-button primary"
                        onClick={closeEmailModal}
                      >
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
        </>
      )}
    </div>
  );
}

export default Account;