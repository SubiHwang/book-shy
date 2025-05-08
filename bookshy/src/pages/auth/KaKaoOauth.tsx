import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const KaKaoOauth = () => {
  const { login } = useAuth(); // AuthContext에서 login 함수 가져오기
  const location = useLocation();
  const navigate = useNavigate();
  const fcmToken = 'your-fcm-token'; // FCM 토큰을 여기에 설정하세요.

  useEffect(() => {
    // URL에서 인가 코드 추출
    const code = new URLSearchParams(location.search).get('code');

    if (code) {
      console.log('인가 코드 추출 성공:', code);
      login({ token: code, fcmToken: fcmToken }); // 인가 코드로 로그인 시도
    } else {
      console.error('인가 코드가 없습니다.');
      navigate('/login'); // 코드가 없으면 로그인 페이지로 리다이렉트
    }
  }, [location, navigate, login, fcmToken]);
};
export default KaKaoOauth;
