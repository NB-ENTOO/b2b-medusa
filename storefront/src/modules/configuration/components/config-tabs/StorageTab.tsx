"use client"

import React from 'react'
import { ConfigTabProps } from '.' 
import OptionSelector from '../shared/OptionSelector'
import QuantityAdjuster from '../shared/QuantityAdjuster'
import CompatibilityBadge from '../shared/CompatibilityBadge'
import { clx } from "@medusajs/ui"

// Placeholder component
const StorageTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {

  // TODO: Fetch actual storage options based on the product 
  const storageTypeOptions = [
    { id: 'storage_ssd_1tb', name: '1TB NVMe SSD', price_delta: 0, is_compatible: true },
    { id: 'storage_ssd_2tb', name: '2TB NVMe SSD', price_delta: 15000, is_compatible: true },
    { id: 'storage_hdd_4tb', name: '4TB SAS HDD (7.2k RPM)', price_delta: 5000, is_compatible: true },
    { id: 'storage_hdd_8tb', name: '8TB SAS HDD (7.2k RPM)', price_delta: 20000, is_compatible: false },
  ];

  // TODO: Fetch actual RAID options based on product/controller
  const raidOptions = [
    { id: 'raid_none', name: 'No RAID (Individual Disks)', price_delta: 0 },
    { id: 'raid_0', name: 'RAID 0 (Stripe)', price_delta: 0 },
    { id: 'raid_1', name: 'RAID 1 (Mirror)', price_delta: 0 },
    { id: 'raid_5', name: 'RAID 5 (Stripe with Parity)', price_delta: 5000 },
    { id: 'raid_10', name: 'RAID 10 (Mirror + Stripe)', price_delta: 5000 },
  ];

  const selectedStorageTypeId = currentConfiguration['storage_type_id'] || storageTypeOptions[0]?.id || null;
  const selectedQuantity = currentConfiguration['storage_quantity'] || 1; 
  const selectedRaidLevel = currentConfiguration['raid_level'] || raidOptions[0]?.id || null;

  // Example: Disable RAID selection if only 1 drive selected
  const canSelectRaid = selectedQuantity > 1;

  return (
    <div className="space-y-8">
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

      <div>
        <label className={clx(
          "block text-base font-medium text-gray-900 mb-2",
          !canSelectRaid && "text-gray-400"
          )}>RAID Configuration</label>
        <OptionSelector
          optionKey="raid_level"
          title="Select RAID Level"
          options={raidOptions.map(opt => ({...opt, is_compatible: canSelectRaid || opt.id === 'raid_none'}))}
          selectedId={selectedRaidLevel}
          onChange={(value) => onOptionChange('raid_level', value)}
          disabled={!canSelectRaid}
        />
         {!canSelectRaid && (
           <p className="text-xs text-gray-500 mt-1">RAID configuration requires 2 or more drives.</p>
         )}
      </div>

    </div>
  );
}

export default StorageTab; 