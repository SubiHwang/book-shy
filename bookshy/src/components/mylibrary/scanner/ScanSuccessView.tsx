// src/components/scanner/ScanSuccessView.tsx
import React from 'react';

const ScanSuccessView: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
      <div className="bg-green-500 rounded-full p-4 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
};

export default ScanSuccessView;
