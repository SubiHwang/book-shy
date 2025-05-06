import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException } from '@zxing/library';

const AddByBarcodePage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [lastScannedData, setLastScannedData] = useState<string | null>(null);
  const [scanAttempts, setScanAttempts] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const initCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current?.play();
              setCameraReady(true);
              readerRef.current = new BrowserMultiFormatReader();
              startAutoScan();
            } catch (err) {
              setError(
                err instanceof Error ? `비디오 재생 실패: ${err.message}` : '비디오 재생 오류',
              );
            }
          };
        }
      } catch (err) {
        setError(err instanceof Error ? `카메라 접근 오류: ${err.message}` : '카메라 사용 불가');
      }
    };

    initCamera();

    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startAutoScan = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    scanIntervalRef.current = setInterval(() => {
      if (!scanning && cameraReady && !scanSuccess) {
        handleScan();
      }
    }, 1500);
  };

  const handleScan = async () => {
    if (scanning || scanSuccess) return;
    setScanning(true);
    setScanAttempts((prev) => prev + 1);

    try {
      if (!videoRef.current || !canvasRef.current || !readerRef.current) {
        setLastError('스캔 준비가 완료되지 않았습니다.');
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) {
        setLastError('캔버스 오류');
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const result = await readerRef.current.decodeFromCanvas(canvas);
        const rawText = result.getText();
        const isbn = rawText.replace(/[^0-9X]/g, '');

        if (isbn.length === 10 || isbn.length === 13) {
          setLastScannedData(isbn);
          setScanSuccess(true);
          if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

          setTimeout(() => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            navigate(`/bookshelf/add/isbn-result/${isbn}`);
          }, 1000);
        } else {
          setLastError('유효한 ISBN 형식이 아닙니다. 다시 시도해주세요.');
        }
      } catch (err) {
        if (err instanceof NotFoundException) {
          setLastError('바코드를 찾지 못했습니다.');
        } else {
          setLastError(err instanceof Error ? `스캔 오류: ${err.message}` : '스캔 중 오류');
        }
      }
    } finally {
      setScanning(false);
    }
  };

  const handleManualEntry = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    navigate(`/bookshelf/add/isbn-result/9788934972464`);
  };

  const handleRetry = () => {
    setScanSuccess(false);
    setLastScannedData(null);
    setLastError(null);
    setScanAttempts(0);
    startAutoScan();
  };

  const handleBack = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-black">
      <canvas ref={canvasRef} className="hidden" />

      {/* 상단 안내 */}
      <div className="absolute top-0 left-0 w-full h-32 z-10 text-white bg-black flex flex-col items-center justify-center">
        <div className="absolute top-4 left-4">
          <button onClick={handleBack} className="text-xl text-white">
            ←
          </button>
        </div>
        <h2 className="text-lg font-bold">
          {error || (scanSuccess ? '✅ ISBN 인식 성공!' : '등록할 책의 바코드를 찍어주세요')}
        </h2>
        {lastScannedData && <p className="text-sm text-green-400 mt-1">ISBN: {lastScannedData}</p>}
        {lastError && !scanSuccess && <p className="text-xs text-red-400 mt-1">{lastError}</p>}
        {scanAttempts > 0 && !scanSuccess && !lastError && (
          <p className="text-xs text-gray-400 mt-1">바코드를 인식 중입니다...</p>
        )}
      </div>

      {/* 비디오 화면 */}
      <div className="absolute top-32 bottom-24 inset-x-0">
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

        {/* 스캔 가이드 영역 */}
        {cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`w-64 h-24 border-4 ${
                scanSuccess ? 'border-green-400 animate-pulse' : 'border-white'
              } rounded-lg opacity-80`}
            />
          </div>
        )}

        {/* 스캔 성공 시 오버레이 */}
        {scanSuccess && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
            <div className="bg-green-500 rounded-full p-4 animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-black z-10 flex flex-col items-center justify-center text-white">
        {!error && !scanSuccess && <p>카메라를 바코드에 맞춰주세요</p>}
        <div className="flex mt-2 space-x-2">
          {error && (
            <button className="px-4 py-2 bg-blue-500 rounded-md" onClick={handleRetry}>
              다시 시도
            </button>
          )}
          {cameraReady && !scanSuccess && !error && (
            <>
              <button className="px-4 py-2 bg-gray-700 rounded-md" onClick={handleRetry}>
                카메라 재시작
              </button>
              <button className="px-4 py-2 bg-blue-500 rounded-md" onClick={handleManualEntry}>
                직접 입력
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddByBarcodePage;
