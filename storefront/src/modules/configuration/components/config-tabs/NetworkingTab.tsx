"use client"

import React from 'react'
import { ConfigTabProps } from '.' 
import OptionSelector from '../shared/OptionSelector'

// Placeholder component
const NetworkingTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {

  // TODO: Fetch actual networking options based on the product 
  const nicOptions = [
    { id: 'nic_1g_2p', name: 'Onboard Dual 1GbE NIC', price_delta: 0 },
    { id: 'nic_10g_2p', name: 'Dual Port 10GbE SFP+ Adapter', price_delta: 25000 }, // +$250.00
    { id: 'nic_25g_2p', name: 'Dual Port 25GbE SFP28 Adapter', price_delta: 60000 }, // +$600.00
    { id: 'nic_10g_4p', name: 'Quad Port 10GbE SFP+ Adapter', price_delta: 45000, is_compatible: false }, // Example incompatible
  ];

  const selectedNicId = currentConfiguration['nic_id'] || nicOptions[0]?.id || null;

  return (
    <div className="space-y-6">
      <OptionSelector
        optionKey="nic_id"
        title="Select Network Interface Card (NIC)"
        options={nicOptions}
        selectedId={selectedNicId}
        onChange={(value) => onOptionChange('nic_id', value)}
      />

       {/* TODO: Add options for management ports, fiber channel, etc. if applicable */}
    </div>
  );
}

export default NetworkingTab;