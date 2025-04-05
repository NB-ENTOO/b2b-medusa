"use client"

import React, { useState } from 'react'
import { Tab } from '@headlessui/react'
import { clx } from "@medusajs/ui"

// Import individual tab components (assuming they exist and export default)
import ProductBasicTab from './ProductBasicTab'
import ProcessorTab from './ProcessorTab'
import MemoryTab from './MemoryTab'
import StorageTab from './StorageTab'
import NetworkingTab from './NetworkingTab'
import AdditionalTab from './AdditionalTab'

// TODO: Define Product type properly
type Product = any;

// Define common props for individual tab components
export interface ConfigTabProps {
  product: Product;
  onOptionChange: (optionKey: string, value: any) => void;
  currentConfiguration: Record<string, any>;
}

interface ConfigTabsContainerProps {
  product: Product;
  onOptionChange: (tabKey: string, optionKey: string, value: any) => void;
  currentConfiguration: Record<string, any>;
}

// Define the type for the Component property in availableTabs
type TabComponent = React.FC<ConfigTabProps>;

const ConfigTabs: React.FC<ConfigTabsContainerProps> = ({
  product,
  onOptionChange,
  currentConfiguration,
}) => {
  // Determine which tabs are relevant for the product
  // TODO: This logic should come from product metadata or a configuration schema
  const availableTabs: { key: string; title: string; Component: TabComponent }[] = [
    { key: 'basic', title: 'Base', Component: ProductBasicTab as TabComponent },
    { key: 'processor', title: 'Processor', Component: ProcessorTab as TabComponent },
    { key: 'memory', title: 'Memory', Component: MemoryTab as TabComponent },
    { key: 'storage', title: 'Storage', Component: StorageTab as TabComponent },
    { key: 'networking', title: 'Networking', Component: NetworkingTab as TabComponent },
    { key: 'additional', title: 'Additional', Component: AdditionalTab as TabComponent },
    // Add/remove tabs based on product type/metadata
  ];

  return (
    <div className="w-full">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
          {availableTabs.map((tab) => (
            <Tab
              key={tab.key}
              className={({ selected }) =>
                clx(
                  'w-full rounded-lg py-2.5 px-4 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {tab.title}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {availableTabs.map((tab) => (
            <Tab.Panel
              key={tab.key}
              className={clx(
                'rounded-xl bg-white p-6',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              {/* Now TypeScript should infer the types for onOptionChange from ConfigTabProps */}
              <tab.Component
                product={product}
                onOptionChange={(optionKey, value) => onOptionChange(tab.key, optionKey, value)}
                currentConfiguration={currentConfiguration}
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default ConfigTabs; 