"use client"

import React from 'react'
import PriceDisplay from '../shared/PriceDisplay' // Assuming this will be created

interface PriceSummaryProps {
  totalPrice: number;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({ totalPrice }) => {
  return (
    <div>
      <h4 className="text-md font-medium mb-2">Estimated Price:</h4>
      <PriceDisplay amount={totalPrice} currencyCode="usd" /> {/* TODO: Use actual currency */} 
      {/* Add breakdown if needed */}
    </div>
  );
}

export default PriceSummary; 