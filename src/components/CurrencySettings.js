import React, { useState } from 'react';
import { getCurrencyOptions } from '../utils/currencyUtils';
import { useCurrency } from '../context/CurrencyContext';
import { useTradingProfile } from '../context/TradingProfileContext';
import api from '../api/api';
import './CurrencySettings.css';

const CurrencySettings = () => {
  const { currency, setCurrency } = useCurrency();
  const { fetchProfile } = useTradingProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCurrencyChange = async (newCurrency) => {
    if (newCurrency === currency) return;

    setIsLoading(true);
    setMessage('');

    try {
      // Update the currency in the backend
      await api.post('/api/onboarding/update-currency', {
        preferred_currency: newCurrency
      });

      // Update local state
      setCurrency(newCurrency);
      
      // Refresh the trading profile
      await fetchProfile();
      
      setMessage('Currency preference updated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating currency:', error);
      setMessage('Failed to update currency preference. Please try again.');
      
      // Clear error message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="currency-settings">
      <h3>Currency Preference</h3>
      <p className="currency-description">
        Choose your preferred currency for displaying monetary values throughout the app.
      </p>
      
      <div className="currency-options">
        {getCurrencyOptions().map(option => (
          <label key={option.value} className="currency-option">
            <input
              type="radio"
              name="currency"
              value={option.value}
              checked={currency === option.value}
              onChange={() => handleCurrencyChange(option.value)}
              disabled={isLoading}
            />
            <span className="currency-label">{option.label}</span>
          </label>
        ))}
      </div>
      
      {message && (
        <div className={`currency-message ${message.includes('Failed') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      
      {isLoading && (
        <div className="currency-loading">
          Updating currency preference...
        </div>
      )}
    </div>
  );
};

export default CurrencySettings; 