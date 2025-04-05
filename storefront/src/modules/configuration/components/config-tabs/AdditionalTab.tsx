"use client"

import React from 'react'
import { ConfigTabProps } from '.' 
import OptionSelector from '../shared/OptionSelector'

// Placeholder component
const AdditionalTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {

  // TODO: Fetch actual options based on the product 
  const psuOptions = [
    { id: 'psu_550', name: '550W Power Supply', price_delta: 0 },
    { id: 'psu_750', name: '750W Redundant Power Supply (1+1)', price_delta: 18000 }, // +$180.00
    { id: 'psu_1100', name: '1100W Redundant Power Supply (1+1)', price_delta: 35000 }, // +$350.00
  ];

  const osOptions = [
    { id: 'os_none', name: 'No Operating System', price_delta: 0 },
    { id: 'os_ws2022_std', name: 'Windows Server 2022 Standard', price_delta: 80000 }, // +$800.00
    { id: 'os_rhel9', name: 'Red Hat Enterprise Linux 9 (Subscription)', price_delta: 50000 }, // +$500.00
  ];

  const selectedPsuId = currentConfiguration['psu_id'] || psuOptions[0]?.id || null;
  const selectedOsId = currentConfiguration['os_id'] || osOptions[0]?.id || null;

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
        title="Select Operating System"
        options={osOptions}
        selectedId={selectedOsId}
        onChange={(value) => onOptionChange('os_id', value)}
      />

      {/* TODO: Add other sections like RAID controllers, Management software, Warranty etc. */}
    </div>
  );
}

export default AdditionalTab; 