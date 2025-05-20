import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { ChatMessage, RegisterSchedulePayload } from '@/types/chat/chat.ts';
import ChatMessageItem from './ChatMessageItem.tsx';
import ChatInput from './ChatInput.tsx';
import ChatRoomHeader from './ChatRoomHeader.tsx';
import ScheduleModal from './ScheduleModal.tsx';
import SystemMessage from './SystemMessage.tsx';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteEmoji,
  fetchMessages,
  markMessagesAsRead,
  registerSchedule,
  sendEmoji,
  fetchChatRoomUserIds,
  fetchScheduleByRoomId,
  fetchPartnerInfo,
} from '@/services/chat/chat.ts';
import { useStomp } from '@/hooks/chat/useStomp.ts';
import { useWebSocket } from '@/contexts/WebSocketProvider';
import { getUserIdFromToken } from '@/utils/jwt.ts';

interface Props {
  initialMessages?: ChatMessage[];
  myBookId: number[];
  myBookName: string[];
  otherBookId: number[];
  otherBookName: string[];
}

interface EmojiUpdatePayload {
  messageId: number;
  emoji: string;
  type: 'ADD' | 'REMOVE';
  updatedBy: number;
}

interface PartnerInfo {
  name: string;
  profileImage: string;
  bookShyScore: number;
}

function ChatRoom({ myBookId, myBookName, otherBookId, otherBookName }: Props) {
  const { roomId } = useParams();
  const numericRoomId = Number(roomId);
  const myUserId = getUserIdFromToken();
  const userId = myUserId ? Number(myUserId) : 0;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [emojiTargetId, setEmojiTargetId] = useState<string | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: initialMessages = [], isSuccess } = useQuery({
    queryKey: ['chatMessages', numericRoomId],
    queryFn: () => fetchMessages(numericRoomId),
    enabled: !isNaN(numericRoomId),
    retry: false,
    staleTime: 0,
  });

  const prevMessageCountRef = useRef(messages.length);
  const isInitialLoadRef = useRef(true);

  // 상대방 정보 상태
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);

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
    if (!isSuccess) return;
    setMessages(initialMessages);
  }, [initialMessages, isSuccess]);

  useEffect(() => {
    if (!isNaN(numericRoomId)) {
      fetchPartnerInfo(numericRoomId).then(setPartnerInfo);
    }
  }, [numericRoomId]);

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

  const onMessage = useCallback(
    (newMessage: ChatMessage) => {
      setMessages((prev) =>
        prev.some((m) => m.id === newMessage.id) ? prev : [...prev, newMessage],
      );
      if (newMessage.senderId !== myUserId) {
        markMessagesAsRead(numericRoomId).catch((err) => console.error('❌ 읽음 실패:', err));
      }
      queryClient.setQueryData(['chatList'], (prev: any) =>
        Array.isArray(prev)
          ? prev.map((room: any) =>
              room.id === newMessage.chatRoomId
                ? {
                    ...room,
                    lastMessage: newMessage.content,
                    lastMessageTime: newMessage.timestamp,
                  }
                : room,
            )
          : prev,
      );
    },
    [myUserId, numericRoomId, queryClient],
  );

  const { sendMessage } = useStomp(numericRoomId, onMessage, onRead);
  const { subscribeCalendarTopic, subscribeEmojiTopic, unsubscribe, isConnected } = useWebSocket();

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
        timestamp: new Date().toISOString(),
        isRead: false,
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
    if (isNaN(numericRoomId) || !myUserId) return;
    sendMessage(numericRoomId, myUserId, content, 'chat');
  };

  const registerScheduleAndNotify = async (_message: string, payload: RegisterSchedulePayload) => {
    console.log('🚀 registerScheduleAndNotify 함수 호출됨');
    console.log('📦 받은 payload:', payload);

    try {
      // 채팅방 사용자 ID 조회
      const { userAId, userBId } = await fetchChatRoomUserIds(numericRoomId);
      console.log('👥 채팅방 사용자 ID:', { userAId, userBId });

      // 일정 등록을 위한 페이로드 구성
      const schedulePayload: RegisterSchedulePayload = {
        roomId: numericRoomId,
        type: payload.type,
        userIds: [userAId, userBId],
        bookAId: myBookId[0],
        bookBId: otherBookId[0],
        title: payload.title,
        description: payload.description,
        ...(payload.type === 'EXCHANGE'
          ? { exchangeDate: payload.exchangeDate }
          : {
              startDate: payload.startDate,
              endDate: payload.endDate,
            }),
      };

      // 요청 데이터 로깅
      console.log('📅 일정 등록 요청 데이터:', {
        ...schedulePayload,
        userIds: [userAId, userBId],
        type: schedulePayload.type,
        dates:
          payload.type === 'EXCHANGE'
            ? `exchangeDate: ${payload.exchangeDate}`
            : `startDate: ${payload.startDate}, endDate: ${payload.endDate}`,
      });

      // 일정 등록
      await registerSchedule(schedulePayload);
    } catch (e) {
      console.error('❌ 일정 등록 실패:', e);
    }
  };

  const handleSelectEmoji = async (messageId: number, emoji: string) => {
    try {
      if (emoji) {
        await sendEmoji(messageId, emoji);
      } else {
        await deleteEmoji(messageId);
      }
      setEmojiTargetId(null);
    } catch (error) {
      console.error('이모지 처리 실패:', error);
    }
  };

  const handleLongPressOrRightClick = (messageId: number) => {
    setEmojiTargetId((prev) => (prev === messageId.toString() ? null : messageId.toString()));
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

  // 캘린더 일정 조회
  const { data: calendarEvent } = useQuery({
    queryKey: ['chatCalendar', numericRoomId],
    queryFn: () => fetchScheduleByRoomId(numericRoomId),
    enabled: !isNaN(numericRoomId),
  });

  // 당일 일정 여부 확인
  const isTodayEvent = useCallback(() => {
    if (!calendarEvent) {
      console.log('❌ 캘린더 이벤트 없음');
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let eventDate: Date;
    if (calendarEvent.type === 'EXCHANGE' && calendarEvent.exchangeDate) {
      eventDate = new Date(calendarEvent.exchangeDate);
      console.log('📅 교환 일정:', {
        type: calendarEvent.type,
        exchangeDate: calendarEvent.exchangeDate,
        parsedDate: eventDate.toISOString(),
      });
    } else if (calendarEvent.type === 'RENTAL' && calendarEvent.rentalEndDate) {
      eventDate = new Date(calendarEvent.rentalEndDate);
      console.log('📅 대여 일정:', {
        type: calendarEvent.type,
        rentalEndDate: calendarEvent.rentalEndDate,
        parsedDate: eventDate.toISOString(),
      });
    } else {
      console.log('❌ 유효하지 않은 일정 데이터:', calendarEvent);
      return false;
    }
    eventDate.setHours(0, 0, 0, 0);

    console.log('📊 날짜 비교:', {
      today: today.toISOString(),
      eventDate: eventDate.toISOString(),
      isMatch: today.getTime() === eventDate.getTime(),
    });

    return today.getTime() === eventDate.getTime();
  }, [calendarEvent]);

  if (!myUserId) {
    return null;
  }

  return (
    <div className="relative h-full min-h-0 bg-white pb-safe">
      {/* 헤더 - 항상 상단 고정 */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <ChatRoomHeader
          partnerName={partnerInfo?.name ?? '로딩중...'}
          partnerProfileImage={partnerInfo?.profileImage ?? '/default-profile.png'}
          bookShyScore={partnerInfo?.bookShyScore ?? 0}
        />
      </div>

      {/* 메시지 영역 - 내부 스크롤, 헤더/인풋 높이만큼 패딩 */}
      <div
        className={`overflow-y-auto transition-all duration-300 ${showOptions ? 'pb-[35vh]' : ''}`}
        style={{ paddingTop: 56, paddingBottom: showOptions ? '35vh' : 64, height: '100vh' }}
      >
        {messages.map((msg, index) => {
          const dateLabel = formatDateLabel(msg.timestamp ?? msg.sentAt ?? '');
          const showDateLabel =
            index === 0 ||
            dateLabel !==
              formatDateLabel(messages[index - 1].timestamp ?? messages[index - 1].sentAt ?? '');

          const isSystem = ['info', 'notice', 'warning'].includes(msg.type ?? '');
          return (
            <div key={`${msg.id}-${index}`}>
              {showDateLabel && (
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-light-text-muted my-4">
                  <div className="flex-grow border-t border-light-bg-shade" />
                  <span className="px-2 whitespace-nowrap">{dateLabel}</span>
                  <div className="flex-grow border-t border-light-bg-shade" />
                </div>
              )}
              {isSystem ? (
                <div className="max-w-[90%] mx-auto">
                  <SystemMessage
                    title={
                      msg.type === 'notice'
                        ? '거래 시 주의해주세요!'
                        : msg.type === 'info'
                          ? '약속이 등록되었습니다!'
                          : '알림'
                    }
                    content={msg.content ?? ''}
                    variant={msg.type as 'notice' | 'info' | 'warning'}
                  />
                </div>
              ) : (
                <ChatMessageItem
                  message={{
                    ...msg,
                    timestamp: formatTime(msg.timestamp ?? msg.sentAt ?? ''),
                    isRead: msg.isRead ?? msg.read ?? false,
                  }}
                  isMyMessage={msg.senderId === myUserId}
                  showEmojiSelector={emojiTargetId === msg.id.toString()}
                  onLongPress={() => handleLongPressOrRightClick(msg.id)}
                  onRightClick={() => handleLongPressOrRightClick(msg.id)}
                  onSelectEmoji={(emoji) => handleSelectEmoji(msg.id, emoji ?? '')}
                  selectedEmoji={msg.emoji}
                  onCloseEmoji={() => setEmojiTargetId(null)}
                />
              )}
            </div>
          );
        })}

        {/* 📌 교환 완료 유도 메시지 - 당일 일정인 경우에만 표시 */}
        {isTodayEvent() && (
          <div className="bg-[#FFEFEF] border border-primary text-primary rounded-lg p-4 mt-4 text-center shadow-sm">
            <p className="font-semibold text-sm">📚 도서를 교환하셨나요?</p>
            <p className="text-xs mt-1 text-light-text-muted">
              거래가 완료되었다면 리뷰를 남겨주세요.
            </p>
            <button
              onClick={() =>
                navigate(`/chat/${numericRoomId}/review`, {
                  state: {
                    chatSummary: {
                      partnerName: partnerInfo?.name ?? '',
                      partnerProfileImage: partnerInfo?.profileImage ?? '',
                      bookShyScore: partnerInfo?.bookShyScore ?? 0,
                      myBookId: myBookId[0],
                      myBookName: myBookName[0],
                      otherBookId: otherBookId[0],
                      otherBookName: otherBookName[0],
                    },
                  },
                })
              }
              className="mt-3 inline-block bg-primary text-white text-xs font-medium px-4 py-2 rounded-full"
            >
              거래 완료
            </button>
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* ↓ 아래로 버튼 */}
      {showScrollToBottom && (
        <div
          className="fixed inset-x-0 flex justify-center z-30 transition-all duration-300"
          style={{
            bottom: showOptions ? `calc(25vh + 72px)` : `72px`, // 옵션 열렸을 때는 옵션+인풋+여유, 아니면 인풋+여유
          }}
        >
          <button
            className="bg-black/70 hover:bg-black/85 text-white text-base sm:text-lg px-3 py-1.5 rounded-full shadow-md border border-black/10"
            style={{ minWidth: 44 }}
            onClick={() => scrollToBottom(true)}
            aria-label="맨 아래로 스크롤"
          >
            ↓
          </button>
        </div>
      )}

      {/* 인풋창 - 항상 하단 고정 */}
      <div className="fixed left-0 right-0 bottom-0 z-20 bg-white border-t border-light-border px-4">
        <ChatInput
          onSend={handleSendMessage}
          showOptions={showOptions}
          onToggleOptions={() => {
            const container = messagesEndRef.current?.parentElement;
            const wasAtBottom = container
              ? container.scrollHeight - container.scrollTop - container.clientHeight < 50
              : false;

            setShowOptions((prev) => !prev);

            // 확장된 후 DOM이 완전히 반영된 다음 스크롤 (조금 delay)
            if (wasAtBottom) {
              setTimeout(() => {
                requestAnimationFrame(() => {
                  scrollToBottom(true); // smooth 스크롤
                });
              }, 250); // 약간 더 넉넉한 시간
            }
          }}
          onScheduleClick={() => setShowScheduleModal(true)}
          chatRoomId={numericRoomId}
        />
      </div>

      {/* 일정 모달 */}
      {showScheduleModal && (
        <ScheduleModal
          partnerName={partnerInfo?.name ?? '로딩중...'}
          partnerProfileImage={partnerInfo?.profileImage ?? '/default-profile.png'}
          roomId={numericRoomId}
          onClose={() => setShowScheduleModal(false)}
          onConfirm={registerScheduleAndNotify}
        />
      )}
    </div>
  );
}

export default ChatRoom;
