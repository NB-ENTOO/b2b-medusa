"use client"

import React from 'react'
import { ConfigTabProps } from '.' 
import OptionSelector from '../shared/OptionSelector'
import QuantityAdjuster from '../shared/QuantityAdjuster'

// Placeholder component
const StorageTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {

  // TODO: Fetch actual storage options based on the product 
  const storageTypeOptions = [
    { id: 'storage_ssd_1tb', name: '1TB NVMe SSD', price_delta: 0 },
    { id: 'storage_ssd_2tb', name: '2TB NVMe SSD', price_delta: 15000 }, // +$150.00
    { id: 'storage_hdd_4tb', name: '4TB SAS HDD (7.2k RPM)', price_delta: 5000 }, // +$50.00
    { id: 'storage_hdd_8tb', name: '8TB SAS HDD (7.2k RPM)', price_delta: 20000 }, // +$200.00
  ];

  const selectedStorageTypeId = currentConfiguration['storage_type_id'] || storageTypeOptions[0]?.id || null;
  const selectedQuantity = currentConfiguration['storage_quantity'] || 1; // Default quantity

  return (
    <div className="space-y-6">
      <OptionSelector
        optionKey="storage_type_id"
        title="Select Storage Drive Type"
        options={storageTypeOptions}
        selectedId={selectedStorageTypeId}
        onChange={(value) => onOptionChange('storage_type_id', value)}
      />

      <div>
        <label className="block text-base font-medium text-gray-900 mb-2">Number of Drives</label>
        <QuantityAdjuster 
          quantity={selectedQuantity}
          min={1} // TODO: Adjust min/max based on product slots/RAID
          max={product.metadata?.max_drives || 8} // Example using metadata 
          onChange={(value) => onOptionChange('storage_quantity', value)}
        />
      </div>

       {/* TODO: Add RAID configuration options if applicable */}
    </div>
  );
}

export default StorageTab; 