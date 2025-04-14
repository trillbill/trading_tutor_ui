import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSortUp, FaSortDown, FaInfoCircle, FaSort } from 'react-icons/fa';
import api from '../api/api';
import './TradingJournal.css';

function TradingJournal({ onStatsUpdate }) {
  const [journalEntries, setJournalEntries] = useState([]);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalError, setJournalError] = useState('');
  const [journalFormData, setJournalFormData] = useState({
    trade_date: new Date().toISOString().split('T')[0],
    symbol: '',
    trade_type: 'buy',
    entry_price: '',
    exit_price: '',
    quantity: '',
    strategy: '',
    notes: '',
    outcome: 'open',
    profit_loss: ''
  });
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterOutcome, setFilterOutcome] = useState('all');
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  // Ref for tooltip positioning
  const tooltipRef = useRef(null);

  // Add these constants at the top of your component
  const MAX_STRATEGY_LENGTH = 80;
  const MAX_NOTES_LENGTH = 180;

  // Add a ref to store the error timeout
  const errorTimeoutRef = useRef(null);

  // Add a ref to track if we've already updated stats
  const hasUpdatedStats = useRef(false);

  // Create a memoized function to calculate stats
  const calculateStats = useCallback(() => {
    // Calculate win rate
    const closedTrades = journalEntries.filter(entry => entry.outcome !== 'open');
    const wins = journalEntries.filter(entry => entry.outcome === 'win').length;
    const winRate = closedTrades.length ? Math.round((wins / closedTrades.length) * 100) : 0;
    
    // Calculate total profit
    const totalProfit = journalEntries.reduce((sum, entry) => {
      return sum + (parseFloat(entry.profit_loss) || 0);
    }, 0);
    
    return {
      total: journalEntries.length,
      winRate,
      totalProfit
    };
  }, [journalEntries]);

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  // Clear error message after a delay
  useEffect(() => {
    // If there's an error message
    if (journalError) {
      // Clear any existing timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      
      // Set a new timeout to clear the error after 5 seconds (5000ms)
      errorTimeoutRef.current = setTimeout(() => {
        setJournalError('');
      }, 5000);
    }
    
    // Cleanup function to clear the timeout when component unmounts
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [journalError]); // Run this effect whenever journalError changes

  const fetchJournalEntries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/journal');
      if (response.data.success) {
        // Sort entries by created_at in descending order (newest first)
        const sortedEntries = response.data.entries.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setJournalEntries(sortedEntries);
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      setJournalError('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const handleJournalFormChange = (e) => {
    const { name, value } = e.target;
    
    // Apply character limits for strategy and notes fields
    if (name === 'strategy' && value.length > MAX_STRATEGY_LENGTH) {
      return; // Don't update if exceeding limit
    }
    
    if (name === 'notes' && value.length > MAX_NOTES_LENGTH) {
      return; // Don't update if exceeding limit
    }
    
    setJournalFormData({
      ...journalFormData,
      [name]: value
    });
  };

  const handleJournalSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of the form data to modify before sending
      const formDataToSubmit = { ...journalFormData };
      
      // Handle empty numeric fields - convert empty strings to null
      // This prevents the "invalid input syntax for type numeric" error
      if (formDataToSubmit.profit_loss === '') {
        formDataToSubmit.profit_loss = null;
      }
      
      if (formDataToSubmit.exit_price === '') {
        formDataToSubmit.exit_price = null;
      }
      
      // For open trades, ensure profit_loss is null
      if (formDataToSubmit.outcome === 'open') {
        formDataToSubmit.profit_loss = null;
      }
      
      const response = editingEntryId
        ? await api.put(`/api/journal/${editingEntryId}`, formDataToSubmit)
        : await api.post('/api/journal', formDataToSubmit);

      if (response.data.success) {
        setShowJournalModal(false);
        fetchJournalEntries();
        resetForm();
      }
    } catch (error) {
      console.error('Error adding journal entry:', error);
      setJournalError('Failed to save journal entry: ' + 
        (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await api.delete(`/api/journal/${id}`);
        if (response.data.success) {
          fetchJournalEntries();
        }
      } catch (error) {
        setJournalError('Failed to delete entry');
      }
    }
  };

  const openJournalModal = (entry = null) => {
    if (entry) {
      setJournalFormData({
        trade_date: entry.trade_date.split('T')[0],
        symbol: entry.symbol,
        trade_type: entry.trade_type,
        entry_price: entry.entry_price,
        exit_price: entry.exit_price || '',
        quantity: entry.quantity,
        strategy: entry.strategy || '',
        notes: entry.notes || '',
        outcome: entry.outcome,
        profit_loss: entry.profit_loss || ''
      });
      setEditingEntryId(entry.id);
    }
    setShowJournalModal(true);
  };

  const resetForm = () => {
    setJournalFormData({
      trade_date: new Date().toISOString().split('T')[0],
      symbol: '',
      trade_type: 'buy',
      entry_price: '',
      exit_price: '',
      quantity: '',
      strategy: '',
      notes: '',
      outcome: 'open',
      profit_loss: ''
    });
    setEditingEntryId(null);
  };

  const closeJournalModal = () => {
    setShowJournalModal(false);
    resetForm();
  };

  const formatCurrency = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle tooltip display
  const showTooltip = (entryId, type) => {
    setActiveTooltip({ id: entryId, type });
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  // Sort entries based on current sort field and direction
  const getSortedEntries = () => {
    if (!journalEntries.length) return [];
    
    return [...journalEntries]
      .filter(entry => filterOutcome === 'all' || entry.outcome === filterOutcome)
      .sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        // Handle numeric fields
        if (['entry_price', 'exit_price', 'quantity', 'profit_loss'].includes(sortField)) {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }
        
        // Handle date fields
        if (['trade_date', 'created_at', 'updated_at'].includes(sortField)) {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
  };

  // Update stats after entries are loaded
  useEffect(() => {
    if (!loading && journalEntries.length > 0 && onStatsUpdate && !hasUpdatedStats.current) {
      const stats = calculateStats();
      onStatsUpdate(stats);
      hasUpdatedStats.current = true;
    }
  }, [loading, journalEntries, calculateStats, onStatsUpdate]);
  
  // Update stats when entries change (after initial load)
  useEffect(() => {
    if (hasUpdatedStats.current && onStatsUpdate) {
      const stats = calculateStats();
      onStatsUpdate(stats);
    }
  }, [calculateStats, onStatsUpdate]);

  const sortedEntries = getSortedEntries();

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h2>Trading Journal</h2>
        <button className="action-button primary" onClick={() => openJournalModal()}>
          <FaPlus /> Add Trade
        </button>
      </div>

      {journalError && (
        <div className="error-message fade-out">
          {journalError}
        </div>
      )}

      <div className="journal-stats">
        <div className="stat-card">
          <span className="stat-value">{journalEntries.length}</span>
          <span className="stat-label">Total Trades</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{journalEntries.filter(entry => entry.outcome !== 'open').length ? Math.round((journalEntries.filter(entry => entry.outcome === 'win').length / journalEntries.filter(entry => entry.outcome !== 'open').length) * 100) : 0}%</span>
          <span className="stat-label">Win Rate</span>
        </div>
        <div className="stat-card">
          <span className={`stat-value ${journalEntries.reduce((sum, entry) => {
            return sum + (parseFloat(entry.profit_loss) || 0);
          }, 0) >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(journalEntries.reduce((sum, entry) => {
              return sum + (parseFloat(entry.profit_loss) || 0);
            }, 0))}
          </span>
          <span className="stat-label">Total P/L</span>
        </div>
      </div>

      {showJournalModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{editingEntryId ? 'Edit Trade' : 'Add New Trade'}</h3>
              <button className="modal-close" onClick={closeJournalModal}>×</button>
            </div>
            <form onSubmit={handleJournalSubmit} className="journal-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="trade_date">Date</label>
                  <input
                    type="date"
                    id="trade_date"
                    name="trade_date"
                    value={journalFormData.trade_date}
                    onChange={handleJournalFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="symbol">Symbol</label>
                  <input
                    type="text"
                    id="symbol"
                    name="symbol"
                    value={journalFormData.symbol}
                    onChange={handleJournalFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="trade_type">Type</label>
                  <select
                    id="trade_type"
                    name="trade_type"
                    value={journalFormData.trade_type}
                    onChange={handleJournalFormChange}
                    required
                  >
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={journalFormData.quantity}
                    onChange={handleJournalFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="entry_price">Entry Price</label>
                  <input
                    type="number"
                    step="0.01"
                    id="entry_price"
                    name="entry_price"
                    value={journalFormData.entry_price}
                    onChange={handleJournalFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exit_price">Exit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    id="exit_price"
                    name="exit_price"
                    value={journalFormData.exit_price}
                    onChange={handleJournalFormChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="strategy">
                    Strategy <span className="char-count">{journalFormData.strategy.length}/{MAX_STRATEGY_LENGTH}</span>
                  </label>
                  <input
                    type="text"
                    id="strategy"
                    name="strategy"
                    value={journalFormData.strategy}
                    onChange={handleJournalFormChange}
                    maxLength={MAX_STRATEGY_LENGTH}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="outcome">Outcome</label>
                  <select
                    id="outcome"
                    name="outcome"
                    value={journalFormData.outcome}
                    onChange={handleJournalFormChange}
                  >
                    <option value="open">Open</option>
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="breakeven">Break Even</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="profit_loss">Profit/Loss</label>
                <input
                  type="number"
                  step="0.01"
                  id="profit_loss"
                  name="profit_loss"
                  value={journalFormData.profit_loss}
                  onChange={handleJournalFormChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">
                  Notes <span className="char-count">{journalFormData.notes.length}/{MAX_NOTES_LENGTH}</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={journalFormData.notes}
                  onChange={handleJournalFormChange}
                  rows="3"
                  maxLength={MAX_NOTES_LENGTH}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="action-button secondary" onClick={closeJournalModal}>
                  Cancel
                </button>
                <button type="submit" className="action-button primary">
                  {editingEntryId ? 'Update Trade' : 'Add Trade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="journal-filters">
        <div className="filter-group">
          <select 
            className="filter-select"
            value={filterOutcome}
            onChange={(e) => setFilterOutcome(e.target.value)}
          >
            <option value="all">All Trades</option>
            <option value="open">Open Trades</option>
            <option value="win">Winning Trades</option>
            <option value="loss">Losing Trades</option>
            <option value="breakeven">Breakeven Trades</option>
          </select>
        </div>
        
        <div className="filter-group">
          <select 
            className="filter-select"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="created_at">Sort by: Date</option>
            <option value="symbol">Sort by: Symbol</option>
            <option value="profit_loss">Sort by: Profit/Loss</option>
          </select>
          <button 
            className="sort-direction-button"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />}
          </button>
        </div>
      </div>

      <div className="journal-table-container">
        <table className="journal-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>Qty</th>
              <th>Strategy/Notes</th>
              <th>Outcome</th>
              <th>P/L</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map(entry => (
              <tr key={entry.id} className={`outcome-${entry.outcome}`}>
                <td>{formatDateTime(entry.created_at)}</td>
                <td>{entry.symbol.toUpperCase()}</td>
                <td className={entry.trade_type === 'buy' ? 'buy-type' : 'sell-type'}>
                  {entry.trade_type === 'buy' ? 'Buy' : 'Sell'}
                </td>
                <td>{formatCurrency(entry.entry_price)}</td>
                <td>{entry.exit_price ? formatCurrency(entry.exit_price) : '-'}</td>
                <td>{entry.quantity}</td>
                <td className="strategy-notes-cell">
                  <div className="tooltip-container">
                    <FaInfoCircle 
                      className="info-icon"
                      onMouseEnter={() => showTooltip(entry.id, 'strategy')}
                      onMouseLeave={hideTooltip}
                    />
                    {activeTooltip && activeTooltip.id === entry.id && activeTooltip.type === 'strategy' && (
                      <div className="tooltip" ref={tooltipRef}>
                        <div className="tooltip-header">Strategy & Notes</div>
                        <div className="tooltip-section">
                          <strong>Strategy:</strong> {entry.strategy || 'None'}
                        </div>
                        <div className="tooltip-section">
                          <strong>Notes:</strong> {entry.notes || 'None'}
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`outcome-badge ${entry.outcome}`}>
                    {entry.outcome.charAt(0).toUpperCase() + entry.outcome.slice(1)}
                  </span>
                </td>
                <td className={parseFloat(entry.profit_loss) >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(entry.profit_loss)}
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="icon-button edit" 
                      onClick={() => openJournalModal(entry)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="icon-button delete" 
                      onClick={() => handleDeleteEntry(entry.id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Add default props
TradingJournal.defaultProps = {
  onStatsUpdate: () => {}
};

export default TradingJournal; 