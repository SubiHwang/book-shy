// src/components/scanner/ScannerHeader.tsx
import React from 'react';

interface ScannerHeaderProps {
  error: string | null;
  scanSuccess: boolean;
  lastScannedData: string | null;
  lastError: string | null;
  scanAttempts: number;
  onBack: () => void;
}

const ScannerHeader: React.FC<ScannerHeaderProps> = ({
  error,
  scanSuccess,
  lastScannedData,
  lastError,
  scanAttempts,
  onBack,
}) => {
  return (
    <div className="absolute top-0 left-0 w-full z-10 pt-8 pb-4 text-white bg-black bg-opacity-70 flex flex-col items-center justify-center">
      <div className="absolute top-8 left-4">
        <button onClick={onBack} className="text-2xl text-white">
          ←
        </button>
      </div>
      <h2 className="text-xl font-bold">
        {error || (scanSuccess ? '✅ ISBN 인식 성공!' : '바코드 스캔 중...')}
      </h2>
      {lastScannedData && <p className="text-sm text-green-400 mt-1">ISBN: {lastScannedData}</p>}
      {lastError && !scanSuccess && <p className="text-xs text-red-400 mt-1">{lastError}</p>}
      {!scanSuccess && (
        <p className="text-xs text-gray-300 mt-1">
          바코드를 네모 칸에 맞춰주세요 (시도: {scanAttempts})
        </p>
      )}
    </div>
  );
};

export default ScannerHeader;
