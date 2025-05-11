// src/components/scanner/ScannerOverlay.tsx
import React from 'react';

const ScannerOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative">
        <div className="w-64 h-48 border-2 border-white rounded-md relative overflow-hidden">
          {/* 모서리 표시 - 좌상단 */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white" />
          {/* 모서리 표시 - 우상단 */}
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white" />
          {/* 모서리 표시 - 좌하단 */}
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white" />
          {/* 모서리 표시 - 우하단 */}
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white" />

          {/* 스캔 라인 - 순수 CSS로 애니메이션 적용 */}
          <div className="scan-line" />
        </div>
      </div>
    </div>
  );
};

export default ScannerOverlay;
