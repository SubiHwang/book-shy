import { ChatMessage } from '@/types/chat/chat';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import ChatRoomHeader from './ChatRoomHeader';

interface Props {
  partnerName: string;
  partnerProfileImage: string;
  initialMessages: ChatMessage[];
  bookShyScore: number;
  myBookId: number[];
  myBookName: string[];
  otherBookId: number[];
  otherBookName: string[];
}

function ChatInput({
  onSend,
  onFocus,
  inputRef,
}: {
  onSend: (msg: string) => void;
  onFocus?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      className="flex items-center gap-2 px-4 py-2"
    >
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onFocus={onFocus}
        placeholder="메시지를 입력하세요"
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
      />
      <button type="submit" className="text-blue-500 font-semibold">
        전송
      </button>
    </form>
  );
}

function ChatMessageItem({ message, isMyMessage }: { message: ChatMessage; isMyMessage: boolean }) {
  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
          isMyMessage ? 'bg-blue-100 text-right' : 'bg-gray-100'
        }`}
      >
        {message.content}
        <div className="text-[10px] text-gray-400 mt-1">{message.sentAt}</div>
      </div>
    </div>
  );
}

export default function ChatRoom({
  partnerName: _partnerName,
  partnerProfileImage: _partnerProfileImage,
  initialMessages: _initialMessages,
  bookShyScore: _bookShyScore,
  myBookId: _myBookId,
  myBookName: _myBookName,
  otherBookId: _otherBookId,
  otherBookName: _otherBookName,
}: Props) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: 1, content: '안녕하세요~', sentAt: '오후 05:54', read: true },
    { id: '2', senderId: 2, content: '하이용 ㅎㅎㅎㅎ', sentAt: '오후 06:17', read: true },
    { id: '3', senderId: 1, content: '오늘 뭐해요?', sentAt: '오후 06:18', read: true },
    { id: '4', senderId: 2, content: '책 읽을거예요 📚', sentAt: '오후 06:19', read: true },
    { id: '5', senderId: 1, content: '안녕하세요~', sentAt: '오후 05:54', read: true },
    { id: '6', senderId: 2, content: '하이용 ㅎㅎㅎㅎ', sentAt: '오후 06:17', read: true },
    { id: '7', senderId: 1, content: '오늘 뭐해요?', sentAt: '오후 06:18', read: true },
    { id: '8', senderId: 2, content: '책 읽을거예요 📚', sentAt: '오후 06:19', read: true },
    { id: '9', senderId: 1, content: '안녕하세요~', sentAt: '오후 05:54', read: true },
    { id: '10', senderId: 2, content: '하이용 ㅎㅎㅎㅎ', sentAt: '오후 06:17', read: true },
    { id: '11', senderId: 1, content: '오늘 뭐해요?', sentAt: '오후 06:18', read: true },
    { id: '12', senderId: 2, content: '책 읽을거예요 📚', sentAt: '오후 06:19', read: true },
  ]);

  // ✅ 키보드 대응 - visualViewport로 메시지 영역 동적 높이 조절
  useEffect(() => {
    const handleResize = () => {
      const visual = window.visualViewport;
      if (!visual || !messagesContainerRef.current) return;
      const headerHeight = 56;
      const inputHeight = 64;

      const availableHeight = visual.height - headerHeight - inputHeight;
      messagesContainerRef.current.style.height = `${availableHeight}px`;
    };

    handleResize(); // 초기 실행
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  // ✅ 입력창 포커스 시 스크롤 아래로
  const handleInputFocus = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (msg: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 1,
      content: msg,
      sentAt: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-screen bg-white pb-safe">
      <ChatRoomHeader partnerName="책친구" partnerProfileImage={''} bookShyScore={0} />

      <div ref={messagesContainerRef} className="overflow-y-auto px-4 sm:px-6 py-3">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} isMyMessage={msg.senderId === 1} />
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="shrink-0 border-t">
        <ChatInput onSend={handleSend} onFocus={handleInputFocus} inputRef={inputRef} />
      </div>
    </div>
  );
}
