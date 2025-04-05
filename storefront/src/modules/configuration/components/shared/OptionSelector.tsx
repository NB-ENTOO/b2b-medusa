"use client"

import React from 'react'
import { clx } from "@medusajs/ui"

// TODO: Define option types more precisely
interface Option {
  id: string;       // e.g., variant ID or unique option identifier
  name: string;     // e.g., "Intel Xeon Gold 6248R", "1TB NVMe SSD"
  price_delta?: number; // Price difference from base (in cents), optional
  description?: string; // Optional description
  is_compatible?: boolean; // Optional compatibility flag
}

interface OptionSelectorProps {
  optionKey: string; // Key to identify this option group (e.g., 'processor_id', 'storage_config')
  title: string;     // Title for the section (e.g., "Select Processor")
  options: Option[]; // Array of available options
  selectedId: string | null;
  onChange: (optionId: string) => void;
  displayType?: 'radio' | 'cards' | 'dropdown'; // Control rendering style
  disabled?: boolean; // Add optional disabled prop
  // Add region/currency props if price deltas need context
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  optionKey,
  title,
  options = [],
  selectedId,
  onChange,
  displayType = 'radio', // Default to radio buttons
  disabled = false, // Handle disabled prop
}) => {

  const renderRadioOptions = () => (
    <fieldset disabled={disabled}> {/* Disable the whole fieldset */}
      <legend className={clx(
        "text-base font-medium text-gray-900 mb-2",
        disabled && "text-gray-400" // Dim legend if disabled
        )}>{title}</legend>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              id={`${optionKey}-${option.id}`}
              name={optionKey}
              type="radio"
              value={option.id}
              checked={selectedId === option.id}
              onChange={() => onChange(option.id)}
              disabled={disabled || option.is_compatible === false} // Combine component disabled state with option compatibility
              className={clx(
                "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500",
                (disabled || option.is_compatible === false) && "opacity-50 cursor-not-allowed"
              )}
            />
            <label 
              htmlFor={`${optionKey}-${option.id}`} 
              className={clx(
                "ml-3 block text-sm font-medium text-gray-700",
                 (disabled || option.is_compatible === false) && "opacity-50 cursor-not-allowed"
              )}
            >
              {option.name}
              {option.price_delta !== undefined && (
                <span className="text-gray-500 ml-2">
                  ({option.price_delta >= 0 ? '+' : ''}${(option.price_delta / 100).toFixed(2)})
                </span>
              )}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );

  // TODO: Implement 'cards' and 'dropdown' display types

  return (
    <div className={clx("mb-6", disabled && "opacity-70")} > {/* Dim whole component */}
      {displayType === 'radio' && renderRadioOptions()}
      {/* Render other display types here */}
       {options.length === 0 && <p className="text-sm text-gray-500">No options available for {title}.</p>}
    </div>
  );
}

export default OptionSelector; 