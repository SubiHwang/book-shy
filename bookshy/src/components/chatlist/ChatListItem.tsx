import { ChatRoomSummary } from '@/types/chat/chat';
import { formatLastMessageTime } from '@/utils/formatLastMessageTime';
import { useNavigate } from 'react-router-dom';

interface Props {
  room: ChatRoomSummary;
}

function ChatListItem({ room }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${room.id}`, {
      state: {
        partnerName: room.partnerName,
        partnerProfileImage: room.partnerProfileImage,
      },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center px-4 py-4 gap-4 hover:bg-light-bg-shade cursor-pointer border-b border-gray-100"
    >
      <img
        src={room.partnerProfileImage}
        alt={room.partnerName}
        className="w-14 h-14 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-bold text-light-text truncate">{room.partnerName}</h3>
          <span className="text-xs text-light-text-muted whitespace-nowrap">
            {formatLastMessageTime(room.lastMessageTime)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-light-text-secondary truncate max-w-[180px]">
            {room.lastMessage}
          </p>
          {room.unreadCount > 0 && (
            <span className="ml-2 bg-primary text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {room.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
