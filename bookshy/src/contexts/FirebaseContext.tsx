import { createContext, useState, FC, useContext } from 'react';
import { FirebaseContextType } from '@/types/auth';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// createContext에서 null 유니온 타입 제거 (불필요함)
const FirebaseContext = createContext<FirebaseContextType>({
  firebaseToken: null,
  setFirebaseToken: () => {},
  getFirebaseToken: () => null,
});

export const FirebaseProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseToken, setFirebaseToken] = useState<string | null>(
    localStorage.getItem('firebase_token'), // 초기값을 로컬 스토리지에서 가져오기
  );

  const apikey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;
  const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

  const getFirebaseToken = (): string | null => {
    const token = localStorage.getItem('firebase_token');
    if (token) {
      setFirebaseToken(token);
      return token;
    } else {
      const firebaseConfig = {
        apiKey: apikey,
        authDomain: authDomain,
        projectId: projectId,
        storageBucket: storageBucket,
        messagingSenderId: messagingSenderId,
        appId: appId,
        measurementId: measurementId,
      };

      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      getToken(messaging, {
        vapidKey: vapidKey,
      })
        .then((token) => {
          if (token) {
            console.log('FCM Token:', token);
            setFirebaseToken(token);
            localStorage.setItem('firebase_token', token);
            return token;
          } else {
            console.error('No registration token available. Request permission to generate one.');
          }
        })
        .catch((err) => {
          console.error('An error occurred while retrieving token. ', err);
        });
    }
    return null;
  };

  return (
    <FirebaseContext.Provider value={{ firebaseToken, setFirebaseToken, getFirebaseToken }}>
      {children}
    </FirebaseContext.Provider>
  );
};

// 편의를 위한 훅 추가
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
