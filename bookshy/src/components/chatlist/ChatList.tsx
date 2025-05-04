import { useQuery } from '@tanstack/react-query';
import ChatListItem from './ChatListItem';
import { fetchChatList } from '@/services/chat/chat';

function ChatList() {
  // 추후 로그인 사용자 ID로 대체 필요
  const userId = 1;
  const { data, isLoading, isError } = useQuery({
    queryKey: ['chatList', userId],
    queryFn: () => fetchChatList(userId),
  });

  if (isLoading) return <div className="p-4">불러오는 중...</div>;
  if (isError || !data) return <div className="p-4">채팅 목록을 불러올 수 없습니다.</div>;

  return (
    <div className="bg-light-bg dark:bg-dark-bg h-full">
      {data.map((room) => (
        <ChatListItem key={room.roomId} room={room} />
      ))}
    </div>
  );
}

export default ChatList;
