import React from 'react';
import { formatCurrencyForDisplay } from '../utils/currencyUtils';
import { useCurrency } from '../context/CurrencyContext';
import './SubscriptPrice.css';

const SubscriptPrice = ({ value, className = '', ...props }) => {
  const { currencyCode } = useCurrency();
  
  if (!value && value !== 0) return <span className={className}>-</span>;
  
  const formatted = formatCurrencyForDisplay(value, currencyCode);
  
  // If it's not a subscript format, render normally
  if (typeof formatted === 'string' || !formatted.isSubscript) {
    return <span className={className} {...props}>{formatted}</span>;
  }
  
  // Render with subscript styling
  return (
    <span className={`subscript-price ${className}`} {...props}>
      <span className="price-prefix">{formatted.prefix}</span>
      <span className="price-subscript">{formatted.subscript}</span>
      <span className="price-digits">{formatted.digits}</span>
    </span>
  );
};

export default SubscriptPrice; 