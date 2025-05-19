// ✅ iOS 대응 + 카카오톡 스타일 완전 반응형 채팅방 (fixed/absolute/vh 없이)
import { useRef, useState, useLayoutEffect } from 'react';

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
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
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

  return (
    <div className="h-screen w-full flex flex-col bg-white">
      {/* 헤더 */}
      <div className="shrink-0 border-b px-4 py-3 bg-white z-10">
        <div className="font-bold">책친구</div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-2" ref={messagesEndRef}>
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
      </div>

      {/* 입력창 */}
      <div className="shrink-0 border-t bg-white px-4 py-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="flex-1 border px-4 py-2 rounded-full focus:outline-none"
          />
          <button type="submit" className="text-blue-500 font-semibold">
            전송
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;
