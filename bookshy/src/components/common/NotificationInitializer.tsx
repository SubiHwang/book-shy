import { FC, useEffect } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useAuth } from '@/contexts/AuthContext';

const NotificationInitializer: FC = () => {
  const { requestNotificationPermission, isInitialized } = useFirebase();
  const { isLoggedIn } = useAuth(); // 사용자 인증 상태 가져오기

  useEffect(() => {
    // Firebase가 초기화되고 사용자가 로그인한 상태일 때만 알림 설정
    if (isInitialized && isLoggedIn) {
      const setupNotifications = async () => {
        try {
          const result = await requestNotificationPermission();
          if (result) {
            console.log('알림 권한이 허용되었습니다.');
          }
        } catch (error) {
          console.error('알림 초기화 오류:', error);
        }
      };

      setupNotifications();
    }
  }, [isInitialized, requestNotificationPermission, isLoggedIn]);

  return null; // UI를 렌더링하지 않는 컴포넌트
};

export default NotificationInitializer;
