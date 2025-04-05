"use client"

import React from 'react'
import { ConfigTabProps } from '.' // Import shared props type

// TODO: Define Product type properly if needed beyond props
type Product = any;

const ProductBasicTab: React.FC<ConfigTabProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {

  // TODO: Extract relevant base options/info from product or currentConfiguration
  const baseSKU = currentConfiguration['base_sku'] || product.variants?.[0]?.sku || 'N/A';
  const basePrice = currentConfiguration['base_price'] || 0; // Fetch price properly later

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Base Product Information</h3>
      {/* Display basic product info, potentially selecting base variant/SKU */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base Model SKU</label>
          <p className="text-gray-900">{baseSKU}</p>
          {/* If selectable:
          <select 
             value={baseSKU}
             onChange={(e) => onOptionChange('base_sku', e.target.value)}
             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
             <option value="SKU1">Model R740 - Base</option>
             <option value="SKU2">Model R740 - Perf</option> 
          </select> */}
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (Estimate)</label>
           <p className="text-gray-900 font-semibold">${(basePrice / 100).toFixed(2)}</p> 
        </div>

        {/* Add more basic info display as needed */}
        
      </div>
    </div>
  );
}

export default ProductBasicTab; 