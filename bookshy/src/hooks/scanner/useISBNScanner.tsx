// src/hooks/useISBNScanner.ts
import { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException, DecodeHintType, BarcodeFormat } from '@zxing/library';

interface ISBNScannerOptions {
  onScanSuccess: (isbn: string) => void;
}

export const useISBNScanner = ({ onScanSuccess }: ISBNScannerOptions) => {
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

  // 유틸리티 함수
  const logDebug = (message: string, data?: any) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    console.log(`[ISBN Scanner ${timestamp}] ${message}`, data || '');
  };

  const validateISBN = (isbn: string): boolean => {
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

  // 스캔 기능
  const startAutoScan = () => {
    logDebug('자동 스캔 시작 함수 호출됨');

    if (scanIntervalRef.current) {
      logDebug('기존 스캔 타이머 정리');
      clearInterval(scanIntervalRef.current);
    }

    logDebug('새 스캔 타이머 설정');
    scanIntervalRef.current = setInterval(() => {
      logDebug(
        `타이머 틱: scanning=${scanning}, cameraReady=${cameraReady}, scanSuccess=${scanSuccess}`,
      );

      if (!scanning && cameraReady && !scanSuccess) {
        logDebug('handleScan 호출 조건 충족');
        handleScan();
      } else {
        logDebug('handleScan 호출 조건 미충족');
      }
    }, 1000);

    logDebug('자동 스캔 타이머 설정 완료');
  };

  const handleScan = async () => {
    logDebug(`스캔 시도: scanning=${scanning}, scanSuccess=${scanSuccess}`);

    // 이미 스캔 중이거나 성공했다면 스킵
    if (scanning || scanSuccess) {
      logDebug('이미 스캔 중이거나 성공 상태로 스캔 중단');
      return;
    }

    setScanning(true);
    setScanAttempts((prev) => prev + 1);
    logDebug(`스캔 시도 횟수 증가: ${scanAttempts + 1}`);

    try {
      if (!videoRef.current || !canvasRef.current || !readerRef.current) {
        setLastError('스캔 준비가 완료되지 않았습니다.');
        logDebug('스캔 준비 미완료 - 참조 누락', {
          videoRef: !!videoRef.current,
          canvasRef: !!canvasRef.current,
          readerRef: !!readerRef.current,
        });
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
          if (navigator.vibrate) navigator.vibrate(200);

          // 원본 코드와 동일하게 동작하도록 여기서는 카메라 스트림을 중지하지 않음
          // onScanSuccess 콜백 호출만 하면 페이지에서 직접 처리함
          onScanSuccess(isbn);
        } else {
          setLastError('유효한 ISBN 형식이 아닙니다. 다시 시도해주세요.');
          logDebug('유효하지 않은 ISBN 형식:', isbn);
        }
      } catch (err) {
        if (err instanceof NotFoundException) {
          setLastError('바코드를 찾지 못했습니다.');
          logDebug('바코드 찾지 못함');
        } else {
          setLastError(err instanceof Error ? `스캔 오류: ${err.message}` : '스캔 중 오류');
          logDebug('스캔 오류:', err);
        }
      }
    } finally {
      logDebug('스캔 완료, 스캔 상태 해제');
      setScanning(false);

      // 스캔이 끝나면 자동으로 다시 스캔을 시작하도록 보장
      if (!scanSuccess) {
        logDebug('스캔 미성공 - 자동 스캔 재시작');
        startAutoScan();
      }
    }
  };

  const handleRetry = () => {
    logDebug('재시도 버튼 클릭');
    setScanSuccess(false);
    setLastScannedData(null);
    setLastError(null);
    setScanAttempts(0);
    startAutoScan();
  };

  const cleanup = () => {
    logDebug('리소스 정리 함수 호출');
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // 카메라 초기화
  useEffect(() => {
    // 컴포넌트 마운트 시 상태 초기화
    setScanning(false);
    setScanSuccess(false);
    setLastScannedData(null);
    setLastError(null);
    setScanAttempts(0);

    logDebug('컴포넌트 마운트 - 카메라 초기화 시작');

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
        logDebug('카메라 스트림 받음', stream.id);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          logDebug('비디오 요소에 스트림 할당');

          videoRef.current.onloadedmetadata = async () => {
            try {
              logDebug('비디오 메타데이터 로드됨, 재생 시작 시도');
              await videoRef.current?.play();
              logDebug('비디오 재생 시작됨');

              setCameraReady(true);
              logDebug('카메라 준비 상태 설정: true');

              // 바코드 형식 힌트 설정
              const hints = new Map();
              hints.set(DecodeHintType.POSSIBLE_FORMATS, [
                BarcodeFormat.EAN_13,
                BarcodeFormat.EAN_8,
                BarcodeFormat.CODE_39,
                BarcodeFormat.CODE_128,
              ]);

              readerRef.current = new BrowserMultiFormatReader(hints);
              logDebug('바코드 리더 초기화 완료');

              // 즉시 첫 스캔 시도 후 자동 스캔 시작
              logDebug('첫 스캔 시도');
              handleScan();
              logDebug('자동 스캔 시작');
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
      cleanup();
    };
  }, []);

  // cameraReady 상태가 변경될 때 스캔을 시작하도록 별도의 useEffect 추가
  useEffect(() => {
    if (cameraReady && !scanSuccess && !scanning) {
      logDebug('카메라 준비됨 - 자동 스캔 시작 (상태 변경 감지)');
      startAutoScan();
    }
  }, [cameraReady, scanSuccess, scanning]);

  return {
    videoRef,
    canvasRef,
    cameraReady,
    error,
    scanning,
    scanSuccess,
    lastScannedData,
    scanAttempts,
    lastError,
    handleScan,
    handleRetry,
    cleanup,
    startAutoScan,
  };
};
