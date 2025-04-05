"use client"

import React from 'react'
import { ConfigTabProps } from '.' 

// Placeholder component
const StorageTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Storage Options</h3>
      <p>Storage selection UI will go here.</p>
      {/* TODO: Implement OptionSelector or custom UI for storage */}
    </div>
  );
}

export default StorageTab; 