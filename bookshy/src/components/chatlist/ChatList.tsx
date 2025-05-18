import { useQuery, useQueryClient } from '@tanstack/react-query';
import ChatListItem from './ChatListItem';
import { fetchChatList } from '@/services/chat/chat';
import { useWebSocket } from '@/contexts/WebSocketProvider';
import { useEffect } from 'react';
import { getUserIdFromToken } from '@/utils/jwt';
import { ChatRoomSummary } from '@/types/chat/chat';
import { useLocation } from 'react-router-dom';

function ChatList() {
  const queryClient = useQueryClient();
  const { subscribeUser, unsubscribe } = useWebSocket();
  const location = useLocation();
  const myUserId = getUserIdFromToken();
  if (!myUserId) return;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['chatList'],
    queryFn: () => fetchChatList(),
  });

  useEffect(() => {
    refetch();
  }, [location.pathname, refetch]);

  useEffect(() => {
    const subscription = subscribeUser(myUserId, (msg: ChatRoomSummary) => {
      console.log('📨 WebSocket 수신:', msg);
      queryClient.setQueryData(['chatList'], (prev: any) => {
        if (!Array.isArray(prev)) return prev;

        const exists = prev.some((room: any) => room.id === msg.id);

        if (!exists) {
          return [
            ...prev,
            {
              id: msg.id,
              partnerName: msg.partnerName || '상대방',
              partnerProfileImage: '',
              lastMessage: msg.lastMessage,
              lastMessageTime: msg.lastMessageTime,
              unreadCount: 1,
            },
          ];
        }

        return prev.map((room: any) =>
          room.id === msg.id
            ? {
                ...room,
                lastMessage: msg.lastMessage,
                lastMessageTime: msg.lastMessageTime,
                unreadCount:
                  window.location.pathname !== `/chat/${msg.id}`
                    ? (room.unreadCount || 0) + 1
                    : room.unreadCount,
              }
            : room,
        );
      });
    });

    return () => unsubscribe(subscription);
  }, [myUserId, queryClient, subscribeUser, unsubscribe]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-light-bg px-4">
        <span className="text-sm text-light-text-muted">불러오는 중...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center bg-light-bg px-4">
        <span className="text-sm text-light-status-error">채팅 목록을 불러올 수 없습니다.</span>
      </div>
    );
  }

  return (
    <div className="bg-light-bg px-4 py-4 flex flex-col gap-3">
      {data.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-sm text-light-text-muted">
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
