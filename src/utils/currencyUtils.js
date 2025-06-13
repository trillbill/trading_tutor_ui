// Currency configuration
export const SUPPORTED_CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', code: 'GBP' },
  JPY: { symbol: '¥', name: 'Japanese Yen', code: 'JPY' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', code: 'CAD' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', code: 'AUD' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', code: 'CHF' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', code: 'CNY' },
  INR: { symbol: '₹', name: 'Indian Rupee', code: 'INR' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', code: 'BRL' }
};

// Get currency symbol by code
export const getCurrencySymbol = (currencyCode = 'USD') => {
  return SUPPORTED_CURRENCIES[currencyCode]?.symbol || '$';
};

// Get currency name by code
export const getCurrencyName = (currencyCode = 'USD') => {
  return SUPPORTED_CURRENCIES[currencyCode]?.name || 'US Dollar';
};

// Format currency value with appropriate symbol
export const formatCurrency = (value, currencyCode = 'USD', options = {}) => {
  if (!value && value !== 0) return '-';
  
  const currency = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const symbol = currency.symbol;
  
  // Default formatting options
  const defaultOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  };
  
  // Format the number
  const formattedNumber = new Intl.NumberFormat('en-US', defaultOptions).format(Math.abs(value));
  
  // Handle negative values
  const isNegative = value < 0;
  const prefix = isNegative ? '-' : '';
  
  // For currencies like JPY that typically don't use decimals
  if (currencyCode === 'JPY' || currencyCode === 'CNY') {
    const wholeNumber = Math.round(Math.abs(value));
    return `${prefix}${symbol}${new Intl.NumberFormat('en-US').format(wholeNumber)}`;
  }
  
  return `${prefix}${symbol}${formattedNumber}`;
};

// Get list of supported currencies for dropdowns
export const getCurrencyOptions = () => {
  return Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => ({
    value: code,
    label: `${info.symbol} ${info.name} (${code})`
  }));
}; 