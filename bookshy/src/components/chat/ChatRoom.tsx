import { useEffect, useRef, useState, useCallback } from 'react';
import { ChatMessage, RegisterSchedulePayload } from '@/types/chat/chat.ts';
import ChatMessageItem from './ChatMessageItem.tsx';
import ChatInput from './ChatInput.tsx';
import ChatRoomHeader from './ChatRoomHeader.tsx';
import ScheduleModal from './ScheduleModal.tsx';
import SystemMessage from './SystemMessage.tsx';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMessages, markMessagesAsRead, registerSchedule } from '@/services/chat/chat.ts';
import { useStomp } from '@/hooks/chat/useStomp.ts';
import { getUserIdFromToken } from '@/utils/jwt.ts';

interface Props {
  partnerName: string;
  partnerProfileImage: string;
  initialMessages: ChatMessage[];
}

function ChatRoom({ partnerName, partnerProfileImage }: Props) {
  const { roomId } = useParams();
  const numericRoomId = Number(roomId);
  const myUserId = getUserIdFromToken();
  if (myUserId === null) return;
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
      markMessagesAsRead(numericRoomId)
        .then(() => {
          refetch();
          queryClient.setQueryData(['chatList'], (prev: any) => {
            if (!Array.isArray(prev)) return prev;
            return prev.map((room: any) =>
              room.id === numericRoomId ? { ...room, unreadCount: 0 } : room,
            );
          });
        })
        .catch((err) => console.error('❌ 읽음 처리 실패:', err));
    }
  }, [numericRoomId, refetch, queryClient]);

  useEffect(() => {
    if (!isSuccess) return;

    if (initialMessages.length > 0 && messages.length === 0) {
      setMessages(initialMessages);
    } else if (initialMessages.length === 0 && messages.length === 0) {
      const now = new Date();
      const noticeMessage: ChatMessage = {
        id: 'notice-' + Date.now(),
        senderId: -1,
        chatRoomId: numericRoomId,
        content:
          '도서 교환은 공공장소에서 진행하고, 책 상태를 미리 확인하세요.\n과도한 개인정보 요청이나 외부 연락 유도는 주의하세요.\n도서 상호 대여 서비스 사용 시 반납 기한을 꼭 지켜주세요!\n안전하고 즐거운 독서 문화 함께 만들어가요!',
        sentAt: now.toISOString(),
        type: 'notice',
      };
      setMessages([noticeMessage]);
    }
  }, [initialMessages, messages.length, isSuccess, numericRoomId]);

  const onMessage = useCallback(
    (newMessage: ChatMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === newMessage.id);
        return exists ? prev : [...prev, newMessage];
      });

      queryClient.setQueryData(['chatList'], (prev: any) => {
        if (!Array.isArray(prev)) return prev;
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
    [queryClient],
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
    sendMessage(numericRoomId, myUserId, content, 'chat');
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
  };

  const registerScheduleAndNotify = async (message: string, payload: RegisterSchedulePayload) => {
    try {
      await registerSchedule(payload);
      handleSendSystemMessage(message, 'info');
    } catch (error) {
      console.error('❌ 일정 등록 실패:', error);
      // handleSendSystemMessage('일정 등록에 실패했습니다. 다시 시도해주세요.', 'warning');
    }
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

          const isSystem = ['info', 'notice', 'warning'].includes(msg.type ?? '');

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
                        : msg.type === 'warning'
                          ? '알림'
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
          roomId={numericRoomId}
          requestId={Number(0)}
          onClose={() => setShowScheduleModal(false)}
          onConfirm={registerScheduleAndNotify}
        />
      )}
    </div>
  );
}

export default ChatRoom;
