import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationData } from '@/components/common/NotificationInitializer';

const NotificationButton = () => {
  const [hasNotifications, setHasNotifications] = useState(false);
  const navigate = useNavigate();

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
    navigate('/notifications');
  };

  return (
    <button
      className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors relative"
      onClick={goToNotifications}
      aria-label="알림 보기"
    >
      <Bell size={24} />
      {hasNotifications && (
        <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></span>
      )}
    </button>
  );
};

export default NotificationButton;