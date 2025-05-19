// ✅ iOS 대응 + 카카오톡 스타일 완전 반응형 채팅방 (fixed/absolute/vh 없이)
import { useRef, useState, useLayoutEffect, useEffect } from 'react';

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

interface ChatMessage {
  id: string;
  content: string;
  senderId: number;
  sentAt: string;
}

function ChatRoom({
  partnerName: _partnerName,
  partnerProfileImage: _partnerProfileImage,
  initialMessages: _initialMessages,
  bookShyScore: _bookShyScore,
  myBookId: _myBookId,
  myBookName: _myBookName,
  otherBookId: _otherBookId,
  otherBookName: _otherBookName,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: 1, content: '안녕하세요~', sentAt: '오후 05:54' },
    { id: '2', senderId: 2, content: '하이용 ㅎㅎㅎㅎ', sentAt: '오후 06:17' },
    { id: '3', senderId: 1, content: '오늘 뭐해요?', sentAt: '오후 06:18' },
    { id: '4', senderId: 2, content: '책 읽을거예요 📚', sentAt: '오후 06:19' },
    { id: '5', senderId: 1, content: '안녕하세요~', sentAt: '오후 05:54' },
    { id: '6', senderId: 2, content: '하이용 ㅎㅎㅎㅎ', sentAt: '오후 06:17' },
    { id: '7', senderId: 1, content: '오늘 뭐해요?', sentAt: '오후 06:18' },
    { id: '8', senderId: 2, content: '책 읽을거예요 📚', sentAt: '오후 06:19' },
    { id: '9', senderId: 1, content: '안녕하세요~', sentAt: '오후 05:54' },
    { id: '10', senderId: 2, content: '하이용 ㅎㅎㅎㅎ', sentAt: '오후 06:17' },
    { id: '11', senderId: 1, content: '오늘 뭐해요?', sentAt: '오후 06:18' },
    { id: '12', senderId: 2, content: '책 읽을거예요 📚', sentAt: '오후 06:19' },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  // Scroll to bottom when messages change
  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  // Handle viewport height changes (mobile keyboard)
  useEffect(() => {
    const main = messageContainerRef.current;
    if (!main) return;

    const updateMaxHeight = () => {
      const visual = window.visualViewport;
      if (!visual) return;
      const headerHeight = 56;
      const footerHeight = 64;
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        senderId: 1,
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
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Fixed Header */}
      <header className="shrink-0 h-[56px] border-b flex items-center px-4 bg-white z-10">
        <div className="font-bold">{_partnerName}</div>
      </header>

      {/* Scrollable Chat Area */}
      <main ref={messageContainerRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 flex ${msg.senderId === 1 ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-lg px-3 py-2 text-sm shadow-sm whitespace-pre-wrap ${
                msg.senderId === 1 ? 'bg-blue-100 text-right' : 'bg-gray-100'
              }`}
            >
              {msg.content}
              <div className="text-[10px] text-gray-400 mt-1">{msg.sentAt}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* Fixed Input Bar */}
      <footer
        className="shrink-0 bg-white px-4 py-2 border-t z-20"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => scrollToBottom(true)}
            className="flex-1 border px-4 py-2 rounded-full focus:outline-none"
            placeholder="메시지를 입력하세요"
          />
          <button type="submit" className="text-blue-500 font-semibold">
            전송
          </button>
        </form>
      </footer>
    </div>
  );
}

export default ChatRoom;
