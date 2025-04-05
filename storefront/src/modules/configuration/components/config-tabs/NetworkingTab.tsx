"use client"

import React from 'react'
import { ConfigTabProps } from '.' 
import OptionSelector from '../shared/OptionSelector'
// Potentially import QuantityAdjuster if multiple NICs are possible
// import QuantityAdjuster from '../shared/QuantityAdjuster'
import CompatibilityBadge from '../shared/CompatibilityBadge'

// Placeholder component
const NetworkingTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {

  // TODO: Fetch actual networking options based on the product 
  const nicOptions = [
    { id: 'nic_1g_2p', name: 'Onboard Dual 1GbE NIC', description: 'Standard onboard networking.', price_delta: 0, is_compatible: true },
    { id: 'nic_10g_2p', name: 'Dual Port 10GbE SFP+ Adapter', description: 'High-speed 10Gb networking.', price_delta: 25000, is_compatible: true },
    { id: 'nic_25g_2p', name: 'Dual Port 25GbE SFP28 Adapter', description: 'Very high-speed 25Gb networking.', price_delta: 60000, is_compatible: true },
    { id: 'nic_10g_4p', name: 'Quad Port 10GbE SFP+ Adapter', description: 'Requires specific PCIe slot.', price_delta: 45000, is_compatible: false }, 
  ];
  
  // TODO: Fetch options for management ports (e.g., iDRAC, iLO)
  const mgmtOptions = [
      { id: 'mgmt_none', name: 'No Dedicated Management Port', price_delta: 0 },
      { id: 'mgmt_idrac_ent', name: 'iDRAC 9 Enterprise License', price_delta: 30000 },
      { id: 'mgmt_ilo_adv', name: 'HPE iLO Advanced License', price_delta: 28000 },
  ];

  const selectedNicId = currentConfiguration['nic_id'] || nicOptions[0]?.id || null;
  const selectedMgmtId = currentConfiguration['mgmt_id'] || mgmtOptions[0]?.id || null;

  return (
    <div className="space-y-8">
      <OptionSelector
        optionKey="nic_id"
        title="Select Network Interface Card (NIC)"
        options={nicOptions}
        selectedId={selectedNicId}
        onChange={(value) => onOptionChange('nic_id', value)}
        // Consider 'cards' displayType if descriptions are important
      />

       <OptionSelector
        optionKey="mgmt_id"
        title="Select Management Controller/Port"
        options={mgmtOptions}
        selectedId={selectedMgmtId}
        onChange={(value) => onOptionChange('mgmt_id', value)}
      />
      
       {/* TODO: Add options for fiber channel adapters etc. if applicable */}
    </div>
  );
}

export default NetworkingTab;