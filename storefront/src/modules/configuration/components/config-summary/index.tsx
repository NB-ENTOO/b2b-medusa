"use client"

import React from 'react'
import SelectedOptions from './SelectedOptions'
import PriceSummary from './PriceSummary'
import CompatibilityAlerts from './CompatibilityAlerts'
import ActionButtons from './ActionButtons'

// TODO: Define Product and ConfigurationState types properly
type Product = any;
interface ConfigurationState {
  selectedOptions: Record<string, any>;
  totalPrice: number;
  isValid: boolean;
  validationMessages: string[];
}

interface ConfigSummaryProps {
  product: Product;
  configuration: ConfigurationState;
}

const ConfigSummary: React.FC<ConfigSummaryProps> = ({ product, configuration }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <h3 className="text-xl font-semibold mb-4">Configuration Summary</h3>
      
      <div className="space-y-6">
        <SelectedOptions 
          selectedOptions={configuration.selectedOptions}
          product={product} 
        />
        
        <hr />
        
        <PriceSummary 
          totalPrice={configuration.totalPrice} 
        />

        <CompatibilityAlerts 
          isValid={configuration.isValid}
          validationMessages={configuration.validationMessages}
        />
        
        <ActionButtons 
          productId={product.id} // Assuming product has an id
          configuration={configuration.selectedOptions}
          isValid={configuration.isValid}
        />
      </div>
    </div>
  );
}

export default ConfigSummary; 