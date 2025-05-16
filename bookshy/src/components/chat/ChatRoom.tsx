import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { ChatMessage, RegisterSchedulePayload } from '@/types/chat/chat.ts';
import ChatMessageItem from './ChatMessageItem.tsx';
import ChatInput from './ChatInput.tsx';
import ChatRoomHeader from './ChatRoomHeader.tsx';
import ScheduleModal from './ScheduleModal.tsx';
import SystemMessage from './SystemMessage.tsx';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteEmoji,
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
  initialMessages?: ChatMessage[];
  bookShyScore: number;
}

interface EmojiUpdatePayload {
  messageId: number;
  emoji: string;
  type: 'ADD' | 'REMOVE';
  updatedBy: number;
}

function ChatRoom({ partnerName, partnerProfileImage, bookShyScore }: Props) {
  const { roomId } = useParams();
  const numericRoomId = Number(roomId);
  const myUserId = getUserIdFromToken();
  if (myUserId === null) return null;
  const userId = Number(myUserId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [emojiTargetId, setEmojiTargetId] = useState<string | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const queryClient = useQueryClient();

  const updateHeight = () => {
    const header = document.getElementById('chat-header');
    const input = document.getElementById('chat-input');
    const visualHeight = window.visualViewport?.height || 0;
    const innerHeight = window.innerHeight;
    const hasKeyboard = Math.abs(innerHeight - visualHeight) > 100;
    const height = hasKeyboard ? visualHeight : innerHeight;

    if (header && input && messageContainerRef.current) {
      const usedHeight = header.offsetHeight + input.offsetHeight;
      const available = height - usedHeight;
      messageContainerRef.current.style.height = `${available}px`;
    }
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.visualViewport?.addEventListener('resize', updateHeight);
    window.visualViewport?.addEventListener('scroll', updateHeight);
    updateHeight();

    return () => {
      document.body.style.overflow = originalOverflow;
      window.visualViewport?.removeEventListener('resize', updateHeight);
      window.visualViewport?.removeEventListener('scroll', updateHeight);
    };
  }, []);

  const { data: initialMessages = [], isSuccess } = useQuery({
    queryKey: ['chatMessages', numericRoomId],
    queryFn: () => fetchMessages(numericRoomId),
    enabled: !isNaN(numericRoomId),
    retry: false,
    staleTime: 0,
  });

  const prevMessageCountRef = useRef(messages.length);
  const isInitialLoadRef = useRef(true);

  useLayoutEffect(() => {
    const prevCount = prevMessageCountRef.current;
    const currentCount = messages.length;

    if (currentCount > prevCount) {
      requestAnimationFrame(() => {
        const container = messagesEndRef.current?.parentElement;
        if (!container) return;

        const distanceFromBottom =
          container.scrollHeight - container.scrollTop - container.clientHeight;

        const isAtBottom = distanceFromBottom < 100;

        if (isInitialLoadRef.current) {
          scrollToBottom(false);
          isInitialLoadRef.current = false;
        } else {
          if (isAtBottom) {
            scrollToBottom(false);
          } else {
            setShowScrollToBottom(true);
          }
        }

        prevMessageCountRef.current = currentCount;
      });
    } else {
      prevMessageCountRef.current = currentCount;
    }
  }, [messages]);

  useEffect(() => {
    if (!isSuccess) return;
    setMessages(initialMessages);
  }, [initialMessages, isSuccess]);

  const onRead = useCallback(
    (payload: { readerId: number; messageIds: number[] }) => {
      if (payload.readerId === userId) return;
      setMessages((prev) =>
        prev.map((msg) =>
          payload.messageIds.includes(Number(msg.id)) ? { ...msg, read: true } : msg,
        ),
      );
    },
    [userId],
  );

  const onMessage = useCallback((newMessage: ChatMessage) => {
    setMessages((prev) =>
      prev.some((m) => m.id === newMessage.id) ? prev : [...prev, newMessage],
    );
  }, []);

  const { sendMessage } = useStomp(numericRoomId, onMessage, onRead);
  const { subscribeCalendarTopic, subscribeEmojiTopic, unsubscribe, isConnected } = useWebSocket();

  useEffect(() => {
    if (!isNaN(numericRoomId)) {
      markMessagesAsRead(numericRoomId).catch((err) => console.error('❌ 읽음 처리 실패:', err));
      queryClient.setQueryData(['chatList'], (prev: any) => {
        if (!Array.isArray(prev)) return prev;
        return prev.map((room: any) =>
          room.id === numericRoomId ? { ...room, unreadCount: 0 } : room,
        );
      });
    }
  }, [numericRoomId, queryClient]);

  useEffect(() => {
    if (!isConnected || isNaN(numericRoomId)) return;

    const sub = subscribeCalendarTopic(numericRoomId, (calendarDto) => {
      const rawDate =
        calendarDto.exchangeDate || calendarDto.rentalStartDate || calendarDto.rentalEndDate;

      if (!rawDate) return;

      const formattedDate = new Date(rawDate).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });

      const sysMsg: ChatMessage = {
        id: calendarDto.id || Date.now(),
        chatRoomId: numericRoomId,
        senderId: 0,
        content: `📌 일정 등록됨: ${formattedDate}`,
        type: 'info',
        sentAt: new Date().toISOString(),
        read: false,
        emoji: '',
      };

      setMessages((prev) => [...prev, sysMsg]);
    });

    return () => unsubscribe(sub);
  }, [numericRoomId, subscribeCalendarTopic, unsubscribe, isConnected]);

  useEffect(() => {
    if (!isConnected || isNaN(numericRoomId)) return;

    const sub = subscribeEmojiTopic(
      numericRoomId,
      ({ messageId, emoji, type }: EmojiUpdatePayload) => {
        setMessages((prev) =>
          prev.map((msg) =>
            Number(msg.id) === messageId ? { ...msg, emoji: type === 'ADD' ? emoji : '' } : msg,
          ),
        );
      },
    );

    return () => unsubscribe(sub);
  }, [numericRoomId, subscribeEmojiTopic, unsubscribe, isConnected]);

  useEffect(() => {
    const container = messagesEndRef.current?.parentElement;
    if (!container) return;
    const onScroll = () => {
      const show = container.scrollHeight - container.scrollTop - container.clientHeight > 100;
      setShowScrollToBottom(show);
    };
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  const handleSendMessage = (content: string) => {
    if (isNaN(numericRoomId)) return;
    sendMessage(numericRoomId, myUserId, content, 'chat');
  };

  const registerScheduleAndNotify = async (_message: string, payload: RegisterSchedulePayload) => {
    try {
      await registerSchedule(payload);
    } catch (e) {
      console.error('❌ 일정 등록 실패:', e);
    }
  };

  const handleSelectEmoji = async (messageId: string, emoji: string) => {
    setEmojiTargetId(null);

    const targetMessage = messages.find((m) => m.id === messageId);
    if (!targetMessage) return;

    const currentEmoji = Array.isArray(targetMessage.emoji)
      ? targetMessage.emoji[0]
      : targetMessage.emoji;

    if (currentEmoji === emoji) {
      try {
        await deleteEmoji(Number(messageId));
      } catch (e) {
        console.error('❌ 이모지 삭제 실패:', e);
      }
    } else {
      try {
        await sendEmoji(Number(messageId), emoji);
      } catch (e) {
        console.error('❌ 이모지 추가 실패:', e);
      }
    }
  };

  const handleLongPressOrRightClick = (messageId: string) => {
    setEmojiTargetId((prev) => (prev === messageId ? null : messageId));
  };

  const formatDateLabel = (iso: string) => {
    const d = new Date(iso);
    return isNaN(d.getTime())
      ? ''
      : d.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'short',
        });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return isNaN(d.getTime())
      ? ''
      : d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  let lastDateLabel = '';

  return (
    <div
      className="flex flex-col bg-white"
      style={{
        position: 'fixed',
        inset: 0, // top: 0, left: 0, right: 0, bottom: 0
        height: '100%',
        overflow: 'hidden', // body 스크롤 막는 효과
        zIndex: 0, // 다른 고정 요소와 겹치지 않도록
      }}
    >
      {/* 헤더 */}
      <div id="chat-header" className="shrink-0 z-10">
        <ChatRoomHeader
          partnerName={partnerName}
          partnerProfileImage={partnerProfileImage}
          bookShyScore={bookShyScore}
        />
      </div>

      {/* 메시지 영역 */}
      <div
        ref={messageContainerRef}
        className="overflow-y-auto px-4 sm:px-6 py-3 pb-20 transition-all duration-300 bg-white"
      >
        {messages.map((msg, idx) => {
          const dateLabel = formatDateLabel(msg.sentAt);
          const showDate = dateLabel !== lastDateLabel;
          lastDateLabel = dateLabel;

          const isSystem = ['info', 'notice', 'warning'].includes(msg.type ?? '');
          return (
            <div key={`${msg.id}-${idx}`}>
              {showDate && (
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-light-text-muted my-4">
                  <div className="flex-grow border-t border-light-bg-shade" />
                  <span className="px-2 whitespace-nowrap">{dateLabel}</span>
                  <div className="flex-grow border-t border-light-bg-shade" />
                </div>
              )}
              {isSystem ? (
                <SystemMessage
                  title={
                    msg.type === 'notice'
                      ? '거래 시 주의해주세요!'
                      : msg.type === 'info'
                        ? '약속이 등록되었습니다!'
                        : '알림'
                  }
                  content={msg.content}
                  variant={msg.type as 'notice' | 'info' | 'warning'}
                />
              ) : (
                <ChatMessageItem
                  message={{ ...msg, sentAt: formatTime(msg.sentAt), read: msg.read }}
                  isMyMessage={msg.senderId === myUserId}
                  showEmojiSelector={emojiTargetId === msg.id}
                  onLongPress={() => handleLongPressOrRightClick(msg.id)}
                  onRightClick={() => handleLongPressOrRightClick(msg.id)}
                  onSelectEmoji={(emoji) => handleSelectEmoji(msg.id, emoji ?? '')}
                  selectedEmoji={Array.isArray(msg.emoji) ? msg.emoji[0] : msg.emoji}
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* ↓ 아래로 버튼 */}
      {showScrollToBottom && (
        <div
          className={`absolute inset-x-0 flex justify-center z-30 transition-all duration-300 ${showOptions ? 'bottom-[35vh]' : 'bottom-[88px]'}`}
        >
          <button
            className="bg-black/60 hover:bg-black/80 text-white text-lg sm:text-xl px-3 py-1.5 rounded-full shadow-md"
            onClick={() => scrollToBottom(true)}
            aria-label="맨 아래로 스크롤"
          >
            ↓
          </button>
        </div>
      )}
      <div id="chat-input" className="shrink-0 z-20 bg-white border-t border-light-border px-4">
        <ChatInput
          onSend={handleSendMessage}
          showOptions={showOptions}
          onToggleOptions={() => {
            const container = messagesEndRef.current?.parentElement;
            const wasAtBottom = container
              ? container.scrollHeight - container.scrollTop - container.clientHeight < 50
              : false;

            setShowOptions((prev) => !prev);
            setTimeout(() => {
              const event = new Event('resize');
              window.visualViewport?.dispatchEvent(event);
              if (wasAtBottom) {
                requestAnimationFrame(() => scrollToBottom(true));
              }
            }, 300);
          }}
          onScheduleClick={() => setShowScheduleModal(true)}
        />
      </div>

      {/* 일정 모달 */}
      {showScheduleModal && (
        <ScheduleModal
          partnerName={partnerName}
          partnerProfileImage={partnerProfileImage}
          roomId={numericRoomId}
          requestId={0}
          onClose={() => setShowScheduleModal(false)}
          onConfirm={registerScheduleAndNotify}
        />
      )}
    </div>
  );
}

export default ChatRoom;
