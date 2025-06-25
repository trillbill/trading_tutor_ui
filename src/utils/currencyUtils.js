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

// Helper function to determine if a value should use scientific notation
export const shouldUseScientificNotation = (value, threshold = 0.000001) => {
  const absValue = Math.abs(parseFloat(value) || 0);
  return absValue > 0 && absValue < threshold;
};

// Helper function to determine if a value should use subscript notation (Axiom style)
export const shouldUseSubscriptNotation = (value, threshold = 0.01) => {
  const absValue = Math.abs(parseFloat(value) || 0);
  return absValue > 0 && absValue < threshold;
};

// Helper function to create Axiom-style subscript notation
export const formatWithSubscript = (value, currencySymbol = '$') => {
  const numValue = parseFloat(value);
  const absValue = Math.abs(numValue);
  const isNegative = numValue < 0;
  
  if (absValue === 0) return `${currencySymbol}0.00`;
  
  // Convert to string and find the first non-zero digit after decimal
  const valueStr = absValue.toString();
  const decimalIndex = valueStr.indexOf('.');
  
  if (decimalIndex === -1) {
    // No decimal point, shouldn't happen for values < 0.01
    return `${isNegative ? '-' : ''}${currencySymbol}${valueStr}`;
  }
  
  // Find first non-zero digit after decimal
  let firstNonZeroIndex = -1;
  let zerosCount = 0;
  
  for (let i = decimalIndex + 1; i < valueStr.length; i++) {
    if (valueStr[i] !== '0') {
      firstNonZeroIndex = i;
      break;
    }
    zerosCount++;
  }
  
  if (firstNonZeroIndex === -1) {
    // All zeros after decimal
    return `${isNegative ? '-' : ''}${currencySymbol}0.00`;
  }
  
  // Get the significant digits after the first non-zero
  const significantDigits = valueStr.substring(firstNonZeroIndex, Math.min(firstNonZeroIndex + 3, valueStr.length));
  
  // Create the display format: $0.0[subscript]significantDigits
  return {
    isSubscript: true,
    prefix: `${isNegative ? '-' : ''}${currencySymbol}0.0`,
    subscript: zerosCount.toString(),
    digits: significantDigits
  };
};

// Format currency value with appropriate symbol
// Automatically uses scientific notation for extremely small values (< 0.000001 by default)
// 
// Examples:
// formatCurrency(0.00000123) => "$1.23e-6"
// formatCurrency(0.000123) => "$0.000123"
// formatCurrency(0.123) => "$0.123"
// formatCurrency(123.45) => "$123.45"
//
// Options:
// - scientificNotationThreshold: threshold below which to use scientific notation (default: 0.000001)
// - scientificNotationPrecision: number of decimal places in scientific notation (default: 2)
// - forceScientific: always use scientific notation regardless of value (default: false)
export const formatCurrency = (value, currencyCode = 'USD', options = {}) => {
  if (!value && value !== 0) return '-';
  
  const currency = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const symbol = currency.symbol;
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const absValue = Math.abs(numValue);
  
  // Handle negative values
  const isNegative = numValue < 0;
  const prefix = isNegative ? '-' : '';
  
  // Extract options with defaults
  const {
    scientificNotationThreshold = 0.000001,
    scientificNotationPrecision = 2,
    forceScientific = false,
    ...formatOptions
  } = options;
  
  // For currencies like JPY that typically don't use decimals
  if (currencyCode === 'JPY' || currencyCode === 'CNY') {
    const wholeNumber = Math.round(absValue);
    return `${prefix}${symbol}${new Intl.NumberFormat('en-US').format(wholeNumber)}`;
  }
  
  // Use scientific notation for extremely small values or if forced
  if (forceScientific || shouldUseScientificNotation(absValue, scientificNotationThreshold)) {
    const scientificNotation = absValue.toExponential(scientificNotationPrecision);
    return `${prefix}${symbol}${scientificNotation}`;
  }
  
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
    ...formatOptions
  };
  
  // Format the number
  let formattedNumber = new Intl.NumberFormat('en-US', defaultOptions).format(absValue);
  
  // For very small numbers, remove trailing zeros after the decimal point
  if (absValue < 1 && formattedNumber.includes('.')) {
    formattedNumber = formattedNumber.replace(/\.?0+$/, '');
  }
  
  return `${prefix}${symbol}${formattedNumber}`;
};

// Format currency for dashboard display (with Axiom-style subscript for small values)
export const formatCurrencyForDisplay = (value, currencyCode = 'USD', options = {}) => {
  if (!value && value !== 0) return '-';
  
  const currency = SUPPORTED_CURRENCIES[currencyCode] || SUPPORTED_CURRENCIES.USD;
  const symbol = currency.symbol;
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const absValue = Math.abs(numValue);
  
  // Extract options
  const { useSubscriptNotation = true, subscriptThreshold = 0.01 } = options;
  
  // Use subscript notation for small values in dashboard
  if (useSubscriptNotation && shouldUseSubscriptNotation(absValue, subscriptThreshold)) {
    return formatWithSubscript(numValue, symbol);
  }
  
  // Fall back to regular formatting
  return formatCurrency(value, currencyCode, { ...options, useSubscriptNotation: false });
};

// Format currency for modal/form display (always full precision, no subscript)
export const formatCurrencyForInput = (value, currencyCode = 'USD', options = {}) => {
  return formatCurrency(value, currencyCode, { ...options, useSubscriptNotation: false });
};

// Get list of supported currencies for dropdowns
export const getCurrencyOptions = () => {
  return Object.entries(SUPPORTED_CURRENCIES).map(([code, info]) => ({
    value: code,
    label: `${info.symbol} ${info.name} (${code})`
  }));
}; 