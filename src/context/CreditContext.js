import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/api';

const CreditContext = createContext();

export const useCredit = () => {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCredit must be used within a CreditProvider');
  }
  return context;
};

export const CreditProvider = ({ children }) => {
  const [creditBalance, setCreditBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Fetch credit balance
  const fetchCreditBalance = async () => {
    if (!isAuthenticated) {
      setCreditBalance(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/api/credits/balance');
      if (response.data.success) {
        setCreditBalance(response.data.credits);
      }
    } catch (error) {
      console.error('Error fetching credit balance:', error);
      setCreditBalance(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh credits (can be called after credit consumption)
  const refreshCredits = () => {
    fetchCreditBalance();
  };

  // Consume credits (optimistic update + API call)
  const consumeCredits = async (amount, action) => {
    try {
      // Optimistic update
      if (creditBalance) {
        setCreditBalance(prev => ({
          ...prev,
          current: Math.max(0, prev.current - amount)
        }));
      }
      
      // The actual consumption will happen in the API call
      // This is just for UI responsiveness
    } catch (error) {
      console.error('Error in optimistic credit update:', error);
      // Refresh to get the real balance
      fetchCreditBalance();
    }
  };

  // Initialize credit balance when user authenticates
  useEffect(() => {
    fetchCreditBalance();
  }, [isAuthenticated, user]);

  const value = {
    creditBalance,
    loading,
    fetchCreditBalance,
    refreshCredits,
    consumeCredits
  };

  return (
    <CreditContext.Provider value={value}>
      {children}
    </CreditContext.Provider>
  );
};
