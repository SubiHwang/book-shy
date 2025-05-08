import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFirebase } from '@/contexts/FirebaseContext';
import SplashScreen from '@/components/splash/SplashScreen';
import bookAnimation from '@/assets/lottie/bookshy-splash.json';

const KaKaoOauth: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { login, isLoggedIn } = useAuth();
  const { firebaseToken, isInitialized } = useFirebase();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 확인 및 스플래시 화면이 끝났을 때
    if (!isLoading && isLoggedIn) {
      navigate('/');
    } else if (!isLoading && !isLoggedIn) {
      // 로그인하지 않은 상태에서 스플래시 화면이 끝났을 때
      navigate('/login');
    }
  }, [isLoading, isLoggedIn, navigate]);

  useEffect(() => {
    const loginWithToken = async () => {
      const code = new URLSearchParams(location.search).get('code');

      if (!code) {
        console.error('인가 코드가 없습니다.');
        navigate('/login');
        return;
      }

      if (!isInitialized) return;

      try {
        login({
          token: code,
          fcmToken: firebaseToken || '',
        });
      } catch (error) {
        console.error('로그인 처리 중 오류:', error);
        navigate('/login');
      }
    };

    loginWithToken();
  }, [location, navigate, login, firebaseToken, isInitialized]);

  // 스플래시 화면 종료 처리
  const handleSplashFinished = (): void => {
    setIsLoading(false);
  };

  return (
    <SplashScreen
      animationData={bookAnimation}
      onFinish={handleSplashFinished}
      minDisplayTime={2500}
      text="북끄북끄"
    />
  );
};

export default KaKaoOauth;
