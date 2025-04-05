"use client"

import React, { useState } from 'react'
// Use relative paths - should work now that files exist
import ConfigTabs from '../config-tabs'
import ConfigSummary from '../config-summary'
import { HttpTypes } from '@medusajs/types'

// Placeholder type - replace with actual Product type later
type Product = HttpTypes.StoreProduct & {
  // Add specific fields if needed, e.g., configuration_schema
}

interface ConfigurationBuilderProps {
  product: Product;
  // Add other props like region, countryCode etc. if needed
}

// Placeholder state - replace with actual configuration state management
interface ConfigurationState {
  selectedOptions: Record<string, any>;
  totalPrice: number;
  isValid: boolean;
  validationMessages: string[];
}

const ConfigurationBuilder: React.FC<ConfigurationBuilderProps> = ({ product }) => {
  // TODO: Replace with actual state management (e.g., Context, Redux, Zustand)
  const [configuration, setConfiguration] = useState<ConfigurationState>(() => ({
    selectedOptions: {},
    // TODO: Get initial price properly - maybe from a required base variant or prop
    totalPrice: 0, // Placeholder initial price
    isValid: true,
    validationMessages: [],
  }));

  // TODO: Implement handler to update configuration state from tabs
  const handleOptionChange = (tabKey: string, optionKey: string, value: any) => {
    console.log(`Option changed in ${tabKey}: ${optionKey} = ${value}`);
    // Update selectedOptions
    // Trigger validation and price calculation
    // Update configuration state
    setConfiguration(prev => ({
      ...prev,
      selectedOptions: {
        ...prev.selectedOptions,
        [optionKey]: value // Simple update, might need more complex logic based on key/tab
      }
      // TODO: Update price, validity, messages based on backend response/rules
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold mb-6">Configure: {product.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Configuration Tabs Section (takes 2/3 width on medium screens) */}
        <div className="md:col-span-2">
           {/* UNCOMMENTED - Imports should resolve now */}
          <ConfigTabs
            product={product}
            onOptionChange={handleOptionChange}
            currentConfiguration={configuration.selectedOptions}
          />
        </div>

        {/* Summary Panel (takes 1/3 width on medium screens) */}
        <div className="md:col-span-1 sticky top-24 h-fit">
           {/* UNCOMMENTED - Should resolve now */}
           <ConfigSummary 
             product={product} 
             configuration={configuration} 
           />
           {/* <div>Config Summary Placeholder</div> Commented out placeholder */}
        </div>
      </div>
    </div>
  );
};

export default ConfigurationBuilder;

// *** Removing commented out code and empty export *** 