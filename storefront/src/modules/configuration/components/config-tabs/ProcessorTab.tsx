"use client"

import React from 'react'
import { ConfigTabProps } from '.' 

// Placeholder component
const ProcessorTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Processor Options</h3>
      <p>Processor selection UI will go here.</p>
      {/* TODO: Implement OptionSelector or custom UI for processors */}
      {/* Example:
      <OptionSelector 
         options={product.configuration_options?.processor} 
         selected={currentConfiguration['processor_id']}
         onChange={(value) => onOptionChange('processor_id', value)}
      /> 
      */}
    </div>
  );
}

export default ProcessorTab; 