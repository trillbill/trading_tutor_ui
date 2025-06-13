import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaUser, FaCog, FaCheckCircle } from 'react-icons/fa';
import api from '../api/api';
import { useTradingProfile } from '../context/TradingProfileContext';
import { scrollToTop } from '../utils/scrollUtils';
import { getCurrencyOptions } from '../utils/currencyUtils';
import './OnboardingFlow.css';

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isProfileUpdate, setIsProfileUpdate] = useState(false);
  const navigate = useNavigate();
  const { fetchProfile } = useTradingProfile();

  // Form data for each step
  const [basicInfo, setBasicInfo] = useState({
    trading_experience: '',
    account_size_range: '',
    markets_interested: [],
    primary_goal: '',
    preferred_currency: 'USD'
  });

  const [tradingStyle, setTradingStyle] = useState({
    trading_style: '',
    preferred_timeframes: [],
    trading_frequency: '',
    analysis_approach: '',
    learning_preference: ''
  });

  const [riskManagement, setRiskManagement] = useState({
    max_risk_per_trade: 2,
    risk_reward_ratio: 2,
    max_daily_loss_limit: 5,
    monthly_return_target: 5,
    previous_losses_reaction: ''
  });

  const steps = [
    {
      number: 1,
      title: "Basic Information",
      icon: <FaUser />,
      description: "Tell us about your trading background"
    },
    {
      number: 2,
      title: "Trading Style",
      icon: <FaChartLine />,
      description: "Define your trading preferences"
    },
    {
      number: 3,
      title: "Risk Management",
      icon: <FaCog />,
      description: "Set your risk parameters"
    }
  ];

  // Check if user should be in onboarding - load existing data if updating profile
  useEffect(() => {
    const checkStatusAndLoadData = async () => {
      try {
        const response = await api.get('/api/onboarding/status');
        
        // If user has completed onboarding, they're updating their profile
        // Load their existing data instead of redirecting them away
        if (response.data.onboarding_completed) {
          console.log('User is updating their trading profile');
          setIsProfileUpdate(true);
          await loadExistingProfile();
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkStatusAndLoadData();
  }, []); // Only run once on mount

  // Load existing profile data for users updating their profile
  const loadExistingProfile = async () => {
    try {
      const response = await api.get('/api/onboarding/profile');
      if (response.data.success && response.data.raw_profile) {
        const profile = response.data.raw_profile;
        
        // Load basic info
        setBasicInfo({
          trading_experience: profile.trading_experience || '',
          account_size_range: profile.account_size_range || '',
          markets_interested: profile.markets_interested || [],
          primary_goal: profile.primary_goal || '',
          preferred_currency: profile.preferred_currency || 'USD'
        });
        
        // Load trading style
        setTradingStyle({
          trading_style: profile.trading_style || '',
          preferred_timeframes: profile.preferred_timeframes || [],
          trading_frequency: profile.trading_frequency || '',
          analysis_approach: profile.analysis_approach || '',
          learning_preference: profile.learning_preference || ''
        });
        
        // Load risk management
        setRiskManagement({
          max_risk_per_trade: profile.max_risk_per_trade || 2,
          risk_reward_ratio: profile.risk_reward_ratio || 2,
          max_daily_loss_limit: profile.max_daily_loss_limit || 5,
          monthly_return_target: profile.monthly_return_target || 5,
          previous_losses_reaction: profile.previous_losses_reaction || ''
        });
        
        // Mark all steps as completed since they're updating
        setCompletedSteps(new Set([1, 2, 3]));
      }
    } catch (error) {
      console.error('Error loading existing profile:', error);
      // If we can't load existing data, just let them start fresh
    }
  };

  // Scroll to top when step changes
  useEffect(() => {
    // Add a small delay to ensure the DOM has updated
    const timer = setTimeout(() => {
      scrollToTop();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleBasicInfoSubmit = async () => {
    try {
      setIsSubmitting(true);
      await api.post('/api/onboarding/basic-info', basicInfo);
      setCompletedSteps(prev => new Set([...prev, 1]));
      setCurrentStep(2);
      // Scroll will happen via useEffect
    } catch (error) {
      console.error('Error saving basic info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTradingStyleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await api.post('/api/onboarding/trading-style', tradingStyle);
      setCompletedSteps(prev => new Set([...prev, 2]));
      setCurrentStep(3);
      // Scroll will happen via useEffect
    } catch (error) {
      console.error('Error saving trading style:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRiskManagementSubmit = async () => {
    try {
      setIsSubmitting(true);
      await api.post('/api/onboarding/risk-management', riskManagement);
      setCompletedSteps(prev => new Set([...prev, 3]));
      // Complete onboarding after risk management step
      completeOnboarding();
    } catch (error) {
      console.error('Error saving risk management:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      setIsSubmitting(true);
      
      // Check if this is an update or initial onboarding
      const statusResponse = await api.get('/api/onboarding/status');
      const isUpdate = statusResponse.data.onboarding_completed;
      
      // Mark onboarding as complete (this is idempotent for updates)
      await api.post('/api/onboarding/complete');
      
      // Refresh the trading profile context
      await fetchProfile();
      
      // Navigate with appropriate messaging
      if (isUpdate) {
        navigate('/account', { 
          replace: true,
          state: { 
            showProfileUpdateSuccess: true 
          } 
        });
      } else {
        navigate('/dashboard', { 
          replace: true,
          state: { 
            showWelcome: true 
          } 
        });
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArrayToggle = (array, value, setter) => {
    setter(prev => ({
      ...prev,
      [array]: prev[array].includes(value)
        ? prev[array].filter(item => item !== value)
        : [...prev[array], value]
    }));
  };

  const renderBasicInfo = () => (
    <div className="onboarding-step">
      <h2>Tell us about your trading background</h2>
      
      <div className="form-group">
        <label>What's your trading experience level?</label>
        <div className="radio-group">
          {[
            { value: 'beginner', label: 'Beginner (Less than 1 year)' },
            { value: 'intermediate', label: 'Intermediate (1-3 years)' },
            { value: 'advanced', label: 'Advanced (3+ years)' }
          ].map(option => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="trading_experience"
                value={option.value}
                checked={basicInfo.trading_experience === option.value}
                onChange={(e) => setBasicInfo(prev => ({ ...prev, trading_experience: e.target.value }))}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>What's your account size range?</label>
        <div className="radio-group">
          {[
            { value: '0-1k', label: '$0 - $1,000' },
            { value: '1k-10k', label: '$1,000 - $10,000' },
            { value: '10k-50k', label: '$10,000 - $50,000' },
            { value: '50k-100k', label: '$50,000 - $100,000' },
            { value: '100k+', label: '$100,000+' }
          ].map(option => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="account_size_range"
                value={option.value}
                checked={basicInfo.account_size_range === option.value}
                onChange={(e) => setBasicInfo(prev => ({ ...prev, account_size_range: e.target.value }))}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Which markets are you interested in? (Select all that apply)</label>
        <div className="checkbox-group">
          {[
            { value: 'stocks', label: 'Stocks' },
            { value: 'crypto', label: 'Cryptocurrency' },
            { value: 'forex', label: 'Forex' },
            { value: 'commodities', label: 'Commodities' },
            { value: 'options', label: 'Options' }
          ].map(option => (
            <label key={option.value} className="checkbox-option">
              <input
                type="checkbox"
                checked={basicInfo.markets_interested.includes(option.value)}
                onChange={() => handleArrayToggle('markets_interested', option.value, setBasicInfo)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>What's your primary trading goal?</label>
        <div className="radio-group">
          {[
            { value: 'learning', label: 'Learning and skill development' },
            { value: 'capital_preservation', label: 'Capital preservation with modest gains' },
            { value: 'steady_income', label: 'Generate steady income' },
            { value: 'aggressive_growth', label: 'Aggressive growth and wealth building' }
          ].map(option => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="primary_goal"
                value={option.value}
                checked={basicInfo.primary_goal === option.value}
                onChange={(e) => setBasicInfo(prev => ({ ...prev, primary_goal: e.target.value }))}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>What's your preferred currency?</label>
        <div className="radio-group">
          {getCurrencyOptions().map(option => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="preferred_currency"
                value={option.value}
                checked={basicInfo.preferred_currency === option.value}
                onChange={(e) => setBasicInfo(prev => ({ ...prev, preferred_currency: e.target.value }))}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <button 
        className="next-button"
        onClick={handleBasicInfoSubmit}
        disabled={!basicInfo.trading_experience || !basicInfo.account_size_range || basicInfo.markets_interested.length === 0 || !basicInfo.primary_goal || isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Next'}
      </button>
    </div>
  );

  const renderTradingStyle = () => (
    <div className="onboarding-step">
      <h2>Define your trading style</h2>

      <div className="form-group">
        <label>What's your preferred trading style?</label>
        <div className="radio-group">
          {[
            { value: 'scalping', label: 'Scalping (seconds to minutes)' },
            { value: 'day_trading', label: 'Day Trading (minutes to hours)' },
            { value: 'swing_trading', label: 'Swing Trading (days to weeks)' },
            { value: 'position_trading', label: 'Position Trading (weeks to months)' }
          ].map(option => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="trading_style"
                value={option.value}
                checked={tradingStyle.trading_style === option.value}
                onChange={(e) => setTradingStyle(prev => ({ ...prev, trading_style: e.target.value }))}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Preferred timeframes? (Select all that apply)</label>
        <div className="checkbox-group">
          {[
            { value: '1m', label: '1 minute' },
            { value: '5m', label: '5 minutes' },
            { value: '15m', label: '15 minutes' },
            { value: '1h', label: '1 hour' },
            { value: '4h', label: '4 hours' },
            { value: '1d', label: '1 day' },
            { value: '1w', label: '1 week' }
          ].map(option => (
            <label key={option.value} className="checkbox-option">
              <input
                type="checkbox"
                checked={tradingStyle.preferred_timeframes.includes(option.value)}
                onChange={() => handleArrayToggle('preferred_timeframes', option.value, setTradingStyle)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>How often do you plan to trade?</label>
        <div className="radio-group">
          {[
            { value: 'multiple_daily', label: 'Multiple times per day' },
            { value: 'daily', label: 'Once per day' },
            { value: 'few_times_week', label: 'A few times per week' },
            { value: 'weekly', label: 'Once per week' },
            { value: 'monthly', label: 'Once per month or less' }
          ].map(option => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="trading_frequency"
                value={option.value}
                checked={tradingStyle.trading_frequency === option.value}
                onChange={(e) => setTradingStyle(prev => ({ ...prev, trading_frequency: e.target.value }))}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>What's your preferred analysis approach?</label>
        <div className="radio-group">
          {[
            { value: 'technical', label: 'Technical Analysis (charts, indicators)' },
            { value: 'fundamental', label: 'Fundamental Analysis (company/economic data)' },
            { value: 'both', label: 'Both Technical and Fundamental' },
            { value: 'sentiment', label: 'Market Sentiment' }
          ].map(option => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="analysis_approach"
                value={option.value}
                checked={tradingStyle.analysis_approach === option.value}
                onChange={(e) => setTradingStyle(prev => ({ ...prev, analysis_approach: e.target.value }))}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>How do you prefer to learn?</label>
        <div className="radio-group">
          {[
            { value: 'video', label: 'Video tutorials' },
            { value: 'reading', label: 'Reading articles/books' },
            { value: 'practice', label: 'Hands-on practice' },
            { value: 'mentorship', label: 'Mentorship and guidance' }
          ].map(option => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="learning_preference"
                value={option.value}
                checked={tradingStyle.learning_preference === option.value}
                onChange={(e) => setTradingStyle(prev => ({ ...prev, learning_preference: e.target.value }))}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="step-buttons">
        <button 
          className="back-button"
          onClick={() => {
            setCurrentStep(1);
            setTimeout(() => scrollToTop(), 50);
          }}
        >
          Back
        </button>
        <button 
          className="next-button"
          onClick={handleTradingStyleSubmit}
          disabled={!tradingStyle.trading_style || tradingStyle.preferred_timeframes.length === 0 || !tradingStyle.trading_frequency || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  );

  const renderRiskManagement = () => (
    <div className="onboarding-step">
      <h2>Set your risk management parameters</h2>

      <div className="form-group">
        <label>Maximum risk per trade (% of account)</label>
        <div className="range-input">
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={riskManagement.max_risk_per_trade}
            onChange={(e) => setRiskManagement(prev => ({ ...prev, max_risk_per_trade: parseFloat(e.target.value) }))}
          />
          <span className="range-value">{riskManagement.max_risk_per_trade}%</span>
        </div>
        <p className="field-description">Most traders risk 1-2% per trade</p>
      </div>

      <div className="form-group">
        <label>Target risk-to-reward ratio</label>
        <div className="range-input">
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={riskManagement.risk_reward_ratio}
            onChange={(e) => setRiskManagement(prev => ({ ...prev, risk_reward_ratio: parseFloat(e.target.value) }))}
          />
          <span className="range-value">1:{riskManagement.risk_reward_ratio}</span>
        </div>
        <p className="field-description">For every $1 risked, aim to make ${riskManagement.risk_reward_ratio}</p>
      </div>

      <div className="form-group">
        <label>Maximum daily loss limit (% of account)</label>
        <div className="range-input">
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={riskManagement.max_daily_loss_limit}
            onChange={(e) => setRiskManagement(prev => ({ ...prev, max_daily_loss_limit: parseFloat(e.target.value) }))}
          />
          <span className="range-value">{riskManagement.max_daily_loss_limit}%</span>
        </div>
        <p className="field-description">Stop trading if you lose this much in a day</p>
      </div>

      <div className="form-group">
        <label>Monthly return target (%)</label>
        <div className="range-input">
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={riskManagement.monthly_return_target}
            onChange={(e) => setRiskManagement(prev => ({ ...prev, monthly_return_target: parseFloat(e.target.value) }))}
          />
          <span className="range-value">{riskManagement.monthly_return_target}%</span>
        </div>
        <p className="field-description">Your target monthly profit goal</p>
      </div>

      <div className="form-group">
        <label>How do you typically react to losses?</label>
        <div className="radio-group">
          {[
            { value: 'panic_sell', label: 'Panic and sell immediately' },
            { value: 'hold_hope', label: 'Hold and hope for recovery' },
            { value: 'cut_losses', label: 'Cut losses according to plan' },
            { value: 'buy_more', label: 'Buy more (average down)' }
          ].map(option => (
            <label key={option.value} className="radio-option">
              <input
                type="radio"
                name="previous_losses_reaction"
                value={option.value}
                checked={riskManagement.previous_losses_reaction === option.value}
                onChange={(e) => setRiskManagement(prev => ({ ...prev, previous_losses_reaction: e.target.value }))}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="step-buttons">
        <button 
          className="back-button"
          onClick={() => {
            setCurrentStep(2);
            setTimeout(() => scrollToTop(), 50);
          }}
        >
          Back
        </button>
        <button 
          className="next-button"
          onClick={handleRiskManagementSubmit}
          disabled={!riskManagement.previous_losses_reaction || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (isProfileUpdate ? 'Update Profile' : 'Complete Setup')}
        </button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderTradingStyle();
      case 3:
        return renderRiskManagement();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <h1>{isProfileUpdate ? 'Update Your Trading Profile' : 'Welcome to Trading Tutor AI'}</h1>
        <p>{isProfileUpdate ? 'Modify your trading preferences and risk settings' : 'Let\'s set up your personalized trading profile'}</p>
      </div>

      <div className="onboarding-progress">
        {steps.map((step) => (
          <div 
            key={step.number}
            className={`progress-step ${
              completedSteps.has(step.number) ? 'completed' : 
              currentStep === step.number ? 'active' : 'pending'
            }`}
          >
            <div className="step-icon">
              {completedSteps.has(step.number) ? <FaCheckCircle /> : step.icon}
            </div>
            <div className="step-info">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="onboarding-content">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default OnboardingFlow; 