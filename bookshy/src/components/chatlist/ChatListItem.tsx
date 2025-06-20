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
        myBookId: room.myBookId,
        myBookName: room.myBookName,
        otherBookId: room.otherBookId,
        otherBookName: room.otherBookName,
      },
    });
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center px-4 py-3 gap-4 active:bg-light-bg-shade cursor-pointer border-b border-light-bg-shade"
    >
      <img
        src={room.partnerProfileImage}
        alt={room.partnerName}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-xl sm:text-base font-semibold text-light-text truncate max-w-[110px] sm:max-w-[140px]">
              {room.partnerName}
            </h3>
            {room.bookshyScore !== undefined && (
              <span className="text-[10px] sm:text-xs px-2 py-[2px] rounded-full bg-[#FAE7EB] text-primary-light font-medium whitespace-nowrap">
                북끄지수 {room.bookshyScore}
              </span>
            )}
          </div>
          <span className="text-xs text-light-text-muted whitespace-nowrap">
            {formatLastMessageTime(room.lastMessageTime)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-light-text-secondary truncate max-w-[70%] sm:max-w-[180px]">
            {room.lastMessage}
          </p>
          {room.unreadCount > 0 && (
            <span className="ml-2 bg-primary text-white text-[11px] sm:text-xs font-bold px-2 py-[2px] rounded-full">
              {room.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatListItem;
