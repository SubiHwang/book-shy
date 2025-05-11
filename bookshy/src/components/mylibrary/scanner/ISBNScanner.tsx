// src/components/scanner/ISBNScanner.tsx
import React, { ReactNode } from 'react';

interface ISBNScannerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraReady: boolean;
  scanSuccess: boolean;
  error: string | null;
  children: ReactNode;
}

const ISBNScanner: React.FC<ISBNScannerProps> = ({
  videoRef,
  cameraReady,
  scanSuccess,
  error,
  children,
}) => {
  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        playsInline
        className={`w-full h-full object-cover ${scanSuccess ? 'opacity-50' : ''}`}
      />

      {!cameraReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-white rounded-full animate-spin" />
        </div>
      )}

      {children}
    </div>
  );
};

export default ISBNScanner;
