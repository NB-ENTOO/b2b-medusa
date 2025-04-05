"use client"

import React from 'react'
import { ConfigTabProps } from '.' 

// Placeholder component
const MemoryTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Memory (RAM) Options</h3>
       <p>Memory selection UI will go here.</p>
      {/* TODO: Implement OptionSelector or custom UI for memory */}
    </div>
  );
}

export default MemoryTab; 