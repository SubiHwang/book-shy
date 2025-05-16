import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFirebase } from '@/contexts/FirebaseContext';
import SplashScreen from '@/components/splash/SplashScreen';
import bookAnimation from '@/assets/lottie/bookshy-splash.json';
import { fetchUserProfile } from '@/services/mypage/profile'; // ✅ 유저 정보 fetch 함수 import

const KaKaoOauth: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { login, isLoggedIn } = useAuth();
  const { firebaseToken, isInitialized } = useFirebase();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkLocationStatus = async () => {
      try {
        const profile = await fetchUserProfile();

        const needsLocationSetting =
          !profile.address || profile.latitude === null || profile.longitude === null;

        if (needsLocationSetting) {
          navigate('/setting-location');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('프로필 정보 불러오기 실패:', err);
        navigate('/');
      }
    };

    if (!isLoading && isLoggedIn) {
      checkLocationStatus(); // ✅ 조건 확인 후 이동
    } else if (!isLoading && !isLoggedIn) {
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
        await login({
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
