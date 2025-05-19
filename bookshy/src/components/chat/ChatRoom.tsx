import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Plus, Minus, Camera, Image, CalendarDays, Phone, ArrowLeft } from 'lucide-react';
import ScheduleModal from './ScheduleModal';
import { registerSchedule, sendEmoji, deleteEmoji } from '@/services/chat/chat';
import { RegisterSchedulePayload } from '@/types/chat/chat';

interface ChatMessage {
  id: string;
  content: string;
  senderId: number;
  sentAt: string;
  emoji?: string;
}

interface ChatRoomProps {
  partnerName: string;
  partnerProfileImage: string;
  initialMessages: ChatMessage[];
  bookShyScore: number;
  myBookId: number[];
  myBookName: string[];
  otherBookId: number[];
  otherBookName: string[];
}

const INPUT_BAR_HEIGHT = 56;
const EXPAND_AREA_HEIGHT = 100;
const MY_USER_ID = 1; // 실제 로그인 유저 ID로 대체

const EMOJI_LIST = ['😀', '😂', '😍', '👍', '😮', '😢', '😡'];

function EmojiSelector({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 flex gap-1 bg-white border border-gray-200 rounded-full shadow-lg px-2 py-1">
      {EMOJI_LIST.map((emoji) => (
        <button
          key={emoji}
          className="text-xl hover:scale-125 transition-transform"
          onClick={() => onSelect(emoji)}
          type="button"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  partnerName,
  partnerProfileImage,
  initialMessages,
  bookShyScore: _bookShyScore,
  myBookId: _myBookId,
  myBookName: _myBookName,
  otherBookId: _otherBookId,
  otherBookName: _otherBookName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    ...initialMessages,
    // 기존 20개 더미 메시지
    {
      id: '1',
      content: '안녕하세요! 😀',
      senderId: 2,
      sentAt: '2025-04-19T09:11:00',
    },
    { id: '2', content: '책 교환 가능하신가요?', senderId: 2, sentAt: '2025-04-19T09:12:00' },
    { id: '3', content: '네! 가능합니다.', senderId: 1, sentAt: '2025-04-19T09:13:00' },
    { id: '4', content: '언제 만날까요?', senderId: 2, sentAt: '2025-04-19T09:14:00' },
    { id: '5', content: '이번 주 토요일은 어떠세요?', senderId: 1, sentAt: '2025-04-19T09:15:00' },
    { id: '6', content: '좋아요! 시간은요?', senderId: 2, sentAt: '2025-04-19T09:16:00' },
    { id: '7', content: '오전 11시쯤 괜찮으세요?', senderId: 1, sentAt: '2025-04-19T09:17:00' },
    { id: '8', content: '네! 장소는 어디로 할까요?', senderId: 2, sentAt: '2025-04-19T09:18:00' },
    {
      id: '9',
      content: '시청역 2번 출구 앞에서 만나요.',
      senderId: 1,
      sentAt: '2025-04-19T09:19:00',
    },
    { id: '10', content: '네! 그때 뵐게요.', senderId: 2, sentAt: '2025-04-19T09:20:00' },
    { id: '11', content: '안녕하세요! 도착하셨나요?', senderId: 2, sentAt: '2025-04-20T10:55:00' },
    { id: '12', content: '네, 도착했습니다!', senderId: 1, sentAt: '2025-04-20T10:56:00' },
    { id: '13', content: '곧 도착합니다!', senderId: 2, sentAt: '2025-04-20T10:57:00' },
    { id: '14', content: '천천히 오세요~', senderId: 1, sentAt: '2025-04-20T10:58:00' },
    { id: '15', content: '감사합니다!', senderId: 2, sentAt: '2025-04-20T10:59:00' },
    { id: '16', content: '책 상태 정말 좋아요!', senderId: 2, sentAt: '2025-04-21T11:00:00' },
    {
      id: '17',
      content: '마음에 드셨다니 다행이에요.',
      senderId: 1,
      sentAt: '2025-04-21T11:01:00',
    },
    { id: '18', content: '다음에 또 교환해요!', senderId: 2, sentAt: '2025-04-21T11:02:00' },
    { id: '19', content: '네! 연락드릴게요.', senderId: 1, sentAt: '2025-04-21T11:03:00' },
    { id: '20', content: '좋은 하루 보내세요~', senderId: 2, sentAt: '2025-04-21T11:04:00' },
    // 추가 20개 더미 메시지
    {
      id: '21',
      content: '혹시 다음 주에도 시간 괜찮으세요?',
      senderId: 1,
      sentAt: '2025-04-22T09:10:00',
    },
    { id: '22', content: '네! 일정 조정 가능합니다.', senderId: 2, sentAt: '2025-04-22T09:12:00' },
    { id: '23', content: '감사합니다. 연락드릴게요!', senderId: 1, sentAt: '2025-04-22T09:13:00' },
    {
      id: '24',
      content: '혹시 읽으신 책 중에 추천해주실 만한 거 있나요?',
      senderId: 2,
      sentAt: '2025-04-22T09:15:00',
    },
    {
      id: '25',
      content: '저는 "어린왕자" 정말 좋았어요.',
      senderId: 1,
      sentAt: '2025-04-22T09:16:00',
    },
    { id: '26', content: '아! 저도 그 책 좋아해요.', senderId: 2, sentAt: '2025-04-22T09:17:00' },
    {
      id: '27',
      content: '혹시 다음에 그 책도 교환할 수 있을까요?',
      senderId: 2,
      sentAt: '2025-04-22T09:18:00',
    },
    {
      id: '28',
      content: '네! 상태가 괜찮으면 가능해요.',
      senderId: 1,
      sentAt: '2025-04-22T09:19:00',
    },
    { id: '29', content: '사진 보내주실 수 있나요?', senderId: 2, sentAt: '2025-04-22T09:20:00' },
    { id: '30', content: '네, 잠시만요!', senderId: 1, sentAt: '2025-04-22T09:21:00' },
    {
      id: '31',
      content: '사진 잘 받았습니다. 상태 좋아 보이네요!',
      senderId: 2,
      sentAt: '2025-04-22T09:22:00',
    },
    {
      id: '32',
      content: '마음에 드신다니 다행이에요.',
      senderId: 1,
      sentAt: '2025-04-22T09:23:00',
    },
    {
      id: '33',
      content: '혹시 교환 장소는 어디가 좋으세요?',
      senderId: 2,
      sentAt: '2025-04-22T09:24:00',
    },
    {
      id: '34',
      content: '이번에도 시청역 근처가 좋을 것 같아요.',
      senderId: 1,
      sentAt: '2025-04-22T09:25:00',
    },
    {
      id: '35',
      content: '좋아요! 시간은 언제가 괜찮으세요?',
      senderId: 2,
      sentAt: '2025-04-22T09:26:00',
    },
    { id: '36', content: '오후 2시쯤 어떠세요?', senderId: 1, sentAt: '2025-04-22T09:27:00' },
    { id: '37', content: '네! 그때 뵙겠습니다.', senderId: 2, sentAt: '2025-04-22T09:28:00' },
    {
      id: '38',
      content: '감사합니다. 좋은 하루 보내세요!',
      senderId: 1,
      sentAt: '2025-04-22T09:29:00',
    },
    {
      id: '39',
      content: '네! 다음에 또 연락드릴게요.',
      senderId: 2,
      sentAt: '2025-04-22T09:30:00',
    },
    { id: '40', content: '네~ 감사합니다!', senderId: 1, sentAt: '2025-04-22T09:31:00' },
  ]);
  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [emojiTargetId, setEmojiTargetId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 최상위 div: 100dvh로 모바일 키보드 대응
  const [viewportHeight, setViewportHeight] = useState(
    window.visualViewport?.height || window.innerHeight,
  );
  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.visualViewport?.height || window.innerHeight);
    };
    window.visualViewport?.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    return () => {
      window.visualViewport?.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  // Scroll to bottom when messages change
  useLayoutEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const isAtBottom = distanceFromBottom < 100;
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    } else {
      setShowScrollToBottom(true);
    }
  }, [messages]);

  // Only input bar height for padding
  useEffect(() => {
    const main = messageContainerRef.current;
    if (!main) return;
    const updateMaxHeight = () => {
      const visual = window.visualViewport;
      if (!visual) return;
      const headerHeight = 56;
      const footerHeight = INPUT_BAR_HEIGHT;
      main.style.maxHeight = `${visual.height - headerHeight - footerHeight}px`;
    };
    updateMaxHeight();
    window.visualViewport?.addEventListener('resize', updateMaxHeight);
    window.addEventListener('orientationchange', updateMaxHeight);
    return () => {
      window.visualViewport?.removeEventListener('resize', updateMaxHeight);
      window.removeEventListener('orientationchange', updateMaxHeight);
    };
  }, []);

  // Scroll event for ↓ button
  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowScrollToBottom(distanceFromBottom > 100);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const registerScheduleAndNotify = async (_message: string, payload: RegisterSchedulePayload) => {
    try {
      await registerSchedule(payload);
    } catch (e) {
      console.error('❌ 일정 등록 실패:', e);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        senderId: MY_USER_ID,
        content: input,
        sentAt: new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
    setInput('');
  };

  const scrollToBottom = (smooth = true) => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
      setShowScrollToBottom(false);
    });
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: 이미지 업로드 처리
  };

  const toggleOptions = () => {
    const container = messageContainerRef.current;
    const wasAtBottom = container
      ? container.scrollHeight - container.scrollTop - container.clientHeight < 50
      : false;
    setShowOptions((prev) => !prev);
    if (wasAtBottom) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          scrollToBottom(true);
        });
      }, 250);
    }
  };

  // 이모지 토글 (API 연동)
  const handleSelectEmoji = async (msgId: string, emoji: string) => {
    const msg = messages.find((m) => m.id === msgId);
    if (!msg) return;
    if (msg.emoji === emoji) {
      // 이미 선택된 이모지면 삭제
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, emoji: undefined } : m)));
      try {
        await deleteEmoji(Number(msgId));
      } catch (e) {
        console.error(e);
      }
    } else {
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, emoji } : m)));
      try {
        await sendEmoji(Number(msgId), emoji);
      } catch (e) {
        console.error(e);
      }
    }
    setEmojiTargetId(null);
  };

  // 이모지 팝업 외부 클릭 감지
  useEffect(() => {
    if (!emojiTargetId) return;
    const handleClick = (_e: MouseEvent) => {
      setEmojiTargetId(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [emojiTargetId]);

  // 시간 포맷: 오전/오후 HH:MM
  function getTimeLabel(sentAt: string) {
    const d = new Date(sentAt.replace('T', ' '));
    if (isNaN(d.getTime())) return '';
    let hour = d.getHours();
    const minute = d.getMinutes().toString().padStart(2, '0');
    const isAM = hour < 12;
    const period = isAM ? '오전' : '오후';
    if (!isAM && hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${period} ${hour.toString().padStart(2, '0')}:${minute}`;
  }

  return (
    <div className="flex flex-col bg-white" style={{ height: `${viewportHeight}px` }}>
      {/* Header */}
      <header className="shrink-0 h-[64px] border-b flex items-center px-4 bg-white z-10">
        <button
          onClick={() => window.history.back()}
          className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <img
            src={partnerProfileImage}
            alt={partnerName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <div className="font-bold">{partnerName}</div>
          </div>
        </div>
      </header>

      {/* 채팅 영역 */}
      <main
        ref={messageContainerRef}
        className="flex-1 overflow-y-auto relative px-4 py-2 bg-[#FFF9F8]"
        style={{
          transition: 'padding-bottom 0.3s',
          paddingBottom: INPUT_BAR_HEIGHT + (showOptions ? EXPAND_AREA_HEIGHT : 0),
          maxHeight:
            viewportHeight - 64 - INPUT_BAR_HEIGHT - (showOptions ? EXPAND_AREA_HEIGHT : 0),
        }}
      >
        {messages.map((msg, idx) => {
          const isMine = msg.senderId === MY_USER_ID;
          function extractDateString(sentAt: string): string | null {
            if (/^\d{4}-\d{2}-\d{2}/.test(sentAt)) {
              return sentAt.split('T')[0] || sentAt.split(' ')[0];
            }
            const d = new Date(sentAt);
            if (!isNaN(d.getTime())) {
              return d.toISOString().split('T')[0];
            }
            return null;
          }
          const msgDate = extractDateString(msg.sentAt);
          let prevMsgDate = null;
          if (idx > 0) {
            prevMsgDate = extractDateString(messages[idx - 1].sentAt);
            if (!prevMsgDate && idx > 1) {
              prevMsgDate = extractDateString(messages[idx - 2].sentAt);
            }
          }
          const showDateSeparator = idx === 0 || (msgDate && msgDate !== prevMsgDate);
          function getDateLabel(dateStr: string | null) {
            if (!dateStr) return '';
            const [y, m, d] = dateStr.split('-');
            if (!y || !m || !d) return '';
            return `${y}년 ${parseInt(m, 10)}월 ${parseInt(d, 10)}일`;
          }
          return (
            <React.Fragment key={msg.id}>
              {showDateSeparator && msgDate && (
                <div className="flex flex-col items-center my-6">
                  <div className="flex items-center w-full">
                    <div className="flex-1 border-t border-gray-200" />
                    <span className="mx-4 text-gray-500 text-sm font-medium">
                      {getDateLabel(msgDate)}
                    </span>
                    <div className="flex-1 border-t border-gray-200" />
                  </div>
                  {/* 안내 메시지: 첫 메시지 위에서만 노출 */}
                  {idx === 0 && (
                    <div className="mt-3 bg-[#FFF0F0] rounded-xl px-4 py-3 text-sm text-gray-700 w-full max-w-[340px] shadow-sm">
                      <div className="font-bold text-red-500 mb-1">거래 시 주의해주세요!</div>
                      도서 교환은 공공장소에서 진행하고, 책 상태를 미리 확인하세요.
                      <br />
                      과도한 개인정보 요청이나 외부 연락 유도는 주의하세요.
                      <br />
                      도서 상호 대여 서비스 사용 시 반납 기한을 꼭 지켜주세요!
                      <br />
                      안전하고 즐거운 독서 문화 함께 만들어가요!
                    </div>
                  )}
                </div>
              )}
              <div className={`mb-3 flex ${isMine ? 'justify-end' : 'justify-start'} items-end`}>
                {/* 시간/읽음 표시 */}
                {isMine && (
                  <div className="flex flex-col items-end mr-2 min-w-[32px]">
                    <span className="text-xs text-red-400 leading-none mb-0.5">1</span>
                    <span className="text-xs text-black leading-none">
                      {getTimeLabel(msg.sentAt)}
                    </span>
                  </div>
                )}
                <div
                  className={`
                    max-w-[66vw] rounded-2xl px-4 py-2 text-base font-normal shadow-sm
                    break-words whitespace-pre-wrap relative
                    ${isMine ? 'bg-[#F48B94] text-white' : 'bg-white text-black border border-gray-200 select-none'}
                  `}
                  onContextMenu={
                    !isMine
                      ? (e) => {
                          e.preventDefault();
                          setEmojiTargetId(msg.id);
                        }
                      : undefined
                  }
                  onPointerDown={
                    !isMine
                      ? (e) => {
                          if (e.pointerType === 'touch') {
                            const timer = setTimeout(() => setEmojiTargetId(msg.id), 400);
                            const up = () => {
                              clearTimeout(timer);
                              window.removeEventListener('pointerup', up);
                            };
                            window.addEventListener('pointerup', up, { once: true });
                          }
                        }
                      : undefined
                  }
                >
                  {msg.content}
                  {/* 이모지 리액션: 말풍선 아래, 말풍선 스타일 */}
                  {!isMine && msg.emoji && (
                    <div className="flex items-center mt-1">
                      <div className="rounded-2xl bg-gray-300/80 px-2 py-0.5 flex items-center gap-1">
                        <span className="text-xl">{msg.emoji}</span>
                        <span className="text-yellow-400 text-sm font-bold">1</span>
                      </div>
                    </div>
                  )}
                  {/* 이모지 선택 UI */}
                  {!isMine && emojiTargetId === msg.id && (
                    <div className="relative w-full flex justify-center">
                      <EmojiSelector onSelect={(emoji) => handleSelectEmoji(msg.id, emoji)} />
                    </div>
                  )}
                </div>
                {!isMine && (
                  <div className="flex flex-col items-start ml-2 min-w-[32px]">
                    <span className="text-xs text-red-400 leading-none mb-0.5">1</span>
                    <span className="text-xs text-black leading-none">
                      {getTimeLabel(msg.sentAt)}
                    </span>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* ↓ 버튼: 항상 input창 위에 고정 */}
      {showScrollToBottom && (
        <button
          onClick={() => scrollToBottom(true)}
          className="fixed left-1/2 -translate-x-1/2 z-40 bg-black/60 text-white px-4 py-2 rounded-full text-sm shadow-lg transition-all duration-300"
          style={{
            bottom: (showOptions ? EXPAND_AREA_HEIGHT : 0) + INPUT_BAR_HEIGHT + 16,
          }}
          aria-label="맨 아래로 스크롤"
        >
          ↓
        </button>
      )}

      {/* 입력창+확장영역 */}
      <footer
        className="fixed bottom-0 left-0 w-full bg-white border-t z-30"
        style={{ boxShadow: '0 -2px 8px 0 rgba(0,0,0,0.02)' }}
      >
        <form
          className="flex items-center gap-2 px-4 py-2"
          onSubmit={handleSendMessage}
          style={{ height: INPUT_BAR_HEIGHT }}
        >
          <button
            type="button"
            onClick={toggleOptions}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            tabIndex={-1}
          >
            {showOptions ? <Minus size={20} /> : <Plus size={20} />}
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => scrollToBottom(true)}
            className="flex-1 border px-4 py-2 rounded-full focus:outline-none"
            placeholder="메시지를 입력하세요"
            style={{ minHeight: 40 }}
          />
          <button
            type="submit"
            className="text-blue-500 font-semibold disabled:text-gray-400"
            disabled={!input.trim()}
          >
            전송
          </button>
        </form>
        {/* 확장영역 */}
        <div
          className="overflow-hidden transition-all duration-300 border-t border-gray-100 bg-white"
          style={{ height: showOptions ? EXPAND_AREA_HEIGHT : 0 }}
        >
          <div className="h-full flex items-center justify-around px-6">
            <button
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'image/*';
                  fileInputRef.current.capture = 'environment';
                }
                handleFileSelect();
              }}
              className="flex flex-col items-center gap-1"
            >
              <Camera size={28} strokeWidth={1.5} />
              <span className="text-xs">카메라</span>
            </button>
            <button
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'image/*';
                  fileInputRef.current.removeAttribute('capture');
                }
                handleFileSelect();
              }}
              className="flex flex-col items-center gap-1"
            >
              <Image size={28} strokeWidth={1.5} />
              <span className="text-xs">앨범</span>
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex flex-col items-center gap-1"
            >
              <CalendarDays size={28} strokeWidth={1.5} />
              <span className="text-xs">약속</span>
            </button>
            <button
              onClick={() => {
                // TODO: 전화 기능
              }}
              className="flex flex-col items-center gap-1"
            >
              <Phone size={28} strokeWidth={1.5} />
              <span className="text-xs">전화</span>
            </button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </footer>

      {showScheduleModal && (
        <ScheduleModal
          partnerName={partnerName}
          partnerProfileImage={partnerProfileImage}
          requestId={0}
          onClose={() => setShowScheduleModal(false)}
          onConfirm={registerScheduleAndNotify}
          roomId={0}
        />
      )}
    </div>
  );
};

export default ChatRoom;
