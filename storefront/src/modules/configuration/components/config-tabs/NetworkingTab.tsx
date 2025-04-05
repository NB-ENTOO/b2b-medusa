"use client"

import React from 'react'
import { ConfigTabProps } from '.' 

// Placeholder component
const NetworkingTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Networking Options</h3>
      <p>Networking selection UI will go here.</p>
      {/* TODO: Implement OptionSelector or custom UI for networking */}
    </div>
  );
}

export default NetworkingTab; 