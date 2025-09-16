
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-2 text-green-500">The world is changing...</p>
    </div>
  );
};

export default LoadingSpinner;
