"use client"

import React from 'react'
import { ConfigTabProps } from '.' 
import OptionSelector from '../shared/OptionSelector'
// Import other controls if needed, e.g., Checkbox
// import { Checkbox } from "@medusajs/ui"

// Placeholder component
const AdditionalTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {

  // TODO: Fetch actual options based on the product 
  const psuOptions = [
    { id: 'psu_550', name: '550W Power Supply', description: 'Single PSU', price_delta: 0, is_compatible: true },
    { id: 'psu_750_r', name: '750W Redundant Power Supply (1+1)', description: 'Hot-swappable redundant PSU', price_delta: 18000, is_compatible: true },
    { id: 'psu_1100_r', name: '1100W Redundant Power Supply (1+1)', description: 'High-power redundant PSU', price_delta: 35000, is_compatible: true },
  ];

  const osOptions = [
    { id: 'os_none', name: 'No Operating System', price_delta: 0 },
    { id: 'os_ws2022_std', name: 'Windows Server 2022 Standard (16-core)', price_delta: 80000 },
    { id: 'os_rhel9', name: 'Red Hat Enterprise Linux 9 (1yr Subscription)', price_delta: 50000 },
    { id: 'os_esxi', name: 'VMware ESXi (License Required)', price_delta: 10000 }, // Example base price for install
  ];
  
  const warrantyOptions = [
      { id: 'warr_1y', name: '1 Year Basic Hardware Support', price_delta: 0 },
      { id: 'warr_3y_pro', name: '3 Year ProSupport (Next Business Day)', price_delta: 25000 },
      { id: 'warr_5y_pro_4h', name: '5 Year ProSupport (4-Hour Response)', price_delta: 75000 },
  ];

  const selectedPsuId = currentConfiguration['psu_id'] || psuOptions[0]?.id || null;
  const selectedOsId = currentConfiguration['os_id'] || osOptions[0]?.id || null;
  const selectedWarrantyId = currentConfiguration['warranty_id'] || warrantyOptions[0]?.id || null;

  return (
    <div className="space-y-8">
      <OptionSelector
        optionKey="psu_id"
        title="Select Power Supply Unit (PSU)"
        options={psuOptions}
        selectedId={selectedPsuId}
        onChange={(value) => onOptionChange('psu_id', value)}
      />

      <OptionSelector
        optionKey="os_id"
        title="Select Operating System (Optional)"
        options={osOptions}
        selectedId={selectedOsId}
        onChange={(value) => onOptionChange('os_id', value)}
      />
      
      <OptionSelector
        optionKey="warranty_id"
        title="Select Warranty / Support Level"
        options={warrantyOptions}
        selectedId={selectedWarrantyId}
        onChange={(value) => onOptionChange('warranty_id', value)}
      />

      {/* TODO: Add other sections like RAID controllers, Management software etc. using appropriate controls */}
    </div>
  );
}

export default AdditionalTab; 