import { useState, FC } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import SplashScreen from '@components/splash/SplashScreen';
import bookAnimation from '@assets/lottie/bookshy-splash.json';

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
    <>
      <div className="App">
        <h1>Welcome to BookShy!</h1>
        {needRefresh && (
          <button onClick={() => updateServiceWorker()}>새로고침하여 업데이트 적용</button>
        )}
      </div>
    </>
  );
};

export default App;
