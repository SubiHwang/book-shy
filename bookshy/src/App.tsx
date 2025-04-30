import { useState, FC } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import SplashScreen from '@components/splash/SplashScreen';
import bookAnimation from '@assets/lottie/bookshy-splash.json';
import { BrowserRouter } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import UpdatePrompt from './components/common/UpdatePrompt';

// 서비스 워커 등록 콜백 타입 정의
interface RegisterSWCallbacks {
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: Error) => void;
}

const App: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // PWA 업데이트 관리
  const { needRefresh, updateServiceWorker } = useRegisterSW({
    onRegistered(registration: ServiceWorkerRegistration | undefined): void {
      console.log('SW 등록됨', registration);
    },
    onRegisterError(error: Error): void {
      console.log('SW 등록 에러:', error);
    },

    immediate: true, // 즉시 등록 시도 (개발 환경에서도)
  } as RegisterSWCallbacks);

  // 스플래시 화면 종료 처리
  const handleSplashFinished = (): void => {
    setIsLoading(false);
  };

  // 스플래시 화면 표시 중이면 스플래시 컴포넌트 렌더링
  if (isLoading) {
    return (
      <SplashScreen
        animationData={bookAnimation}
        onFinish={handleSplashFinished}
        minDisplayTime={2500}
        text="북끄북끄"
      />
    );
  }

  return (
    <BrowserRouter>
      <AppLayout />
      <UpdatePrompt needRefresh={needRefresh} updateServiceWorker={updateServiceWorker} />
    </BrowserRouter>
  );
};

export default App;
