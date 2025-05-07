import { useQuery } from '@tanstack/react-query';
import ChatListItem from './ChatListItem';
import { fetchChatList } from '@/services/chat/chat';

function ChatList() {
  const userId = 4;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['chatList', userId],
    queryFn: () => fetchChatList(userId),
  });

  if (isLoading) return <div className="p-4">불러오는 중...</div>;
  if (isError || !data) return <div className="p-4">채팅 목록을 불러올 수 없습니다.</div>;

  return (
    <div className="bg-light-bg dark:bg-dark-bg h-full p-4">
      {data.length === 0 ? (
        <div className="text-center text-light-text-muted dark:text-dark-text-muted">
          진행 중인 채팅이 없습니다.
        </div>
      ) : (
        data.map((room) => <ChatListItem key={room.id} room={room} />)
      )}
    </div>
  );
}

export default ChatList;
