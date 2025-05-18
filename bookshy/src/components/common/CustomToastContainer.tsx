import React, { useEffect, useState } from 'react';
import { ToastContainer, toast, cssTransition, ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';

// 부드러운 슬라이드 효과
const smoothSlide = cssTransition({
  enter: 'animate-smoothEnter',
  exit: 'animate-smoothExit',
});

// 개선된 토스트 컨테이너
const CustomToastContainer: React.FC = () => {
  const [headerHeight, setHeaderHeight] = useState(57);

  useEffect(() => {
    const headerElement = document.querySelector('header');
    if (headerElement) {
      const height = headerElement.offsetHeight;
      setHeaderHeight(height);
    }
  }, []);

  const containerProps = {
    position: 'top-center' as const,
    transition: smoothSlide,
    autoClose: 1000,
    hideProgressBar: true,
    newestOnTop: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: false,
    draggable: true,
    pauseOnHover: false,
    closeButton: false,
    className: 'w-full px-4 mx-auto',
    style: {
      marginTop: `${headerHeight + 8}px`, // 8픽셀 추가 여백
      width: '100%',
      padding: 0,
    },
  } as ToastContainerProps;

  return (
    <ToastContainer
      {...containerProps}
      toastClassName={
        () => 'flex bg-[#6c6864] text-white border-0 shadow-lg w-full p-3 mb-2 overflow-hidden rounded-lg' // 더 둥근 모서리
      }
    />
  );
};

// 개선된 토스트 메시지 컴포넌트
interface ToastMessageProps {
  message: string;
}

const SuccessMessage: React.FC<ToastMessageProps> = ({ message }) => (
  <div className="py-2 px-2 flex items-center text-sm font-medium">
    {' '}
    {/* 위아래 패딩 증가 */}
    <CheckCircle size={18} className="text-[#4CAF50] mr-3 flex-shrink-0" />
    <span>{message}</span>
  </div>
);

const InfoMessage: React.FC<ToastMessageProps> = ({ message }) => (
  <div className="py-2 px-2 flex items-center text-sm font-medium">
    <Info size={18} className="text-[#2196F3] mr-3 flex-shrink-0" />
    <span>{message}</span>
  </div>
);

const WarningMessage: React.FC<ToastMessageProps> = ({ message }) => (
  <div className="py-2 px-2 flex items-center text-sm font-medium">
    <AlertTriangle size={18} className="text-[#FF9800] mr-3 flex-shrink-0" />
    <span>{message}</span>
  </div>
);

const ErrorMessage: React.FC<ToastMessageProps> = ({ message }) => (
  <div className="py-2 px-2 flex items-center text-sm font-medium">
    <XCircle size={18} className="text-[#F44336] mr-3 flex-shrink-0" />
    <span>{message}</span>
  </div>
);

const DarkMessage: React.FC<ToastMessageProps> = ({ message }) => (
  <div className="py-2 px-2 flex items-center text-sm font-medium">
    <CheckCircle size={18} className="text-[#4CAF50] mr-3 flex-shrink-0" />{' '}
    {/* 성공 아이콘으로 변경 */}
    <span>{message}</span>
  </div>
);

// 개선된 토스트 알림 객체
const notify = {
  success: (message: string) =>
    toast(<SuccessMessage message={message} />, {
      className: '!bg-black !border-l-4 !border-l-[#4CAF50] !mx-3', // 좌우 여백 추가
    }),
  info: (message: string) =>
    toast(<InfoMessage message={message} />, {
      className: '!bg-black !border-l-4 !border-l-[#2196F3] !mx-3',
    }),
  warning: (message: string) =>
    toast(<WarningMessage message={message} />, {
      className: '!bg-black !border-l-4 !border-l-[#FF9800] !mx-3',
    }),
  error: (message: string) =>
    toast(<ErrorMessage message={message} />, {
      className: '!bg-black !border-l-4 !border-l-[#F44336] !mx-3',
    }),
  // 이미지에서 보여주신 스타일
  dark: (message: string) =>
    toast(<DarkMessage message={message} />, {
      className: '!bg-black text-white !border-0 !shadow-lg !mx-3', // 좌우 여백 추가
    }),
};

export { CustomToastContainer, notify };
