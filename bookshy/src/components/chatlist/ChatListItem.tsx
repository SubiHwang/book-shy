import { ChatRoomSummary } from '@/types/chat/chat';
import { formatLastMessageTime } from '@/utils/formatLastMessageTime';
import { useNavigate } from 'react-router-dom';

interface Props {
  room: ChatRoomSummary;
}

function ChatListItem({ room }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${room.roomId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center px-4 py-3 gap-3 hover:bg-light-bg-shade dark:hover:bg-dark-bg-shade cursor-pointer border-b border-gray-100 dark:border-gray-700"
    >
      <img
        src={room.partnerProfileImage}
        alt={room.partnerName}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-light-text dark:text-dark-text truncate">
            {room.partnerName}
          </h3>
          <span className="text-xs text-light-text-muted dark:text-dark-text-muted whitespace-nowrap">
            {formatLastMessageTime(room.lastMessageTime)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate max-w-[200px]">
            {room.lastMessage}
          </p>
          {room.unreadCount > 0 && (
            <span className="ml-2 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {room.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
