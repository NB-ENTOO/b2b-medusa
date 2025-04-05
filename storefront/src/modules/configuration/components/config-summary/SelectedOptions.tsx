"use client"

import React from 'react'

// TODO: Define Product type properly
type Product = any;

interface SelectedOptionsProps {
  selectedOptions: Record<string, any>;
  product: Product; // Needed for context (e.g., option labels)
}

const SelectedOptions: React.FC<SelectedOptionsProps> = ({ selectedOptions, product }) => {
  // TODO: Enhance rendering to show labels/names instead of just keys/values
  return (
    <div>
      <h4 className="text-md font-medium mb-2">Selected Options:</h4>
      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
        {Object.entries(selectedOptions).map(([key, value]) => (
          <li key={key}>
            <span className="font-semibold">{key}:</span> {JSON.stringify(value)}
          </li>
        ))}
        {Object.keys(selectedOptions).length === 0 && (
          <li className="text-gray-500">No options selected yet.</li>
        )}
      </ul>
    </div>
  );
}

export default SelectedOptions; 