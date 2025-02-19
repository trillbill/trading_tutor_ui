import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Account.css';

function Account({ setIsAuthenticated }) {
  const [solanaAddress, setSolanaAddress] = useState('');
  const [walletHoldings, setWalletHoldings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  // New state to control how many holdings are visible
  const [visibleHoldingsCount, setVisibleHoldingsCount] = useState(9);

  const navigate = useNavigate();
  // Retrieve the user's email and id from localStorage
  const userEmail = localStorage.getItem('userEmail');
  const userId = localStorage.getItem('userId');

  // API Endpoint
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT

  // On component mount, load the solana address and cached wallet holdings (if available)
  useEffect(() => {
    let storedSolanaAddress = localStorage.getItem('solanaAddress');
    // Check if the stored address is valid.
    if (!storedSolanaAddress || storedSolanaAddress === "null") {
      // If no valid address is stored, enable editing
      setIsEditing(true);
      setSolanaAddress('');
    } else {
      // Use the stored value and fetch associated wallet holdings
      setSolanaAddress(storedSolanaAddress);
      setIsEditing(false);
      // Attempt to load cached wallet holdings if available
      const storedHoldings = localStorage.getItem('walletHoldings');
      if (storedHoldings) {
        try {
          setWalletHoldings(JSON.parse(storedHoldings));
        } catch (error) {
          console.error('Error parsing cached wallet holdings:', error);
          fetchWalletHoldings(storedSolanaAddress);
        }
      } else {
        // If no cached holdings, call API to fetch them
        fetchWalletHoldings(storedSolanaAddress);
      }
    }
  }, []);

  const handleSignOut = () => {
    // Remove token, email, solana address, and wallet holdings from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('solanaAddress');
    localStorage.removeItem('walletHoldings');
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Fetch wallet holdings from the API and cache the data in localStorage
  const fetchWalletHoldings = async (address) => {
    try {
      const response = await axios.post(`${API_ENDPOINT}api/wallet/holdings`, {
        solanaAddress: address,
      });
      setWalletHoldings(response.data.holdings);
      localStorage.setItem('walletHoldings', JSON.stringify(response.data.holdings));
    } catch (error) {
      console.error('Error fetching wallet holdings:', error);
    }
  };

  // Save the new solana address and fetch wallet holdings from the API
  const handleSolanaSubmit = async () => {
    try {
      // Update the user's solana_address in your database
      await axios.put(
        `${API_ENDPOINT}api/account/update`,
        { solana_address: solanaAddress, userId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      // After a successful update, fetch and cache the wallet holdings
      await fetchWalletHoldings(solanaAddress);
      localStorage.setItem('solanaAddress', solanaAddress);
      setIsEditing(false);
      // Reset visible holdings count on update
      setVisibleHoldingsCount(9);
    } catch (error) {
      console.error('Error updating solana address or fetching wallet holdings:', error);
    }
  };

  // Refresh wallet holdings on demand
  const handleRefreshHoldings = async () => {
    if (solanaAddress) {
      await fetchWalletHoldings(solanaAddress);
      // Reset visible holdings count when data is refreshed
      setVisibleHoldingsCount(9);
    }
  };

  // Analysis function remains unchanged
  const analyzeChart = async (index) => {
    const holding = walletHoldings[index];
    const updatedHoldings = [...walletHoldings];
    updatedHoldings[index] = { ...holding, loadingAnalysis: true, analysis: null };
    setWalletHoldings(updatedHoldings);

    const defaultPrompt =
      "Please analyze this price chart and provide insights on bullish or bearish momentum, any technical indicators (RSI, MACD, volume, price levels, etc.), and suggestions for trading.";

    try {
      const screenshotResponse = await axios.post(
        `${API_ENDPOINT}api/image/screenshot`,
        { url: holding.dexscreenerChartUrl },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const rawScreenshotBase64 = screenshotResponse.data.screenshot;
      const imageDataUrl = `data:image/png;base64,${rawScreenshotBase64}`;
      const payload = {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: defaultPrompt },
              { type: "image_data", image_data: imageDataUrl },
            ],
          },
        ],
        store: true,
      };

      const response = await axios.post(
        `${API_ENDPOINT}api/chat/completions`,
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      const aiResponse = response.data.choices[0].message.content;
      updatedHoldings[index] = { ...holding, analysis: aiResponse, loadingAnalysis: false };
      setWalletHoldings(updatedHoldings);
    } catch (error) {
      console.error('Error analyzing chart: ', error);
      updatedHoldings[index] = { ...holding, analysis: "Error analyzing chart", loadingAnalysis: false };
      setWalletHoldings(updatedHoldings);
    }
  };

  return (
    <div className="account-container">
      {/* Profile Header */}
      <div className="profile-header">
        <svg
          className="profile-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
        {userEmail ? (
          <p className="user-email">{userEmail}</p>
        ) : (
          <p className="user-email">No user info available.</p>
        )}
        <button
          className="update-email-button"
          onClick={() => alert('Update Email functionality here')}
        >
          Update Email
        </button>
        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <h2>Your Solana Wallet</h2>
      {/* Solana Address Section */}
      {isEditing ? (
        <div className="solana-input-container">
          <input
            type="text"
            placeholder="Enter your Solana address"
            value={solanaAddress}
            onChange={(e) => setSolanaAddress(e.target.value)}
            className="solana-input"
          />
          <button onClick={handleSolanaSubmit} className="solana-submit">
            Submit
          </button>
        </div>
      ) : (
        <div className="solana-address-container">
          <span
            className="solana-address-display clickable"
            onClick={() => setIsEditing(true)}
          >
            {solanaAddress}
          </span>
        </div>
      )}

      {/* Wallet Holdings Section */}
      {solanaAddress && solanaAddress !== 'null' && (
        <div className="wallet-holdings">
          {/* Refresh button to update wallet holdings */}
          <button
            onClick={handleRefreshHoldings}
            className="solana-submit"
            style={{ marginBottom: '15px' }}
          >
            Refresh
          </button>
          {walletHoldings.length > 0 ? (
            <>
              <div className="holdings-list">
                {walletHoldings.slice(0, visibleHoldingsCount).map((holding, index) => (
                  <div key={index} className="holding-card">
                    <h3>{holding.baseToken.symbol}</h3>
                    <p>
                      Balance: {Number(holding.balance).toLocaleString()} (
                      {(Number(holding.balance) * Number(holding.price))
                        .toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      )
                    </p>
                    {holding.dexscreenerChartUrl && (
                      <iframe
                        src={holding.dexscreenerChartUrl}
                        style={{ width: '400px', height: '500px' }}
                        title={`Chart for ${holding.coin}`}
                      ></iframe>
                    )}
                    <button onClick={() => analyzeChart(index)} className="analyze-button">
                      Analyze
                    </button>
                    {holding.loadingAnalysis && <p>Loading analysis...</p>}
                    {holding.analysis && (
                      <div
                        className="analysis-result"
                        dangerouslySetInnerHTML={{ __html: holding.analysis }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              {walletHoldings.length > visibleHoldingsCount && (
                <button
                  onClick={() => setVisibleHoldingsCount(visibleHoldingsCount + 9)}
                  className="load-more-button"
                >
                  Load More
                </button>
              )}
            </>
          ) : (
            <p>No wallet holdings found. Please ensure your Solana address is correct.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Account;
