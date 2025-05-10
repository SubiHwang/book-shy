import { useQuery, useQueryClient } from '@tanstack/react-query';
import ChatListItem from './ChatListItem';
import { fetchChatList } from '@/services/chat/chat';
import { useWebSocket } from '@/contexts/WebSocketProvider';
import { useEffect } from 'react';
import type { ChatMessage } from '@/types/chat/chat';

function ChatList() {
  const queryClient = useQueryClient();
  const { subscribeRoom, unsubscribe } = useWebSocket();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['chatList'],
    queryFn: () => fetchChatList(),
  });

  useEffect(() => {
    const subscription = subscribeRoom(-1, (frame) => {
      try {
        const msg: ChatMessage = JSON.parse(frame.body);

        queryClient.setQueryData(['chatList'], (prev: any) => {
          if (!Array.isArray(prev)) return prev;

          return prev.map((room: any) =>
            room.id === msg.chatRoomId
              ? {
                  ...room,
                  lastMessage: msg.content,
                  lastMessageTime: msg.sentAt,
                  unreadCount:
                    window.location.pathname !== `/chat/${msg.chatRoomId}`
                      ? (room.unreadCount || 0) + 1
                      : room.unreadCount,
                }
              : room,
          );
        });
      } catch (e) {
        console.error('❌ WebSocket 메시지 처리 실패:', e);
      }
    });

    return () => unsubscribe(subscription);
  }, [queryClient, subscribeRoom, unsubscribe]);

  if (isLoading) return <div className="p-4">불러오는 중...</div>;
  if (isError || !data) return <div className="p-4">채팅 목록을 불러올 수 없습니다.</div>;

  return (
    <div className="bg-light-bg dark:bg-dark-bg h-full p-4">
      {data.length === 0 ? (
        <div className="text-center text-light-text-muted dark:text-dark-text-muted">
          진행 중인 채팅이 없습니다.
        </div>
      ) : (
        [...data]
          .sort(
            (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime(),
          )
          .map((room) => <ChatListItem key={room.id} room={room} />)
      )}
    </div>
  );
}

export default ChatList;
