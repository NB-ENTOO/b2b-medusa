"use client"

import React from 'react'
import { clx } from "@medusajs/ui"
import { CheckCircleSolid, XCircleSolid, ExclamationCircleSolid } from "@medusajs/icons"

interface CompatibilityBadgeProps {
  isCompatible?: boolean; // true = compatible, false = incompatible, undefined = unknown/not checked
  className?: string;
}

const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  isCompatible,
  className,
}) => {
  if (isCompatible === undefined) {
    // Optionally render nothing or a neutral indicator if compatibility is unknown
    return null; 
    // Or: return <span className={clx("text-xs text-gray-500", className)}>Info</span>;
  }

  if (isCompatible) {
    return (
      <span 
        className={clx(
          "inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800", 
          className
        )}
        title="Compatible"
      >
        <CheckCircleSolid className="mr-1 h-3 w-3" />
        Compatible
      </span>
    );
  }

  // isCompatible is false
  return (
    <span 
      className={clx(
        "inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800", 
        className
      )}
      title="Incompatible"
    >
      <XCircleSolid className="mr-1 h-3 w-3" />
      Incompatible
    </span>
  );
}

export default CompatibilityBadge; 