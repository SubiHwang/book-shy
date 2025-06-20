import { useState, FC } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRegisterSW } from 'virtual:pwa-register/react';
import SplashScreen from '@components/splash/SplashScreen';
import bookAnimation from '@assets/lottie/bookshy-splash.json';
import { BrowserRouter } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
// import UpdatePrompt from '@/components/common/UpdatePrompt';
import { AuthProvider } from '@/contexts/AuthContext';
import { FirebaseProvider } from '@/contexts/FirebaseContext';
import NotificationInitializer from './components/common/NotificationInitializer';
import 'react-loading-skeleton/dist/skeleton.css';

// 서비스 워커 등록 콜백 타입 정의
interface RegisterSWCallbacks {
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: Error) => void;
  onOfflineReady?: () => void;
  onNeedRefresh?: () => void;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 동안 데이터 신선하게 유지
      gcTime: 1000 * 60 * 60 * 24, // 24시간 동안 캐시 유지
      retry: 3, // 최대 3회 재시도
      refetchOnReconnect: true, // 재연결 시 refetch
    },
  },
});

const App: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // PWA 업데이트 관리
  useRegisterSW({
    onRegistered(registration: ServiceWorkerRegistration | undefined): void {
      console.log('SW 등록됨', registration);
    },
    onRegisterError(error: Error): void {
      console.log('SW 등록 에러:', error);
    },
    onOfflineReady() {
      // 오프라인 준비가 완료되었을 때 처리
      console.log('앱이 오프라인에서도 실행 가능합니다');
    },
    onNeedRefresh() {
      // 새 버전이 있을 때 호출
      console.log('새 콘텐츠를 사용할 수 있습니다, 새로고침 하세요');
    },
    immediate: true,
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
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider>
        <AuthProvider>
          <BrowserRouter>
            <NotificationInitializer />
            {/* 알림 초기화 컴포넌트 */}
            <AppLayout />
            {/* <UpdatePrompt needRefresh={needRefresh} updateServiceWorker={updateServiceWorker} /> */}
          </BrowserRouter>
        </AuthProvider>
      </FirebaseProvider>
    </QueryClientProvider>
  );
};

export default App;
