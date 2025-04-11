// src/components/LoadingState.jsx
import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingState;