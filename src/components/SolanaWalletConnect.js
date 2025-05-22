import React, { useState } from 'react';
import { FaWallet, FaCheck, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import api from '../api/api';
import './SolanaWalletConnect.css';

const SolanaWalletConnect = ({ onTradesImported, currentWalletAddress, onWalletUpdate }) => {
  const [walletAddress, setWalletAddress] = useState(currentWalletAddress || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [importPeriod, setImportPeriod] = useState('30'); // Default to 30 days

  const handleWalletConnect = async (e) => {
    e.preventDefault();
    
    if (!walletAddress || walletAddress.trim() === '') {
      setError('Please enter a valid Solana wallet address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Save the wallet address to user profile
      await api.post('/api/wallet/wallet', { solanaAddress: walletAddress });
      
      // Update parent component with new wallet address
      if (onWalletUpdate) {
        onWalletUpdate(walletAddress);
      }
      
      setSuccess('Wallet connected successfully!');
      setShowImportOptions(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError('Failed to connect wallet: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportTrades = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Call API to import trades from the connected wallet
      const response = await api.post('/api/journal/import-from-wallet', { 
        days: parseInt(importPeriod, 10) 
      });
      
      // Notify parent component about imported trades
      if (onTradesImported) {
        onTradesImported(response.data.importedTrades);
      }
      
      setSuccess(`Successfully imported ${response.data.importedTrades.length} trades!`);
      setShowImportOptions(false);
    } catch (error) {
      console.error('Error importing trades:', error);
      setError('Failed to import trades: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="solana-wallet-connect">
      <h3 className="wallet-title">
        <FaWallet className="wallet-icon" /> Solana Wallet Integration
      </h3>
      
      {!showImportOptions ? (
        <form onSubmit={handleWalletConnect} className="wallet-form">
          <div className="form-group">
            <label htmlFor="walletAddress">Solana Wallet Address</label>
            <input
              type="text"
              id="walletAddress"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your Solana wallet address"
              className="wallet-input"
            />
          </div>
          
          {error && <div className="wallet-error"><FaExclamationTriangle /> {error}</div>}
          {success && <div className="wallet-success"><FaCheck /> {success}</div>}
          
          <button 
            type="submit" 
            className="wallet-button"
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="spinner" /> : 'Connect Wallet'}
          </button>
        </form>
      ) : (
        <div className="import-options">
          <p>Import trade history from your connected wallet:</p>
          
          <div className="form-group">
            <label htmlFor="importPeriod">Import Period</label>
            <select
              id="importPeriod"
              value={importPeriod}
              onChange={(e) => setImportPeriod(e.target.value)}
              className="period-select"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="180">Last 6 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
          
          {error && <div className="wallet-error"><FaExclamationTriangle /> {error}</div>}
          {success && <div className="wallet-success"><FaCheck /> {success}</div>}
          
          <div className="button-group">
            <button 
              type="button" 
              className="wallet-button secondary"
              onClick={() => setShowImportOptions(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            
            <button 
              type="button" 
              className="wallet-button primary"
              onClick={handleImportTrades}
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="spinner" /> : 'Import Trades'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolanaWalletConnect;
