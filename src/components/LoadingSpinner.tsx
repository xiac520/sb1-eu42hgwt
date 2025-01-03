import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
  </div>
);