// src/components/Dashboard/SkeletonCard.jsx
import React from 'react';

function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-gray-50 p-4 space-y-2">
      <div className="h-4 w-24 animate-pulse bg-gray-300 rounded"></div>
      <div className="flex items-center justify-between">
        <div className="h-5 w-5 animate-pulse bg-gray-300 rounded-full"></div>
        <div className="h-8 w-8 animate-pulse bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;