import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { NotificationData } from '@/components/common/NotificationInitializer';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [_hasNotifications, setHasNotifications] = useState(false);

  // 컴포넌트 마운트 시 로컬 스토리지에서 알림 불러오기
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const storedNotificationsJson = localStorage.getItem('notifications');
        if (storedNotificationsJson) {
          const storedNotifications: NotificationData[] = JSON.parse(storedNotificationsJson);
          setNotifications(storedNotifications);

          // 읽지 않은 알림이 있는지 확인
          const unreadExists = storedNotifications.some((notification) => !notification.read);
          setHasNotifications(unreadExists);
        }
      } catch (error) {
        console.error('알림 불러오기 오류:', error);
      }
    };

    loadNotifications();
  }, []);

  // 새 알림 이벤트 리스너
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent<NotificationData>) => {
      if (event.detail) {
        const newNotification = event.detail;

        setNotifications((prev) => [newNotification, ...prev]);
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

  // 특정 알림 삭제
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter((notification) => notification.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  // 모든 알림 삭제
  const deleteAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem('notifications', JSON.stringify([]));
  };

  // 뒤로 가기
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-full flex flex-col bg-light-bg">
      {/* 헤더 */}
      <header className="bg-light-bg shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="w-8"></div> {/* 왼쪽 여백을 위한 빈 div */}
          <h1 className="text-lg font-medium text-center flex-1">알림</h1>
          <button onClick={goBack} className="p-1 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>
      </header>

      {/* 전체 삭제 버튼 - 헤더 아래에 배치 */}
      {notifications.length > 0 && (
        <div className="bg-light-bg p-3 text-right border-b border-gray-100">
          <button
            onClick={deleteAllNotifications}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            전체 삭제
          </button>
        </div>
      )}

      {/* 알림 목록 */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 relative ${
                  !notification.read
                    ? 'border-l-4 border-primary  bg-primary-light/10'
                    : ' bg-light-bg-card'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1" onClick={()=>{navigate(notification.url)}}>
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{notification.body}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <p className="text-gray-500 mt-4">새 알림이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
