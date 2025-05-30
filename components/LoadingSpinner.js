import React from 'react';

export default function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 border-amber-500 border-t-transparent rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-amber-100">{text}</p>}
    </div>
  );
} 