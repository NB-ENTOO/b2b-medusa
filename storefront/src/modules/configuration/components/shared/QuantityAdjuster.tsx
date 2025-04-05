"use client"

import React from 'react'
import { Button, clx } from "@medusajs/ui"
import { MinusMini, PlusMini } from "@medusajs/icons"

interface QuantityAdjusterProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (newQuantity: number) => void;
  disabled?: boolean;
}

const QuantityAdjuster: React.FC<QuantityAdjusterProps> = ({
  quantity,
  min = 1,
  max = Infinity,
  onChange,
  disabled = false,
}) => {

  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="secondary"
        size="small"
        className="p-1.5"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
      >
        <MinusMini />
      </Button>
      <span 
        className="text-md font-medium w-8 text-center tabular-nums"
        aria-live="polite"
      >
        {quantity}
      </span>
      <Button
        variant="secondary"
        size="small"
        className="p-1.5"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
      >
        <PlusMini />
      </Button>
    </div>
  );
}

export default QuantityAdjuster; 