import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import { setCapturedImage, setOCRTextList } from '@/store/ocrSlice';

const AddByISBNPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null); // 스트림 참조를 저장
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream; // 스트림 참조 저장
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('카메라 접근 실패:', error);
        // 에러 처리 로직 추가 (사용자에게 알림 등)
      }
    };
    startCamera();

    // 컴포넌트 언마운트 시 카메라 종료
    return () => {
      stopCamera();
    };
  }, []);

  // 카메라 종료 함수
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop(); // 모든 트랙(카메라) 종료
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // useEffect(() => {
  //   // 하단 탭바 숨기기
  //   const bottomTabBar = document.querySelector('.fixed.bottom-0');
  //   if (bottomTabBar) {
  //     bottomTabBar.classList.add('hidden');
  //   }

  //   return () => {
  //     const bottomTabBar = document.querySelector('.fixed.bottom-0');
  //     if (bottomTabBar) {
  //       bottomTabBar.classList.remove('hidden');
  //     }
  //   };
  // }, []);

  const handleBack = () => {
    stopCamera(); // 뒤로가기 시 카메라 종료
    window.history.back();
  };

  const handleCapture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 📸 이미지 캡처
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png');

    // 📦 Redux에 저장 (이미지 저장)
    dispatch(setCapturedImage(imageDataUrl));

    // 📸 이미지 캡처 후 카메라 종료
    stopCamera();

    // 🔍 OCR 처리
    const result = await Tesseract.recognize(imageDataUrl, 'kor+eng', {
      logger: (m) => console.log(m),
    });

    // 🔠 텍스트 정제: 줄 단위 분할, 공백 제거, 기호 제거
    const rawText = result.data.text;
    const lines = rawText
      .split('\n')
      .map((line) => line.replace(/[^가-힣a-zA-Z0-9\s]/g, '').trim())
      .filter((line) => line.length > 1);

    // 📦 Redux에 OCR 결과 저장
    dispatch(setOCRTextList(lines));

    // 👉 결과 페이지로 이동
    navigate('/bookshelf/add/ocr-result');
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* 상단 검은색 영역 */}
      <div className="absolute top-0 left-0 w-full h-32 bg-black z-10">
        <div className="flex flex-col items-center justify-center w-full h-full text-white">
          {/* 뒤로가기 버튼 - 왼쪽 정렬 */}
          <div className="absolute top-4 left-4">
            <button onClick={handleBack} className="text-xl">
              ←
            </button>
          </div>

          {/* 중앙 텍스트 */}
          <div className="text-center">
            <h2 className="text-lg font-bold">등록할 책의 바코드를를 찍어주세요</h2>
          </div>
        </div>
      </div>

      {/* 카메라 영역 - 상하 검은 영역을 제외한 중앙 부분 */}
      <div className="absolute inset-x-0 top-32 bottom-24">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      </div>

      {/* 하단 검은색 영역 */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-black z-10">
        {/* 촬영 버튼 */}
        <div className="flex justify-center items-center w-full h-full">
          <button
            onClick={handleCapture}
            className="w-16 h-16 bg-white rounded-full border-4 border-black shadow-md"
          />
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default AddByISBNPage;

// 백엔드로 ocr 처리를 보낸다면...
// const handleCapture = async () => {
//   const video = videoRef.current;
//   const canvas = canvasRef.current;
//   if (!video || !canvas) return;

//   // 캡처
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   const ctx = canvas.getContext('2d');
//   if (!ctx) return;

//   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//   const imageDataUrl = canvas.toDataURL('image/png');

//   dispatch(setCapturedImage(imageDataUrl)); // 필요하면 캡처 이미지 저장

//   // ✅ 백엔드에 이미지 전송
//   const blob = await (await fetch(imageDataUrl)).blob();
//   const formData = new FormData();
//   formData.append('image', blob, 'capture.png');

//   const response = await fetch('/api/ocr', {
//     method: 'POST',
//     body: formData,
//   });

//   const data = await response.json(); // OCR 결과 & 책 리스트 예상

//   dispatch(setOCRTextList(data.ocrTextList)); // 필요하면 여전히 저장
//   // 👉 결과 페이지로 이동
//   navigate('/bookshelf/ocr-result');
// };
