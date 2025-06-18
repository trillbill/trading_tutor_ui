import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from './AuthContext';

const TradingProfileContext = createContext();

export const useTradingProfile = () => {
  const context = useContext(TradingProfileContext);
  if (!context) {
    throw new Error('useTradingProfile must be used within a TradingProfileProvider');
  }
  return context;
};

export const TradingProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch trading profile
  const fetchProfile = async () => {
    if (!isAuthenticated || loading) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/onboarding/profile');
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Error fetching trading profile:', error);
      setError(error.response?.data?.error || 'Failed to load trading profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Check onboarding status
  const checkOnboardingStatus = async () => {
    if (!isAuthenticated) return null;
    
    try {
      const response = await api.get('/api/onboarding/status');
      return response.data;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return null;
    }
  };

  // Generate AI context string from profile
  const getAIContextString = () => {
    if (!profile) return '';

    const contextParts = [];

    // Basic info
    if (profile.experience_level) {
      contextParts.push(`Experience: ${profile.experience_level}`);
    }
    
    if (profile.account_size) {
      contextParts.push(`Account size: ${profile.account_size}`);
    }

    if (profile.years_experience) {
      contextParts.push(`Years trading: ${profile.years_experience}`);
    }

    // Trading style
    if (profile.trading_style) {
      contextParts.push(`Trading style: ${profile.trading_style.replace('_', ' ')}`);
    }

    if (profile.preferred_timeframes && profile.preferred_timeframes.length > 0) {
      contextParts.push(`Preferred timeframes: ${profile.preferred_timeframes.join(', ')}`);
    }

    if (profile.markets && profile.markets.length > 0) {
      contextParts.push(`Markets of interest: ${profile.markets.join(', ')}`);
    }

    // Risk management
    if (profile.risk_appetite) {
      const riskLevel = profile.risk_appetite <= 3 ? 'conservative' : 
                       profile.risk_appetite <= 6 ? 'moderate' : 'aggressive';
      contextParts.push(`Risk tolerance: ${riskLevel} (${profile.risk_appetite}/10)`);
    }

    if (profile.risk_per_trade) {
      contextParts.push(`Max risk per trade: ${profile.risk_per_trade}%`);
    }

    if (profile.risk_reward_ratio) {
      contextParts.push(`Target risk-reward ratio: 1:${profile.risk_reward_ratio}`);
    }

    if (profile.daily_loss_limit) {
      contextParts.push(`Daily loss limit: ${profile.daily_loss_limit}%`);
    }

    // Goals and preferences
    if (profile.primary_goal) {
      contextParts.push(`Primary goal: ${profile.primary_goal.replace('_', ' ')}`);
    }

    if (profile.monthly_target) {
      contextParts.push(`Monthly return target: ${profile.monthly_target}%`);
    }

    if (profile.trading_frequency) {
      contextParts.push(`Trading frequency: ${profile.trading_frequency.replace('_', ' ')}`);
    }

    if (profile.analysis_style) {
      contextParts.push(`Analysis approach: ${profile.analysis_style}`);
    }

    if (profile.learning_preference) {
      contextParts.push(`Learning preference: ${profile.learning_preference}`);
    }

    if (profile.loss_reaction) {
      contextParts.push(`Typical loss reaction: ${profile.loss_reaction.replace('_', ' ')}`);
    }

    return contextParts.length > 0 
      ? `User's Trading Profile: ${contextParts.join('; ')}.`
      : '';
  };

  // Fetch profile when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !hasInitialized && !loading) {
      setHasInitialized(true);
      fetchProfile();
    } else if (!isAuthenticated) {
      setProfile(null);
      setHasInitialized(false);
    }
  }, [isAuthenticated, hasInitialized, loading]);

  const value = {
    profile,
    loading,
    error,
    fetchProfile,
    checkOnboardingStatus,
    getAIContextString,
    hasProfile: !!profile
  };

  return (
    <TradingProfileContext.Provider value={value}>
      {children}
    </TradingProfileContext.Provider>
  );
}; 