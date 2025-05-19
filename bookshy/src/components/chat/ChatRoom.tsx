import { useEffect, useRef, useState, useLayoutEffect } from 'react';

interface ChatMessage {
  id: number;
  senderId: number;
  content: string;
}

interface ChatRoomProps {
  partnerName: string;
  partnerProfileImage: string;
  initialMessages: ChatMessage[];
  bookShyScore: number;
  myBookId: number;
  myBookName: string;
  otherBookId: number;
  otherBookName: string;
}

function ChatRoomHeader({ partnerName }: { partnerName: string }) {
  return (
    <div className="h-14 flex items-center px-4 border-b text-lg font-semibold bg-white">
      {partnerName}
    </div>
  );
}

function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
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
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
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
      </div>
    </div>
  );
}

export default function ChatRoom({
  partnerName,
  partnerProfileImage: _partnerProfileImage,
  initialMessages,
  bookShyScore: _bookShyScore,
  myBookId: _myBookId,
  myBookName: _myBookName,
  otherBookId: _otherBookId,
  otherBookName: _otherBookName,
}: ChatRoomProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
    const handleResize = () => {
      const visual = window.visualViewport;
      if (!visual || !messagesContainerRef.current) return;
      const headerHeight = 56;
      const inputHeight = 64;
      const adjustedHeight = visual.height - headerHeight - inputHeight;
      messagesContainerRef.current.style.height = `${adjustedHeight}px`;
    };

    handleResize();
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (msg: string) => {
    const newMessage: ChatMessage = {
      id: Date.now(),
      senderId: 1,
      content: msg,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col bg-white">
      <ChatRoomHeader partnerName={partnerName} />

      <div ref={messagesContainerRef} className="overflow-y-auto px-4 sm:px-6 py-3">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} isMyMessage={msg.senderId === 1} />
        ))}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white z-50 border-t">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
