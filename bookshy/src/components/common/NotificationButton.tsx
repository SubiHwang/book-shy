import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NotificationData } from '@/components/common/NotificationInitializer';
import '@/styles/common/notificationButtonAnimation.css';

const NotificationButton = () => {
  const [hasNotifications, setHasNotifications] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const bellRef = useRef<HTMLDivElement>(null);

  // 컴포넌트 마운트 시 로컬 스토리지에서 알림 상태 확인
  useEffect(() => {
    const checkNotifications = () => {
      try {
        const storedNotificationsJson = localStorage.getItem('notifications');
        if (storedNotificationsJson) {
          const storedNotifications: NotificationData[] = JSON.parse(storedNotificationsJson);

          // 읽지 않은 알림이 있는지 확인
          const unreadExists = storedNotifications.some((notification) => !notification.read);
          setHasNotifications(unreadExists);
        }
      } catch (error) {
        console.error('알림 확인 오류:', error);
      }
    };

    checkNotifications();

    // 로컬 스토리지 변경 감지 (다른 탭/창에서 변경된 경우)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notifications') {
        checkNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 새 알림 이벤트 리스너
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent<NotificationData>) => {
      if (event.detail) {
        setHasNotifications(true);
        animateBell();
      }
    };

    // 타입 단언을 사용하여 CustomEvent 처리
    const eventListener = ((e: Event) => {
      handleNewNotification(e as CustomEvent<NotificationData>);
    }) as EventListener;

    // 이벤트 리스너 등록
    window.addEventListener('new-notification', eventListener);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('new-notification', eventListener);
    };
  }, []);

  // 알림 페이지로 이동
  const goToNotifications = () => {
    navigate(`/notifications?from=${encodeURIComponent(location.pathname)}`);
  };

  const animateBell = () => {
    setIsAnimating(true);

    // 애니메이션 종료 후 상태 리셋
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000); // 애니메이션 지속 시간 (1초)
  };

  return (
    <button
      className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors relative"
      onClick={goToNotifications}
      aria-label="알림 보기"
    >
      <div ref={bellRef} className={`${isAnimating ? 'animate-bell' : ''}`}>
        <Bell size={24} />
      </div>
      {hasNotifications && (
        <span className="absolute top-1 right-2 bg-red-500 border border-light-bg rounded-full w-2 h-2"></span>
      )}
    </button>
  );
};

export default NotificationButton;
