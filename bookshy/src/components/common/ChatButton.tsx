import { FC, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatButtonProps {
  isActive: boolean;
  onClick: () => void;
}

const ChatButton: FC<ChatButtonProps> = ({ isActive, onClick }) => {
  const countChat = 2;
  const navigate = useNavigate();

  useEffect(() => {
    // 읽지 않은 채팅 메시지 개수를 가져오는 로직
    // 예시: API 호출 또는 localStorage에서 데이터 가져오기
    // const storedChatList = localStorage.getItem('chatList');
    // if (storedChatList) {
    //   const chatData = JSON.parse(storedChatList);
    //   const unreadCount = chatData.filter(chat => !chat.read).length;
    //   setCountChat(unreadCount);
    // }
  }, []);

  const handleClick = () => {
    // 원래 탭 클릭 함수 실행 (activeTab 설정 등)
    onClick();

    // 채팅 페이지로 이동
    navigate('/chat');
  };

  return (
    <button
      className={`flex flex-col items-center justify-center w-full h-full ${
        isActive ? 'text-primary' : 'text-light-text-secondary'
      } py-1`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-center mb-1 relative">
        <MessageCircle size={window.innerHeight < 667 ? 20 : 24} strokeWidth={isActive ? 2 : 0.5} />

        {/* 읽지 않은 채팅 알림 표시 */}
        {countChat > 0 && (
          <span className="absolute -top-1 -right-2 bg-primary border text-white font-light text-xs border-tabBackground rounded-full w-6 h-4">
            {countChat >= 10 ? '9+' : countChat}
          </span>
        )}
      </div>
      <p className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>채팅</p>
      {isActive && <div className="bg-primary h-1 w-3 rounded-sm mt-1"></div>}
    </button>
  );
};

export default ChatButton;
