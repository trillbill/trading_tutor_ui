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
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const absValue = Math.abs(numValue);
  
  // Determine appropriate decimal places based on value size
  let decimalPlaces = 2; // default for normal amounts
  
  if (absValue > 0) {
    if (absValue < 0.01) {
      // For very small amounts (< $0.01), use up to 8 decimal places
      // but remove trailing zeros
      decimalPlaces = 8;
    } else if (absValue < 1) {
      // For amounts between $0.01 and $1, use up to 6 decimal places
      decimalPlaces = 6;
    } else if (absValue < 100) {
      // For amounts between $1 and $100, use up to 4 decimal places
      decimalPlaces = 4;
    }
    // For amounts >= $100, stick with 2 decimal places
  }
  
  // Default formatting options with intelligent decimal places
  const defaultOptions = {
    minimumFractionDigits: absValue >= 1 ? 2 : 0, // Only force 2 decimals for amounts >= $1
    maximumFractionDigits: decimalPlaces,
    ...options
  };
  
  // Format the number
  let formattedNumber = new Intl.NumberFormat('en-US', defaultOptions).format(absValue);
  
  // For very small numbers, remove trailing zeros after the decimal point
  if (absValue < 1 && formattedNumber.includes('.')) {
    formattedNumber = formattedNumber.replace(/\.?0+$/, '');
  }
  
  // Handle negative values
  const isNegative = numValue < 0;
  const prefix = isNegative ? '-' : '';
  
  // For currencies like JPY that typically don't use decimals
  if (currencyCode === 'JPY' || currencyCode === 'CNY') {
    const wholeNumber = Math.round(absValue);
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