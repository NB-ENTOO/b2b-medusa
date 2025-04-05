"use client"

import React from 'react'
import { ConfigTabProps } from '.' 
import OptionSelector from '../shared/OptionSelector'

// Placeholder component
const ProcessorTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {

  // TODO: Fetch actual processor options based on the product 
  // These are placeholders
  const processorOptions = [
    { id: 'cpu_intel_1', name: 'Intel Xeon Silver 4210R', price_delta: 0 },
    { id: 'cpu_intel_2', name: 'Intel Xeon Gold 6248R', price_delta: 150000 }, // +$1500.00
    { id: 'cpu_amd_1', name: 'AMD EPYC 7302P', price_delta: 50000 }, // +$500.00
    { id: 'cpu_amd_2', name: 'AMD EPYC 7742', price_delta: 450000, is_compatible: false }, // Example incompatible
  ];

  const selectedProcessorId = currentConfiguration['processor_id'] || processorOptions[0]?.id || null;

  return (
    <div>
      <OptionSelector
        optionKey="processor_id" // Key used in state/backend
        title="Select Processor"
        options={processorOptions}
        selectedId={selectedProcessorId}
        onChange={(value) => onOptionChange('processor_id', value)}
        displayType="radio" // Or 'cards' or 'dropdown' later
      />
      {/* Add section for maybe number of processors if applicable */}
    </div>
  );
}

export default ProcessorTab; 