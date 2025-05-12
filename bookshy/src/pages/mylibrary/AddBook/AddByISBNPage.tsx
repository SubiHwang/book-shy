// src/pages/mylibrary/AddBook/AddByISBNPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ISBNScanner from '@/components/mylibrary/scanner/ISBNScanner';
import ScannerHeader from '@/components/mylibrary/scanner/ScannerHeader';
import ScannerOverlay from '@/components/mylibrary/scanner/ScannerOverlay';
import ScannerControls from '@/components/mylibrary/scanner/ScannerControls';
import ScanSuccessView from '@/components/mylibrary/scanner/ScanSuccessView';
import { useISBNScanner } from '@/hooks/scanner/useISBNScanner';
import './AddByISBNPage.css';
const AddByBarcodePage: React.FC = () => {
  const navigate = useNavigate();

  const handleScanSuccess = (isbn: string) => {
    // 이전에는 navigate 전에 1초 지연이 있었습니다
    setTimeout(() => {
      navigate(`/bookshelf/add/isbn-result/${isbn}`);
    }, 1000);
  };

  const handleManualEntry = () => {
    scanner.cleanup();
    navigate(`/bookshelf/add/isbn-result/9788934972464`);
  };

  const handleBack = () => {
    scanner.cleanup();
    navigate(-1);
  };

  const scanner = useISBNScanner({
    onScanSuccess: handleScanSuccess,
  });

  return (
    <div className="fixed inset-0 bg-black">
      <canvas ref={scanner.canvasRef} className="hidden" />

      <ScannerHeader
        error={scanner.error}
        scanSuccess={scanner.scanSuccess}
        lastScannedData={scanner.lastScannedData}
        lastError={scanner.lastError}
        scanAttempts={scanner.scanAttempts}
        onBack={handleBack}
      />

      <ISBNScanner
        videoRef={scanner.videoRef}
        cameraReady={scanner.cameraReady}
        scanSuccess={scanner.scanSuccess}
        error={scanner.error}
      >
        {scanner.cameraReady && !scanner.scanSuccess && <ScannerOverlay />}
        {scanner.scanSuccess && <ScanSuccessView />}
      </ISBNScanner>

      <ScannerControls
        error={scanner.error}
        cameraReady={scanner.cameraReady}
        scanSuccess={scanner.scanSuccess}
        onRetry={scanner.handleRetry}
        onManualEntry={handleManualEntry}
      />
    </div>
  );
};

export default AddByBarcodePage;
