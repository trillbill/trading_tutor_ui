import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../api/api';
import './TradingJournal.css';

function TradingJournal() {
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

  useEffect(() => {
    fetchJournalEntries();
  }, []);

  const fetchJournalEntries = async () => {
    try {
      const response = await api.get('/api/journal');
      if (response.data.success) {
        setJournalEntries(response.data.entries);
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      setJournalError('Failed to load journal entries');
    }
  };

  const handleJournalFormChange = (e) => {
    const { name, value } = e.target;
    setJournalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJournalSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = editingEntryId
        ? await api.put(`/api/journal/${editingEntryId}`, journalFormData)
        : await api.post('/api/journal', journalFormData);

      if (response.data.success) {
        setShowJournalModal(false);
        fetchJournalEntries();
        resetForm();
      }
    } catch (error) {
      setJournalError('Failed to save journal entry');
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateStats = () => {
    const closedTrades = journalEntries.filter(entry => entry.outcome !== 'open');
    const wins = closedTrades.filter(entry => entry.outcome === 'win').length;
    const totalProfit = journalEntries.reduce((sum, entry) => 
      sum + (parseFloat(entry.profit_loss) || 0), 0);

    return {
      total: journalEntries.length,
      wins,
      winRate: closedTrades.length ? Math.round((wins / closedTrades.length) * 100) : 0,
      totalProfit
    };
  };

  const stats = calculateStats();

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h2>Trading Journal</h2>
        <button className="action-button primary" onClick={() => openJournalModal()}>
          <FaPlus /> Add Trade
        </button>
      </div>

      {journalError && <div className="error-message">{journalError}</div>}

      <div className="journal-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Trades</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.wins}</span>
          <span className="stat-label">Winning Trades</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.winRate}%</span>
          <span className="stat-label">Win Rate</span>
        </div>
        <div className="stat-card">
          <span className={`stat-value ${stats.totalProfit >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(stats.totalProfit)}
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
                  <label htmlFor="strategy">Strategy</label>
                  <input
                    type="text"
                    id="strategy"
                    name="strategy"
                    value={journalFormData.strategy}
                    onChange={handleJournalFormChange}
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
                <label htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={journalFormData.notes}
                  onChange={handleJournalFormChange}
                  rows="3"
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

      <div className="journal-entries">
        <table className="journal-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>Quantity</th>
              <th>P/L</th>
              <th>Outcome</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {journalEntries.map(entry => (
              <tr key={entry.id}>
                <td>{formatDate(entry.trade_date)}</td>
                <td>{entry.symbol}</td>
                <td>{entry.trade_type}</td>
                <td>{formatCurrency(entry.entry_price)}</td>
                <td>{formatCurrency(entry.exit_price)}</td>
                <td>{entry.quantity}</td>
                <td className={entry.profit_loss >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(entry.profit_loss)}
                </td>
                <td>
                  <span className={`outcome-badge ${entry.outcome}`}>
                    {entry.outcome}
                  </span>
                </td>
                <td>
                  <button
                    className="icon-button"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TradingJournal; 