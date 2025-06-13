import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTradingProfile } from './TradingProfileContext';
import { formatCurrency as formatCurrencyUtil, getCurrencySymbol } from '../utils/currencyUtils';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const { profile } = useTradingProfile();

  // Update currency when trading profile changes
  useEffect(() => {
    if (profile?.preferred_currency) {
      setCurrency(profile.preferred_currency);
    }
  }, [profile]);

  // Format currency with user's preferred currency
  const formatCurrency = (value, options = {}) => {
    return formatCurrencyUtil(value, currency, options);
  };

  // Get current currency symbol
  const currencySymbol = getCurrencySymbol(currency);

  const value = {
    currency,
    setCurrency,
    formatCurrency,
    currencySymbol
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}; 