import { createContext, useState, FC, useContext, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Messaging } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// FirebaseContextType 정의
interface FirebaseContextType {
  firebaseToken: string | null;
  setFirebaseToken: React.Dispatch<React.SetStateAction<string | null>>;
  refreshToken: () => Promise<string | null>; // 토큰 새로고침 함수
  isInitialized: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  firebaseToken: null,
  setFirebaseToken: () => {},
  refreshToken: async () => null,
  isInitialized: false,
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

        console.log('Firebase 초기화 완료');
      } catch (error) {
        console.error('Firebase 초기화 오류:', error);
      }
    };

    initFirebase();
  }, []); // 의존성 배열이 비어있어 마운트 시 한 번만 실행

  // Firebase 초기화 후 토큰 요청 (조건부 실행)
  useEffect(() => {
    const requestToken = async () => {
      // 이미 토큰이 있으면 건너뛰기
      if (firebaseToken) {
        console.log('기존 FCM 토큰 사용:', firebaseToken);
        return;
      }

      // Firebase가 초기화되고 토큰이 없을 때만 요청
      if (isInitialized && messaging) {
        try {
          // 서비스 워커 등록 확인 (추가)
          if ('serviceWorker' in navigator) {
            try {
              const registrations = await navigator.serviceWorker.getRegistrations();
              let swFound = false;

              for (const reg of registrations) {
                console.log('등록된 서비스 워커:', reg.scope);
                // Firebase 메시징 서비스 워커 확인
                if (
                  reg.active &&
                  (reg.scope.includes('/firebase-cloud-messaging-push-scope') ||
                    reg.scope === `${window.location.origin}/`)
                ) {
                  swFound = true;
                  break;
                }
              }

              if (!swFound) {
                console.warn('Firebase 메시징 서비스 워커가 등록되지 않았습니다.');
                console.warn('public/firebase-messaging-sw.js 파일이 있는지 확인하세요.');
              }
            } catch (swError) {
              console.error('서비스 워커 확인 오류:', swError);
            }
          }

          const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
          const token = await getToken(messaging, { vapidKey });

          if (token) {
            console.log('FCM 토큰 생성됨:', token);
            setFirebaseToken(token);
            localStorage.setItem('firebase_token', token);
          } else {
            console.log('알림 권한이 없습니다. 사용자에게 권한을 요청해야 합니다.');
          }
        } catch (error) {
          console.error('토큰 요청 중 오류 발생:', error);
        }
      }
    };

    requestToken();
  }, [isInitialized, messaging, firebaseToken]); // Firebase 초기화 및 토큰 상태 변경 시 실행

  // 토큰을 수동으로 갱신하는 함수 (필요 시 호출)
  const refreshToken = async (): Promise<string | null> => {
    if (!isInitialized || !messaging) {
      console.warn('Firebase가 아직 초기화되지 않았습니다.');
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

      console.log('토큰을 갱신할 수 없습니다. 알림 권한이 거부되었을 수 있습니다.');
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
