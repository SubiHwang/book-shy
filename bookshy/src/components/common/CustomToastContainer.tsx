import React, { useEffect, useState } from 'react';
import { ToastContainer, toast, cssTransition, ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CheckCircle, Info, AlertTriangle, XCircle } from 'lucide-react';

// 네이티브 앱 스타일 트랜지션 효과
const nativeSlide = cssTransition({
  enter: 'animate-slideInDown',
  exit: 'animate-slideOutUp',
});

// 네이티브 앱 스타일 토스트 컨테이너
const CustomToastContainer: React.FC = () => {
  const [headerHeight, setHeaderHeight] = useState(57); // 기본값

  useEffect(() => {
    // 헤더 요소의 실제 높이를 가져옴
    const headerElement = document.querySelector('header');
    if (headerElement) {
      const height = headerElement.offsetHeight;
      setHeaderHeight(height);
    }
  }, []);

  // 인라인 스타일로 처리
  const toastStyle = {
    marginTop: `${headerHeight}px`,
    width: '100%',
    padding: 0
  };

  // TypeScript 문제를 해결하기 위해 as 사용
  const containerProps = {
    position: "top-center" as const,
    transition: nativeSlide,
    autoClose: 2000,
    hideProgressBar: true,
    newestOnTop: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: false,
    draggable: true,
    pauseOnHover: false,
    closeButton: false,
    className: "w-full px-0 mx-auto",
    style: toastStyle,
  } as ToastContainerProps;

  return (
    <ToastContainer
      {...containerProps}
      toastClassName={() => 
        "bg-[#1f1f1f] text-white border-0 shadow-none rounded-none mb-1 py-3 px-4 w-full"
      }
    />
  );
};

// 커스텀 토스트 메시지 컴포넌트
interface ToastMessageProps {
  icon: React.ReactNode;
  message: string;
}

const ToastMessage: React.FC<ToastMessageProps> = ({ icon, message }) => (
  <div className="p-0 flex items-center text-sm font-normal">
    <span className="mr-2">{icon}</span>
    <span>{message}</span>
  </div>
);

// 커스텀 토스트 알림 객체
const notify = {
  success: (message: string) => 
    toast.success(
      <ToastMessage 
        icon={<CheckCircle size={16} />} 
        message={message} 
      />
    ),
  info: (message: string) => 
    toast.info(
      <ToastMessage 
        icon={<Info size={16} />} 
        message={message} 
      />
    ),
  warning: (message: string) => 
    toast.warning(
      <ToastMessage 
        icon={<AlertTriangle size={16} />} 
        message={message} 
      />
    ),
  error: (message: string) => 
    toast.error(
      <ToastMessage 
        icon={<XCircle size={16} />} 
        message={message} 
      />
    ),
  // 사용자 정의 다크 스타일 (이미지에 있는 스타일과 가장 유사)
  dark: (message: string) => 
    toast(
      <ToastMessage 
        icon={<Info size={16} />} 
        message={message} 
      />,
      {
        className: "bg-[#1f1f1f] text-white border-0 shadow-none py-3 px-4 w-full",
      }
    )
};

export { CustomToastContainer, notify };