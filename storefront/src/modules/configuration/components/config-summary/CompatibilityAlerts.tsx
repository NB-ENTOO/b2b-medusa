"use client"

import React from 'react'
import { CheckCircleSolid, XCircleSolid } from "@medusajs/icons"

interface CompatibilityAlertsProps {
  isValid: boolean;
  validationMessages: string[];
}

const CompatibilityAlerts: React.FC<CompatibilityAlertsProps> = ({
  isValid,
  validationMessages,
}) => {
  if (isValid && validationMessages.length === 0) {
    return (
      <div className="flex items-center text-green-600">
        <CheckCircleSolid className="mr-2" />
        <span>Configuration is valid.</span>
      </div>
    );
  }

  return (
    <div className="text-red-600 space-y-1">
      <div className="flex items-center font-medium">
         <XCircleSolid className="mr-2" />
         <span>Compatibility Issues Found:</span>
      </div>
      <ul className="list-disc pl-8 text-sm">
        {validationMessages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
        {validationMessages.length === 0 && !isValid && (
           <li>Unknown compatibility issue detected.</li> 
        )}
      </ul>
    </div>
  );
}

export default CompatibilityAlerts; 