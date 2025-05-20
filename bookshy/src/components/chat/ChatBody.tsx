import { FC } from 'react';
import { ChatMessage } from '@/types/chat/chat';

interface ChatBodyProps {
  roomId: string;
  initialMessages: ChatMessage[];
  myUserId?: number | string | null;
}

const ChatBody: FC<ChatBodyProps> = ({ roomId, initialMessages, myUserId }) => {
  return (
    <div className="flex flex-col px-4 py-3">
      {/* 메시지 map 등 실제 구현은 기존 ChatRoom 코드 참조 */}
      {initialMessages.map((msg, idx) => {
        const isMine = myUserId != null && msg.senderId == myUserId;
        return (
          <div
            key={msg.id || idx}
            className={`mb-2 flex ${isMine ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm whitespace-pre-line
                ${isMine ? 'bg-primary text-white rounded-br-md' : 'bg-gray-100 text-black rounded-bl-md'}`}
            >
              {msg.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatBody; 