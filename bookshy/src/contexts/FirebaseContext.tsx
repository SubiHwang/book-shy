import { createContext, useState, FC, useContext, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Messaging, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// FirebaseContextType 정의 (알림 처리 함수 추가)
interface FirebaseContextType {
  firebaseToken: string | null;
  setFirebaseToken: React.Dispatch<React.SetStateAction<string | null>>;
  refreshToken: () => Promise<string | null>;
  isInitialized: boolean;
  // 알림 권한 상태 추가
  notificationPermission: NotificationPermission | null;
  // 알림 권한 요청 함수 추가
  requestNotificationPermission: () => Promise<boolean>;
}

const FirebaseContext = createContext<FirebaseContextType>({
  firebaseToken: null,
  setFirebaseToken: () => {},
  refreshToken: async () => null,
  isInitialized: false,
  notificationPermission: null,
  requestNotificationPermission: async () => false,
});

export const FirebaseProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  // 로컬 스토리지에서 토큰 가져오기 (초기값)
  const [firebaseToken, setFirebaseToken] = useState<string | null>(
    localStorage.getItem('firebase_token'),
  );

  // Firebase 앱 인스턴스와 메시징 서비스 상태 관리
  const [_app, setApp] = useState<FirebaseApp | null>(null);
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  // 알림 권한 상태 추가
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | null>(null);

  // 앱 시작 시 Firebase 초기화 (한 번만 실행)
  useEffect(() => {
    const initFirebase = async () => {
      try {
        // Firebase 구성 정보
        const firebaseConfig = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: import.meta.env.VITE_FIREBASE_APP_ID,
          measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
        };

        // Firebase 앱 초기화
        const firebaseApp = initializeApp(firebaseConfig);
        const messagingInstance = getMessaging(firebaseApp);

        // 상태 업데이트
        setApp(firebaseApp);
        setMessaging(messagingInstance);
        setIsInitialized(true);

        // 현재 알림 권한 상태 확인
        if ('Notification' in window) {
          setNotificationPermission(Notification.permission);
        }

        console.log('Firebase 초기화 완료');

        // 서비스 워커 등록 확인 (개선)
        await checkServiceWorker();

        // 포그라운드 메시지 핸들러 설정
        setupForegroundMessageHandler(messagingInstance);
      } catch (error) {
        console.error('Firebase 초기화 오류:', error);
      }
    };

    initFirebase();
  }, []); // 의존성 배열이 비어있어 마운트 시 한 번만 실행

  // 서비스 워커 상태 확인 함수
  const checkServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      console.warn('이 브라우저는 서비스 워커를 지원하지 않습니다.');
      return false;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();

      if (registrations.length === 0) {
        console.warn('등록된 서비스 워커가 없습니다.');
        return false;
      }

      console.log(`${registrations.length}개의 서비스 워커가 등록되어 있습니다.`);

      // Firebase 메시징 서비스 워커 확인
      let fcmSwFound = false;

      for (const reg of registrations) {
        console.log(`서비스 워커 스코프: ${reg.scope}, 상태: ${reg.active ? '활성' : '비활성'}`);

        // firebase-messaging-sw.js 파일 확인 (URL에 포함되어 있는지)
        if (reg.active) {
          try {
            // 모든 서비스 워커 스크립트 URL 출력
            console.log('서비스 워커 스크립트:', reg.active.scriptURL);

            // firebase-messaging-sw.js가 포함된 서비스 워커 확인
            if (reg.active.scriptURL.includes('firebase-messaging-sw.js')) {
              console.log('Firebase 메시징 서비스 워커 발견!');
              fcmSwFound = true;
            }
          } catch (e) {
            console.error('서비스 워커 스크립트 확인 중 오류:', e);
          }
        }
      }

      if (!fcmSwFound) {
        console.warn('Firebase 메시징 서비스 워커를 찾을 수 없습니다.');
        console.warn('public/firebase-messaging-sw.js 파일이 있는지 확인하세요.');
        return false;
      }

      return true;
    } catch (error) {
      console.error('서비스 워커 확인 중 오류:', error);
      return false;
    }
  };

  // 포그라운드 메시지 핸들러 설정
  const setupForegroundMessageHandler = (messagingInstance: Messaging) => {
    try {
      onMessage(messagingInstance, (payload) => {
        console.log('포그라운드 메시지 수신:', payload);

        // 앱이 열려있을 때도 알림 표시 (선택적)
        if (payload.notification && Notification.permission === 'granted') {
          // 브라우저 알림 API를 사용하여 알림 표시
          const { title, body } = payload.notification;

          const notificationOptions: NotificationOptions = {
            body: body || '',
            icon: '/icons/pwa-192x192.png',
            // 알림에 데이터 추가 (클릭 시 사용)
            data: payload.data,
          };

          // 알림 표시
          const notification = new Notification(title || '새 알림', notificationOptions);

          // 알림 클릭 이벤트 처리
          notification.onclick = () => {
            // 앱 내 특정 페이지로 이동 등의 작업
            const url = payload.data?.url || '/';
            window.focus();
            window.location.href = url;
            notification.close();
          };
        }
      });

      console.log('포그라운드 메시지 핸들러 설정 완료');
    } catch (error) {
      console.error('포그라운드 메시지 핸들러 설정 오류:', error);
    }
  };

  // 알림 권한 요청 함수
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('이 브라우저는 알림을 지원하지 않습니다.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        console.log('알림 권한이 허용되었습니다.');

        // 권한이 허용된 후 토큰 갱신
        if (messaging) {
          await refreshToken();
        }

        return true;
      } else {
        console.log('알림 권한이 거부되었습니다.');
        return false;
      }
    } catch (error) {
      console.error('알림 권한 요청 중 오류:', error);
      return false;
    }
  };

  // Firebase 초기화 후 토큰 요청 (조건부 실행)
  useEffect(() => {
    const requestToken = async () => {
      // 이미 토큰이 있으면 건너뛰기
      if (firebaseToken) {
        console.log('기존 FCM 토큰 사용:', firebaseToken);
        return;
      }

      // Firebase가 초기화되고, 알림 권한이 허용되었을 때만 토큰 요청
      if (isInitialized && messaging && Notification.permission === 'granted') {
        try {
          const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
          const token = await getToken(messaging, { vapidKey });

          if (token) {
            console.log('FCM 토큰 생성됨:', token);
            setFirebaseToken(token);
            localStorage.setItem('firebase_token', token);

            // 여기서 서버에 토큰 등록 로직을 추가할 수 있습니다.
            // await registerTokenWithServer(token);
          } else {
            console.log('토큰을 가져올 수 없습니다. 알림 권한이 거부되었을 수 있습니다.');
          }
        } catch (error) {
          console.error('토큰 요청 중 오류 발생:', error);
        }
      }
    };

    requestToken();
  }, [isInitialized, messaging, firebaseToken, notificationPermission]); // 알림 권한 상태 변경 시에도 실행

  // 토큰을 수동으로 갱신하는 함수 (필요 시 호출)
  const refreshToken = async (): Promise<string | null> => {
    if (!isInitialized || !messaging) {
      console.warn('Firebase가 아직 초기화되지 않았습니다.');
      return null;
    }

    // 알림 권한이 없으면 토큰을 갱신할 수 없음
    if (Notification.permission !== 'granted') {
      console.warn('알림 권한이 없어 토큰을 갱신할 수 없습니다.');
      return null;
    }

    try {
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      const token = await getToken(messaging, { vapidKey });

      if (token) {
        console.log('FCM 토큰 갱신됨:', token);
        setFirebaseToken(token);
        localStorage.setItem('firebase_token', token);
        return token;
      }

      console.log('토큰을 갱신할 수 없습니다.');
      return null;
    } catch (error) {
      console.error('토큰 갱신 중 오류 발생:', error);
      return null;
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        firebaseToken,
        setFirebaseToken,
        refreshToken,
        isInitialized,
        notificationPermission,
        requestNotificationPermission,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

// 편의를 위한 훅
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase는 FirebaseProvider 내에서 사용해야 합니다');
  }
  return context;
};
