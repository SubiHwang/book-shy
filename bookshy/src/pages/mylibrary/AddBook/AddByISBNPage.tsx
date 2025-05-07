import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException, DecodeHintType, BarcodeFormat } from '@zxing/library';

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

  // 콘솔 로깅 함수
  const logDebug = (message: string, data?: any) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[ISBN Scanner ${timestamp}] ${message}`, data || '');
  };

  // ISBN 유효성 검사 함수
  const validateISBN = (isbn: string): boolean => {
    // ISBN-10 유효성 검사
    if (isbn.length === 10) {
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(isbn[i]) * (10 - i);
      }
      const checkDigit = isbn[9] === 'X' ? 10 : parseInt(isbn[9]);
      const isValid = (sum + checkDigit) % 11 === 0;
      logDebug(`ISBN-10 유효성 검사: ${isValid ? '유효함' : '유효하지 않음'}`);
      return isValid;
    }
    // ISBN-13 유효성 검사
    else if (isbn.length === 13) {
      let sum = 0;
      for (let i = 0; i < 12; i++) {
        sum += parseInt(isbn[i]) * (i % 2 === 0 ? 1 : 3);
      }
      const checkDigit = parseInt(isbn[12]);
      const isValid = (10 - (sum % 10)) % 10 === checkDigit;
      logDebug(`ISBN-13 유효성 검사: ${isValid ? '유효함' : '유효하지 않음'}`);
      return isValid;
    }
    logDebug(`ISBN 길이 오류: ${isbn.length}자리`);
    return false;
  };

  useEffect(() => {
    const initCamera = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }

        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        logDebug('카메라 접근 요청', constraints);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        // 카메라 정보 로깅
        const videoTrack = stream.getVideoTracks()[0];
        logDebug('활성화된 카메라:', videoTrack.label);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          logDebug('비디오 요소에 스트림 설정');

          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current?.play();
              logDebug('비디오 재생 시작');
              setCameraReady(true);

              // 바코드 형식 힌트 설정
              const hints = new Map();
              hints.set(DecodeHintType.POSSIBLE_FORMATS, [
                BarcodeFormat.EAN_13,
                BarcodeFormat.EAN_8,
                BarcodeFormat.CODE_39,
                BarcodeFormat.CODE_128,
              ]);
              logDebug('바코드 리더 형식 설정:', 'EAN_13, EAN_8, CODE_39, CODE_128');

              readerRef.current = new BrowserMultiFormatReader(hints);
              logDebug('바코드 리더 초기화 완료');

              // 항상 자동 스캔 시작 (autoScanMode는 항상 true)
              startAutoScan();
            } catch (err) {
              logDebug('비디오 재생 실패:', err);
              setError(
                err instanceof Error ? `비디오 재생 실패: ${err.message}` : '비디오 재생 오류',
              );
            }
          };
        }
      } catch (err) {
        logDebug('카메라 접근 오류:', err);
        setError(err instanceof Error ? `카메라 접근 오류: ${err.message}` : '카메라 사용 불가');
      }
    };

    initCamera();

    return () => {
      logDebug('컴포넌트 언마운트 - 리소스 정리');
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startAutoScan = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    logDebug('자동 스캔 시작');
    // 스캔 간격을 500ms로 설정
    scanIntervalRef.current = setInterval(() => {
      if (!scanning && cameraReady && !scanSuccess) {
        handleScan();
      }
    }, 1000);
  };

  const stopAutoScan = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      logDebug('자동 스캔 중지');
    }
  };

  const enhanceImageForBarcode = (
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    logDebug(`이미지 품질 개선 처리 시작 (${width}x${height})`);

    // 이미지 품질 향상 처리
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    // 대비 향상
    for (let i = 0; i < data.length; i += 4) {
      // 그레이스케일 변환
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;

      // 대비만 향상
      const contrast = 1.5; // 대비 계수
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      data[i] = factor * (avg - 128) + 128; // R
      data[i + 1] = factor * (avg - 128) + 128; // G
      data[i + 2] = factor * (avg - 128) + 128; // B
    }

    context.putImageData(imageData, 0, 0);
    logDebug('이미지 품질 개선 처리 완료');
  };

  const handleScan = async () => {
    if (scanning || scanSuccess) return;
    setScanning(true);

    setScanAttempts((prev) => prev + 1);
    logDebug(`스캔 시도 #${scanAttempts + 1} 시작`);

    try {
      if (!videoRef.current || !canvasRef.current || !readerRef.current) {
        setLastError('스캔 준비가 완료되지 않았습니다.');
        logDebug('스캔 준비 미완료 - 참조 누락');
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        setLastError('캔버스 오류');
        logDebug('캔버스 컨텍스트 생성 실패');
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      logDebug(`캔버스 크기 설정: ${canvas.width}x${canvas.height}`);

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      logDebug('비디오 프레임을 캔버스에 그림');

      // 이미지 품질 향상 적용
      enhanceImageForBarcode(context, canvas.width, canvas.height);

      try {
        logDebug('바코드 디코딩 시도');
        const result = await readerRef.current.decodeFromCanvas(canvas);

        const rawText = result.getText();
        logDebug('인식된 바코드 원시 텍스트:', rawText);

        const format = result.getBarcodeFormat().toString();
        logDebug('인식된 바코드 형식:', format);

        const isbn = rawText.replace(/[^0-9X]/g, '');
        logDebug('정제된 ISBN:', isbn);

        // ISBN 길이 및 유효성 검사
        if ((isbn.length === 10 || isbn.length === 13) && validateISBN(isbn)) {
          logDebug('유효한 ISBN 인식 성공:', isbn);
          setLastScannedData(isbn);
          setScanSuccess(true);

          // 자동 스캔 중지
          stopAutoScan();

          // 성공 시 진동 피드백 (지원되는 경우)
          if (navigator.vibrate) {
            navigator.vibrate(200);
            logDebug('진동 피드백 제공');
          }

          setTimeout(() => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            logDebug('인식 성공 후 페이지 이동');
            navigate(`/bookshelf/add/isbn-result/${isbn}`);
          }, 1000);
        } else {
          logDebug('유효하지 않은 ISBN 형식:', isbn);
          setLastError('유효한 ISBN 형식이 아닙니다. 다시 시도해주세요.');
        }
      } catch (err) {
        if (err instanceof NotFoundException) {
          logDebug('바코드를 찾지 못함');
          setLastError('바코드를 찾지 못했습니다.');
        } else {
          logDebug('스캔 오류 발생:', err);
          setLastError(err instanceof Error ? `스캔 오류: ${err.message}` : '스캔 중 오류');
        }
      }
    } finally {
      setScanning(false);
      logDebug(`스캔 시도 #${scanAttempts + 1} 완료`);
    }
  };

  const handleManualEntry = () => {
    logDebug('직접 입력 버튼 클릭');
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    navigate(`/bookshelf/add/isbn-result/9788934972464`);
  };

  const handleRetry = () => {
    logDebug('카메라 재시작 버튼 클릭');
    setScanSuccess(false);
    setLastScannedData(null);
    setLastError(null);
    setScanAttempts(0);

    // 항상 자동 스캔 시작
    startAutoScan();
  };

  const handleBack = () => {
    logDebug('뒤로가기 버튼 클릭');
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
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
          <p className="text-xs text-gray-400 mt-1">
            바코드를 인식 중입니다... (시도: {scanAttempts})
          </p>
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
                scanSuccess
                  ? 'border-green-400 animate-pulse'
                  : scanning
                    ? 'border-yellow-400 animate-pulse'
                    : 'border-white'
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

      {/* 하단 영역 - 직접 입력 버튼만 표시 */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-black z-10 flex items-center justify-center text-white">
        {error && (
          <button className="px-4 py-2 bg-blue-500 rounded-md" onClick={handleRetry}>
            다시 시도
          </button>
        )}
        {cameraReady && !scanSuccess && !error && (
          <button className="px-4 py-2 bg-blue-500 rounded-md" onClick={handleManualEntry}>
            직접 입력
          </button>
        )}
      </div>
    </div>
  );
};

export default AddByBarcodePage;
