import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaRobot, FaInfoCircle, FaChevronLeft, FaChevronRight, FaSortUp, FaSortDown, FaBook, FaPen, FaTimes } from 'react-icons/fa';
import api from '../api/api';
import './TradingJournal.css';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine 
} from 'recharts';
import AIChatModal from './AIChatModal'; // Import the AIChatModal directly
import { useAuth } from '../context/AuthContext';
import { useAIChat } from '../context/AIChatContext';

function TradingJournal({ onStatsUpdate }) {
  const [journalEntries, setJournalEntries] = useState([]);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalError, setJournalError] = useState('');
  const [modalError, setModalError] = useState(''); // Add modal-specific error state
  const [entriesChanged, setEntriesChanged] = useState(false);
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

  // Add pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 20
  });

  // Add a new state for total stats
  const [totalStats, setTotalStats] = useState({
    total: 0,
    winRate: 0,
    totalProfit: 0
  });

  // Use refs to track if the effects have run
  const journalEntriesEffectRan = useRef(false);
  const journalSummaryEffectRan = useRef(false);

  // Add state for PNL chart data
  const [pnlChartData, setPnlChartData] = useState([]);

  // Add state for AI chat modal
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatTerm, setChatTerm] = useState('');
  const [chatDescription, setChatDescription] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  // Add state for wallet address
  const [walletAddress, setWalletAddress] = useState('');
  const { user } = useAuth();
  const { setIsAIChatModalOpen } = useAIChat();

  // Add state for credit balance
  const [creditBalance, setCreditBalance] = useState(null);

  // Add state for notes modal
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [generalNotes, setGeneralNotes] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);

  // Add this near the top of the component with other state variables
  const [isMobile, setIsMobile] = useState(false);

  // Add this useEffect to detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Define the fetchJournalEntries function
  const fetchJournalEntries = async (page = pagination.currentPage) => {
    try {
      setLoading(true);
      const response = await api.get('/api/journal', {
        params: {
          page,
          limit: pagination.limit
        }
      });
      
      if (response.data.success) {
        setJournalEntries(response.data.entries);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      setJournalError('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  // Fetch journal entries when component mounts or pagination changes
  useEffect(() => {
    // Always fetch when pagination changes
    fetchJournalEntries();
    
    // Only set the flag for initial mount
    return () => {
      if (!journalEntriesEffectRan.current) {
        journalEntriesEffectRan.current = true;
      }
    };
  }, [pagination.currentPage, pagination.limit]); // Dependencies: pagination page and limit

  // Format currency for tooltip and display
  const formatCurrency = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  // Add a function to format dates nicely
  const formatDateForTooltip = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  // Fetch journal summary when component mounts or entries change
  useEffect(() => {
    // In development, React will run effects twice in strict mode
    // This check prevents the second run in development
    if (journalSummaryEffectRan.current === true && !entriesChanged) {
      return;
    }
    
    const fetchSummary = async () => {
      try {
        const response = await api.get('/api/journal/summary');
        if (response.data.success) {
          const stats = {
            total: response.data.summary.stats.total_trades || 0,
            winRate: response.data.summary.stats.winning_trades && response.data.summary.stats.total_trades 
              ? Math.round((response.data.summary.stats.winning_trades / response.data.summary.stats.total_trades) * 100) 
              : 0,
            totalProfit: response.data.summary.stats.total_pnl || 0
          };
          
          setTotalStats(stats);
          
          // Use the cumulative PnL data directly from the backend
          if (response.data.summary.cumulativePnlData) {
            const optimizedChartData = optimizeChartData(response.data.summary.cumulativePnlData);
            setPnlChartData(optimizedChartData);
          }
          
          // If onStatsUpdate is provided, call it with the stats
          if (onStatsUpdate) {
            onStatsUpdate(stats);
          }
        }
      } catch (error) {
        console.error('Error fetching journal summary:', error);
      }
    };

    fetchSummary();
    
    // Cleanup function that runs when component unmounts or dependencies change
    return () => {
      if (!entriesChanged) {
        journalSummaryEffectRan.current = true;
      } else {
        // Reset the flag when entries change so we fetch fresh data
        journalSummaryEffectRan.current = false;
      }
    };
  }, [entriesChanged, onStatsUpdate]); // Dependencies: entriesChanged and onStatsUpdate

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
      setModalError(''); // Clear any previous modal errors
      
      if (editingEntryId) {
        await api.put(`/api/journal/${editingEntryId}`, journalFormData);
      } else {
        await api.post('/api/journal', journalFormData);
      }
      
      fetchJournalEntries();
      setEntriesChanged(prev => !prev); // Toggle to trigger the useEffect
      fetchCreditBalance(); // Refresh credit balance after successful submission
      closeJournalModal();
    } catch (error) {
      console.error('Error adding journal entry:', error);
      
      // Handle insufficient credits (402 status)
      if (error.response?.status === 402) {
        const errorData = error.response.data;
        setModalError(
          `Insufficient Credits: You need ${errorData.required_credits} credit${errorData.required_credits > 1 ? 's' : ''} to log this trade, but you only have ${errorData.current_credits} credit${errorData.current_credits !== 1 ? 's' : ''} remaining. Your credits reset daily - try again tomorrow! 💳`
        );
      } else {
        // Generic error handling for other errors
        setModalError('Failed to save journal entry: ' + 
          (error.response?.data?.error || error.message));
      }
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/api/journal/${entryId}`);
        fetchJournalEntries();
        setEntriesChanged(prev => !prev); // Toggle to trigger the useEffect
      } catch (error) {
        setJournalError('Failed to delete entry');
      }
    }
  };

  const openJournalModal = (entry = null) => {
    setModalError(''); // Clear any previous modal errors
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
    setModalError(''); // Clear modal error when closing
    resetForm();
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
  }, [entriesChanged, calculateStats, onStatsUpdate]);

  const sortedEntries = getSortedEntries();

  // Add function to handle page changes
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: newPage
      }));
    }
  };

  // Update the discussTradeWithAI function to use the context
  const discussTradeWithAI = (entry) => {
    // Format the trade data as a message to the AI
    const tradeMessage = `
I want to discuss this trade from my journal:

Symbol: ${entry.symbol.toUpperCase()}
Date: ${formatDateTime(entry.trade_date)}
Type: ${entry.trade_type === 'buy' ? 'Buy' : 'Sell'}
Entry Price: ${formatCurrency(entry.entry_price)}
Exit Price: ${entry.exit_price ? formatCurrency(entry.exit_price) : 'N/A'}
Quantity: ${entry.quantity}
P/L: ${formatCurrency(entry.profit_loss)}
Outcome: ${entry.outcome.charAt(0).toUpperCase() + entry.outcome.slice(1)}
Strategy: ${entry.strategy || 'None'}
Notes: ${entry.notes || 'None'}

Can you analyze this trade and provide feedback on what I did well and what I could improve? Also, are there any patterns or strategies you notice based on this trade?
`;

    // Set the chat term to the symbol
    setChatTerm(`${entry.symbol.toUpperCase()} Trade Analysis`);
    
    // Set a brief description for context
    setChatDescription(`Analysis of ${entry.trade_type === 'buy' ? 'Buy' : 'Sell'} trade for ${entry.symbol.toUpperCase()} on ${formatDateTime(entry.trade_date)}`);
    
    // Set the initial message
    setInitialMessage(tradeMessage);
    
    // Open the AI chat modal and update global state
    setIsAIChatOpen(true);
    setIsAIChatModalOpen(true);
  };

  // Update the AIChatModal onClose handler
  const handleCloseAIChat = () => {
    setIsAIChatOpen(false);
    setIsAIChatModalOpen(false);
  };

  // Fetch user's wallet address on component mount
  useEffect(() => {
    const fetchUserWallet = async () => {
      try {
        const response = await api.get('/api/account/profile');
        if (response.data.solanaAddress) {
          setWalletAddress(response.data.solanaAddress);
        }
      } catch (error) {
        console.error('Error fetching user wallet:', error);
      }
    };
    
    if (user) {
      fetchUserWallet();
    }
  }, [user]);

  // Add this function to optimize data for large datasets
  const optimizeChartData = (data) => {
    if (!data || data.length === 0) return [];
    
    // Always return original data if we have fewer than 50 points
    if (data.length < 50) return data;
    
    // Calculate the time span of the data
    const firstDate = new Date(data[0].date);
    const lastDate = new Date(data[data.length - 1].date);
    const daySpan = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));
    const monthSpan = daySpan / 30;
    const yearSpan = daySpan / 365;
    
    // Determine aggregation strategy based on data density
    let aggregationType = 'none';
    let targetPoints = 100; // Aim for around 100 chart points for optimal performance
    
    if (data.length >= 1000 || yearSpan >= 2) {
      // For very large datasets or multi-year spans, aggregate by month
      aggregationType = 'monthly';
    } else if (data.length >= 200 || monthSpan >= 6) {
      // For medium datasets or spans over 6 months, aggregate by week
      aggregationType = 'weekly';
    } else if (data.length >= 100 || daySpan >= 90) {
      // For smaller datasets or spans over 3 months, aggregate by day
      aggregationType = 'daily';
    } else {
      // Keep all data for small datasets
      return data;
    }
    
    console.log(`Optimizing ${data.length} trades over ${daySpan} days using ${aggregationType} aggregation`);
    
    return aggregateData(data, aggregationType);
  };

  const aggregateData = (data, type) => {
    const aggregated = {};
    
    data.forEach(item => {
      const date = new Date(item.date);
      let key;
      
      switch (type) {
        case 'daily':
          // Group by day (YYYY-MM-DD)
          key = item.date.split('T')[0];
          break;
          
        case 'weekly':
          // Group by week (start of week)
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
          key = weekStart.toISOString().split('T')[0];
          break;
          
        case 'monthly':
          // Group by month (YYYY-MM-01)
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
          break;
          
        default:
          key = item.date;
      }
      
      // Keep the last trade's cumulative PnL for each time period
      // This ensures we show the final cumulative value for that period
      if (!aggregated[key] || new Date(item.date) > new Date(aggregated[key].originalDate)) {
        aggregated[key] = {
          date: key,
          originalDate: item.date, // Keep track of the original date for comparison
          individualPnl: item.individualPnl,
          cumulativePnl: item.cumulativePnl
        };
      }
    });
    
    // Remove the originalDate field and sort by date
    return Object.values(aggregated)
      .map(({ originalDate, ...rest }) => rest)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Add this useEffect to fetch notes when component mounts
  useEffect(() => {
    fetchGeneralNotes();
    fetchCreditBalance();
  }, []);

  // Add function to fetch general notes
  const fetchGeneralNotes = async () => {
    try {
      setNotesLoading(true);
      const response = await api.get('/api/journal/notes');
      if (response.data.success) {
        setGeneralNotes(response.data.notes || '');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setNotesLoading(false);
    }
  };

  // Add function to save general notes
  const saveGeneralNotes = async () => {
    try {
      setNotesLoading(true);
      const response = await api.post('/api/journal/notes', {
        notes: generalNotes
      });
      
      if (response.data.success) {
        setIsNotesModalOpen(false);
        // Optionally show success message
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      setJournalError('Failed to save notes. Please try again.');
    } finally {
      setNotesLoading(false);
    }
  };

  // Update the clearGeneralNotes function to only clear local state
  const clearGeneralNotes = () => {
    setGeneralNotes('');
  };

  // Add function to fetch credit balance
  const fetchCreditBalance = async () => {
    try {
      const response = await api.get('/api/credits/balance');
      if (response.data.success) {
        setCreditBalance(response.data.credits);
      }
    } catch (error) {
      console.error('Error fetching credit balance:', error);
    }
  };

  return (
    <div className="journal-container">
      {/* Conditionally render header based on screen size */}
      <div className={`journal-title-row ${isMobile ? 'journal-title-row-mobile' : ''}`}>
        <div className="title-and-credits">
          <h2 className="journal-title styled-header">
            Trading Journal
          </h2>
          {creditBalance && (
            <div className="credit-display">
              <span className="credit-text">
                Credits: {creditBalance.current}/{creditBalance.daily_limit}
              </span>
              <span className="credit-info">Resets daily</span>
            </div>
          )}
        </div>
        <div className="header-buttons">
          <button 
            className="action-button secondary notes-button"
            onClick={() => {
              fetchGeneralNotes();
              setIsNotesModalOpen(true);
            }}
            title="General Notes"
          >
            {isMobile ? <FaPen /> : <><FaPen /> Notes</>}
          </button>
          <button 
            className="action-button primary"
            onClick={() => openJournalModal()}
          >
            <FaPlus /> {isMobile ? '' : 'Add Trade'}
          </button>
        </div>
      </div>
      
      {/* PNL Chart Section */}
      <div className="journal-pnl-chart">
        {/* <h3 className="chart-title">
          <FaChartLine className="chart-icon" /> P/L Overview
        </h3> */}
        <div className="pnl-chart-container">
          {pnlChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={pnlChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(tick) => {
                    try {
                      const date = new Date(tick);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    } catch (e) {
                      return tick;
                    }
                  }}
                  tickMargin={10}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(tick) => formatCurrency(tick).replace('.00', '')}
                  tickMargin={10}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    const formattedValue = formatCurrency(value);
                    const label = name === 'individualPnl' ? 'Trade P/L' : 'Total P/L';
                    return [formattedValue, label];
                  }}
                  labelFormatter={(label) => `Date: ${formatDateForTooltip(label)}`}
                />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                <Line 
                  type="monotone" 
                  dataKey="cumulativePnl" 
                  stroke="#4b937b" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#4b937b', stroke: '#4b937b' }}
                  activeDot={{ r: 6, stroke: '#4b937b', strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart-message">
              <p>No trading data available yet</p>
              <p className="empty-chart-subtext">Start adding trades to see your performance chart</p>
            </div>
          )}
        </div>
      </div>

      {journalError && (
        <div className="error-message fade-out">
          {journalError}
        </div>
      )}

      <div className="journal-stats">
        <div className="stat-card">
          <span className="stat-value">{totalStats.total}</span>
          <span className="stat-label">Total Trades</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalStats.winRate}%</span>
          <span className="stat-label">Win Rate</span>
        </div>
        <div className="stat-card">
          <span className={`stat-value ${totalStats.totalProfit >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(totalStats.totalProfit)}
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

              {/* Modal Error Display */}
              {modalError && (
                <div className="modal-error-message">
                  {modalError}
                </div>
              )}

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
                <td>{formatDateTime(entry.trade_date)}</td>
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
                    <button 
                      className="icon-button ai-discuss" 
                      onClick={() => discussTradeWithAI(entry)}
                      title="Discuss with AI"
                    >
                      <FaRobot />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add pagination controls */}
      <div className="pagination-controls">
        <button 
          className="pagination-button"
          disabled={pagination.currentPage === 1}
          onClick={() => handlePageChange(pagination.currentPage - 1)}
        >
          <FaChevronLeft />
        </button>
        
        <div className="pagination-info">
          Page {pagination.currentPage} of {pagination.totalPages}
          {pagination.total > 0 && ` (${pagination.total} total entries)`}
        </div>
        
        <button 
          className="pagination-button"
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => handlePageChange(pagination.currentPage + 1)}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Update the AI Chat Modal at the end of the component */}
      <AIChatModal 
        isOpen={isAIChatOpen} 
        onClose={handleCloseAIChat}
        initialTerm={chatTerm}
        initialDescription={chatDescription}
        initialMessage={initialMessage}
      />

      {/* Add Notes Modal */}
      {isNotesModalOpen && (
        <div className="modal" onClick={() => setIsNotesModalOpen(false)}>
          <div className="modal-content notes-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>General Trading Notes</h2>
              <button className="modal-close-button" onClick={() => setIsNotesModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="notes-container">
                <div className="notes-header">
                  <label htmlFor="general-notes">
                    <span className={`char-count ${generalNotes.length > 4000 ? 'warning' : ''} ${generalNotes.length >= 5000 ? 'limit' : ''}`}>
                      {generalNotes.length}/5000
                    </span>
                  </label>
                </div>
                
                <textarea
                  id="general-notes"
                  className="notes-textarea"
                  value={generalNotes}
                  onChange={(e) => {
                    if (e.target.value.length <= 5000) {
                      setGeneralNotes(e.target.value);
                    }
                  }}
                  placeholder="Write your notes here..."
                  disabled={notesLoading}
                />
                
                <div className="notes-info">
                  <p>Use this space to jot down your trading thoughts, market observations, strategy notes, or any insights you want to remember.</p>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-button"
                onClick={clearGeneralNotes}
                disabled={notesLoading || !generalNotes.trim()}
              >
                Clear All
              </button>
              <button 
                className="cancel-button"
                onClick={() => setIsNotesModalOpen(false)}
                disabled={notesLoading}
              >
                Cancel
              </button>
              <button 
                className="save-button"
                onClick={saveGeneralNotes}
                disabled={notesLoading}
              >
                {notesLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add default props
TradingJournal.defaultProps = {
  onStatsUpdate: () => {}
};

export default TradingJournal; 