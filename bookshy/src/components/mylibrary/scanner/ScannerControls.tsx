// src/components/scanner/ScannerControls.tsx
import React from 'react';

interface ScannerControlsProps {
  error: string | null;
  cameraReady: boolean;
  scanSuccess: boolean;
  onRetry: () => void;
  onManualEntry: () => void;
}

const ScannerControls: React.FC<ScannerControlsProps> = ({
  error,
  //cameraReady,
  //scanSuccess,
  onRetry,
}) => {
  return (
    <div className="absolute bottom-0 left-0 w-full py-8 bg-black bg-opacity-70 z-10 flex items-center justify-center text-white">
      {error && (
        <button className="px-6 py-3 bg-blue-500 rounded-md font-medium" onClick={onRetry}>
          다시 시도
        </button>
      )}
      {/* {cameraReady && !scanSuccess && !error && (
        <button className="px-6 py-3 bg-blue-500 rounded-md font-medium" onClick={onManualEntry}>
          직접 입력
        </button>
      )} */}
    </div>
  );
};

export default ScannerControls;
