"use client"

import React from 'react'
import { ConfigTabProps } from '.' 
import OptionSelector from '../shared/OptionSelector'
import QuantityAdjuster from '../shared/QuantityAdjuster'

// Placeholder component
const MemoryTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {

  // TODO: Fetch actual memory options based on the product 
  const memoryTypeOptions = [
    { id: 'ram_ddr4_3200', name: 'DDR4 3200MHz ECC RDIMM', price_delta: 0 },
    { id: 'ram_ddr4_2933', name: 'DDR4 2933MHz ECC RDIMM', price_delta: -5000 }, // -$50.00
    { id: 'ram_ddr5_4800', name: 'DDR5 4800MHz ECC RDIMM', price_delta: 10000, is_compatible: false }, // Example incompatible
  ];

  const selectedMemoryTypeId = currentConfiguration['memory_type_id'] || memoryTypeOptions[0]?.id || null;
  const selectedQuantity = currentConfiguration['memory_quantity'] || 2; // Default quantity

  return (
    <div className="space-y-6">
      <OptionSelector
        optionKey="memory_type_id"
        title="Select Memory Type"
        options={memoryTypeOptions}
        selectedId={selectedMemoryTypeId}
        onChange={(value) => onOptionChange('memory_type_id', value)}
      />

      <div>
        <label className="block text-base font-medium text-gray-900 mb-2">Quantity</label>
        <QuantityAdjuster 
          quantity={selectedQuantity}
          min={1} // TODO: Adjust min/max based on product slots
          max={8} 
          onChange={(value) => onOptionChange('memory_quantity', value)}
        />
      </div>

       {/* TODO: Add capacity per DIMM selection if needed */}
    </div>
  );
}

export default MemoryTab; 