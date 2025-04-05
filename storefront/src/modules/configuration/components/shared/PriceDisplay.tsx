"use client"

import React from 'react'

interface PriceDisplayProps {
  amount: number; // Amount in cents/smallest unit
  currencyCode: string;
  // Add other formatting options if needed (e.g., locale)
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ amount, currencyCode }) => {
  // Basic formatting - enhance later with Intl.NumberFormat or library
  const formattedAmount = (amount / 100).toFixed(2);
  const displayCurrency = currencyCode.toUpperCase();

  return (
    <span className="text-xl font-semibold text-gray-900">
      {/* TODO: Use proper currency formatting library */}
      {displayCurrency} ${formattedAmount}
    </span>
  );
}

export default PriceDisplay; 