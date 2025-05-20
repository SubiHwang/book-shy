import ChatHeader from './ChatHeader';
import ChatBody from './ChatBody';
import ChatInputBar from './ChatInputBar';
import ScrollToBottomButton from './ScrollToBottomButton';
import { Camera, Image, CalendarDays, Phone } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat/chat';
import { getUserIdFromToken } from '@/utils/jwt';
import { fetchMessages } from '@/services/chat/chat';

const HEADER_HEIGHT = 56;
const FOOTER_HEIGHT = 64;
const OPTION_HEIGHT = 140;

interface ChatRoomLayoutProps {
  roomId: string;
  partnerName: string;
  partnerProfileImage: string;
  bookShyScore: number;
  myBookId: number[];
  myBookName: string[];
  otherBookId: number[];
  otherBookName: string[];
  initialMessages: ChatMessage[];
}

function OptionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      className="flex flex-col items-center text-primary hover:opacity-80 transition select-none"
      onClick={onClick}
      style={{ background: 'none', border: 'none' }}
    >
      <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center mb-2">
        {icon}
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

export default function ChatRoomLayout(props: ChatRoomLayoutProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const myUserId = getUserIdFromToken();

  // 채팅 메시지 불러오기
  useEffect(() => {
    const fetch = async () => {
      if (!props.roomId) return;
      const msgs = await fetchMessages(Number(props.roomId));
      setMessages(msgs);
      // 진입 시 마지막 메시지로 이동 (auto)
      setTimeout(() => {
        if (chatBodyRef.current) {
          chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
      }, 0);
    };
    fetch();
  }, [props.roomId]);

  // 스크롤이 위에 있을 때 아래로 내려가는 버튼 표시
  useEffect(() => {
    const container = chatBodyRef.current;
    if (!container) return;
    const onScroll = () => {
      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowScrollToBottom(distanceFromBottom > 100);
    };
    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative h-screen bg-white">
      {/* 헤더 */}
      <ChatHeader
        partnerName={props.partnerName}
        partnerProfileImage={props.partnerProfileImage}
        bookShyScore={props.bookShyScore}
      />

      {/* 채팅 영역 */}
      <div
        ref={chatBodyRef}
        className="absolute left-0 right-0 overflow-y-auto"
        style={{
          top: HEADER_HEIGHT,
          bottom: FOOTER_HEIGHT,
        }}
      >
        <ChatBody
          roomId={props.roomId}
          initialMessages={messages}
          myUserId={myUserId}
        />
      </div>

      {/* 아래로 내려가는 버튼 */}
      {showScrollToBottom && (
        <ScrollToBottomButton
          bottom={FOOTER_HEIGHT + (showOptions ? OPTION_HEIGHT : 0)}
          onClick={() => {
            if (chatBodyRef.current) {
              chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
            }
          }}
        />
      )}

      {/* 인풋창 (확장 옵션이 열리면 위로 올라감) */}
      <div
        className="fixed left-0 right-0"
        style={{
          bottom: showOptions ? OPTION_HEIGHT : 0,
          height: FOOTER_HEIGHT,
          zIndex: 20,
          transition: 'bottom 0.3s',
        }}
      >
        <ChatInputBar
          onToggleOptions={() => setShowOptions((v) => !v)}
          showOptions={showOptions}
        />
      </div>

      {/* 확장 옵션: 인풋창 아래(화면 맨 하단)에 위치 */}
      {showOptions && (
        <div
          className="fixed left-0 right-0 bg-light-bg-secondary border-t"
          style={{
            bottom: 0,
            height: OPTION_HEIGHT,
            zIndex: 10,
            transition: 'height 0.3s',
          }}
        >
          <div className="flex items-center justify-around h-full px-6">
            <OptionButton icon={<Camera size={32} />} label="카메라" />
            <OptionButton icon={<Image size={32} />} label="앨범" />
            <OptionButton icon={<CalendarDays size={32} />} label="약속" />
            <OptionButton icon={<Phone size={32} />} label="전화" />
          </div>
        </div>
      )}
    </div>
  );
} 