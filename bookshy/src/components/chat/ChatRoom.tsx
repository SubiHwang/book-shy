import { useEffect, useRef, useState, useCallback } from 'react';
import { ChatMessage, RegisterSchedulePayload } from '@/types/chat/chat.ts';
import ChatMessageItem from './ChatMessageItem.tsx';
import ChatInput from './ChatInput.tsx';
import ChatRoomHeader from './ChatRoomHeader.tsx';
import ScheduleModal from './ScheduleModal.tsx';
import SystemMessage from './SystemMessage.tsx';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchMessages,
  markMessagesAsRead,
  registerSchedule,
  sendEmoji,
} from '@/services/chat/chat.ts';
import { useStomp } from '@/hooks/chat/useStomp.ts';
import { useWebSocket } from '@/contexts/WebSocketProvider';
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
  if (myUserId === null) return null;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [emojiTargetId, setEmojiTargetId] = useState<string | null>(null);
  const [emojiMap, setEmojiMap] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();
  const { subscribeReadTopic, sendReadReceipt } = useWebSocket();

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

  // 초기 입장 시 파트너 메시지 unread -> read 처리
  useEffect(() => {
    if (!isNaN(numericRoomId) && initialMessages.length > 0) {
      markMessagesAsRead(numericRoomId).then(() => {
        const unreadMessages = initialMessages.filter(
          (msg) => msg.senderId !== myUserId && !msg.isRead,
        );

        const messageIds = unreadMessages.map((m) => Number(m.id));
        if (messageIds.length > 0) {
          sendReadReceipt(numericRoomId, myUserId, messageIds);
        }

        setMessages((prev) =>
          prev.map((msg) => (msg.senderId !== myUserId ? { ...msg, isRead: true } : msg)),
        );
      });
    }
  }, [numericRoomId, initialMessages, myUserId, sendReadReceipt]);

  // 실시간 읽음 알림 구독 (상대가 읽었을 때만 내 메시지 읽음 처리)
  useEffect(() => {
    if (isNaN(numericRoomId)) return;
    const sub = subscribeReadTopic(numericRoomId, (readerId, messageIds) => {
      // 내가 읽은 거면 무시
      if (readerId === myUserId) return;

      // 상대가 읽은 내 메시지들에 대해 isRead 처리
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId === myUserId && messageIds.includes(Number(msg.id))
            ? { ...msg, isRead: true }
            : msg,
        ),
      );
    });

    return () => sub?.unsubscribe();
  }, [numericRoomId, subscribeReadTopic, myUserId]);

  // 과거 + 신규 메시지 불러오기 및 공지 삽입
  useEffect(() => {
    if (!isSuccess) return;

    setMessages((prev) => {
      const prevIds = new Set(prev.map((m) => m.id));
      const newMessages = initialMessages.filter((m) => !prevIds.has(m.id));

      if (prev.length === 0 && initialMessages.length === 0) {
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
        return [noticeMessage];
      }

      return [...prev, ...newMessages];
    });
  }, [initialMessages, isSuccess, numericRoomId]);

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

  // 메시지 수신 시 자동 스크롤
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
    }
  };

  const handleSelectEmoji = (messageId: string, emoji: string) => {
    setEmojiMap((prev) => ({
      ...prev,
      [messageId]: prev[messageId] === emoji ? '' : emoji,
    }));
    setEmojiTargetId(null);
    sendEmoji(Number(messageId), emoji);
  };

  const handleLongPressOrRightClick = (messageId: string) => {
    setEmojiTargetId((prev) => (prev === messageId ? null : messageId));
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
                  showEmojiSelector={emojiTargetId === msg.id}
                  onLongPress={() => handleLongPressOrRightClick(msg.id)}
                  onRightClick={() => handleLongPressOrRightClick(msg.id)}
                  onSelectEmoji={(emoji) => handleSelectEmoji(msg.id, emoji)}
                  selectedEmoji={emojiMap[msg.id]}
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
