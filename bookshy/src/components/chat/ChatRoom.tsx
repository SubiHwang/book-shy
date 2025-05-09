import { useEffect, useRef, useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat/chat.ts';
import ChatMessageItem from './ChatMessageItem.tsx';
import ChatInput from './ChatInput.tsx';
import ChatRoomHeader from './ChatRoomHeader.tsx';
import ScheduleModal from './ScheduleModal.tsx';
import SystemMessage from './SystemMessage.tsx';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMessages, markMessagesAsRead } from '@/services/chat/chat.ts';
import { useStomp } from '@/hooks/chat/useStomp.ts';

interface Props {
  partnerName: string;
  partnerProfileImage: string;
  initialMessages: ChatMessage[];
}

function ChatRoom({ partnerName, partnerProfileImage }: Props) {
  const { roomId } = useParams();
  const numericRoomId = Number(roomId);
  const myUserId = 4; // 로그인 유저 id로 바꿔야함

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: initialMessages = [],
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ['chatMessages', numericRoomId],
    queryFn: () => fetchMessages(numericRoomId),
    enabled: !isNaN(numericRoomId),
    retry: false,
  });

  useEffect(() => {
    if (!isNaN(numericRoomId)) {
      markMessagesAsRead(numericRoomId, myUserId)
        .then(() => refetch())
        .catch((err) => console.error('❌ 읽음 처리 실패:', err));
    }
  }, [numericRoomId, myUserId, refetch]);

  useEffect(() => {
    if (isSuccess) {
      setMessages(initialMessages);
    }
  }, [initialMessages, isSuccess]);

  useEffect(() => {
    if (!isNaN(numericRoomId)) {
      markMessagesAsRead(numericRoomId, myUserId)
        .then(() => {
          refetch();

          queryClient.setQueryData(['chatList', myUserId], (prev: any) => {
            if (!Array.isArray(prev)) return prev;
            return prev.map((room: any) =>
              room.id === numericRoomId ? { ...room, unreadCount: 0 } : room,
            );
          });
        })
        .catch((err) => console.error('❌ 읽음 처리 실패:', err));
    }
  }, [numericRoomId, myUserId, refetch, queryClient]);

  const onMessage = useCallback(
    (newMessage: ChatMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === newMessage.id);
        return exists ? prev : [...prev, newMessage];
      });

      queryClient.setQueryData(['chatList', myUserId], (prev: any) => {
        return prev.map((room: any) =>
          room.id === newMessage.chatRoomId
            ? {
                ...room,
                lastMessage: newMessage.content,
                lastMessageTime: newMessage.sentAt,
              }
            : room,
        );
      });
    },
    [queryClient, myUserId],
  );

  const { sendMessage } = useStomp(numericRoomId, onMessage);

  useEffect(() => {
    scrollToBottom(messages.length === 1);
  }, [messages]);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  const isScrolledToBottom = (): boolean => {
    const container = messagesEndRef.current?.parentElement;
    if (!container) return false;
    const threshold = 100;
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  };

  const handleSendMessage = (content: string) => {
    if (isNaN(numericRoomId)) return;
    sendMessage(numericRoomId, myUserId, content);
  };

  const handleSendSystemMessage = (
    content: string,
    type: 'notice' | 'info' | 'warning' = 'info',
  ) => {
    const now = new Date();
    const newMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      senderId: -1,
      chatRoomId: numericRoomId,
      content,
      sentAt: now.toISOString(),
      type,
    };
    setMessages((prev) => [...prev, newMessage]);
    sendMessage(numericRoomId, -1, content, type);
  };

  const toggleOptions = () => {
    const shouldScroll = isScrolledToBottom();
    setShowOptions((prev) => !prev);
    setTimeout(() => {
      if (shouldScroll) scrollToBottom(true);
    }, 0);
  };

  const formatDateLabel = (isoTimestamp: string) => {
    const date = new Date(isoTimestamp);
    return isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short',
        });
  };

  const formatTime = (isoTimestamp: string) => {
    const date = new Date(isoTimestamp);
    return isNaN(date.getTime())
      ? ''
      : date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  let lastDateLabel = '';

  return (
    <div className="flex flex-col h-screen">
      <ChatRoomHeader partnerName={partnerName} partnerProfileImage={partnerProfileImage} />
      <div className="flex-1 overflow-y-auto bg-[#FFFCF9] px-3 py-2">
        {messages.map((msg) => {
          const dateLabel = formatDateLabel(msg.sentAt);
          const showDate = dateLabel !== lastDateLabel;
          lastDateLabel = dateLabel;

          const isSystem = msg.senderId === -1;

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex items-center gap-2 text-xs text-gray-400 my-4">
                  <div className="flex-grow border-t border-gray-300" />
                  <span className="px-2 whitespace-nowrap">{dateLabel}</span>
                  <div className="flex-grow border-t border-gray-300" />
                </div>
              )}
              {isSystem ? (
                <SystemMessage
                  title={
                    msg.type === 'notice'
                      ? '거래 시 주의해주세요!'
                      : msg.type === 'info'
                        ? '약속이 등록되었습니다!'
                        : undefined
                  }
                  content={msg.content}
                  variant={
                    msg.type === 'notice' || msg.type === 'info' || msg.type === 'warning'
                      ? msg.type
                      : undefined
                  }
                />
              ) : (
                <ChatMessageItem
                  message={{ ...msg, sentAt: formatTime(msg.sentAt) }}
                  isMyMessage={msg.senderId === myUserId}
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        onSend={handleSendMessage}
        showOptions={showOptions}
        onToggleOptions={toggleOptions}
        onScheduleClick={() => setShowScheduleModal(true)}
      />

      {showScheduleModal && (
        <ScheduleModal
          partnerName={partnerName}
          partnerProfileImage={partnerProfileImage}
          onClose={() => setShowScheduleModal(false)}
          onConfirm={(msg) => handleSendSystemMessage(msg, 'info')}
        />
      )}
    </div>
  );
}

export default ChatRoom;
