import { FC, useEffect } from 'react';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useAuth } from '@/contexts/AuthContext';
import { getMessaging, onMessage } from 'firebase/messaging';

// 알림 타입 정의 (애플리케이션 내에서 사용)
export interface NotificationData {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  url: string;
  read: boolean;
}

// 커스텀 이벤트 타입 정의
declare global {
  interface WindowEventMap {
    'new-notification': CustomEvent<NotificationData>;
  }
}

const NotificationInitializer: FC = () => {
  const { requestNotificationPermission, isInitialized } = useFirebase();
  const { isLoggedIn } = useAuth(); // 사용자 인증 상태 가져오기

  // 알림 권한 요청 및 설정
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

  // 포그라운드 메시지 처리 및 이벤트 발행
  useEffect(() => {
    if (isInitialized && isLoggedIn) {
      try {
        // Firebase 메시징 인스턴스 가져오기
        const messaging = getMessaging();

        // 포그라운드 메시지 수신 핸들러
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log('포그라운드 메시지 수신:', payload);

          // 알림 데이터 생성
          const notificationData: NotificationData = {
            id: Date.now().toString(),
            title: payload.data?.title || '새 알림',
            body: payload.data?.body || '',
            url: payload.data?.url || '/',
            timestamp: new Date().toISOString(),
            read: false,
          };

          // 알림 데이터를 로컬 스토리지에 저장
          saveNotificationToStorage(notificationData);

          // 새 알림 이벤트 발행
          const event = new CustomEvent('new-notification', {
            detail: notificationData,
          });

          window.dispatchEvent(event);
        });

        // 컴포넌트 언마운트 시 구독 해제
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error('알림 메시지 핸들러 설정 오류:', error);
      }
    }
  }, [isInitialized, isLoggedIn]);

  // 알림을 로컬 스토리지에 저장하는 함수
  const saveNotificationToStorage = (notification: NotificationData) => {
    try {
      // 기존 알림 가져오기
      const storedNotificationsJson = localStorage.getItem('notifications');
      const storedNotifications: NotificationData[] = storedNotificationsJson
        ? JSON.parse(storedNotificationsJson)
        : [];

      // 새 알림 추가 (배열 앞에 추가)
      const updatedNotifications = [notification, ...storedNotifications];

      // 다시 저장 (최대 20개로 제한)
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications.slice(0, 20)));
    } catch (error) {
      console.error('알림 저장 오류:', error);
    }
  };

  return null; // UI를 렌더링하지 않는 컴포넌트
};

export default NotificationInitializer;
