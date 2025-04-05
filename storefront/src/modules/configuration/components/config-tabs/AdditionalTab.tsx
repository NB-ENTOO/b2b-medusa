"use client"

import React from 'react'
import { ConfigTabProps } from '.' 

// Placeholder component
const AdditionalTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Additional Options</h3>
      <p>UI for additional options (e.g., RAID controllers, power supplies, OS) will go here.</p>
      {/* TODO: Implement relevant UI elements */}
    </div>
  );
}

export default AdditionalTab; 