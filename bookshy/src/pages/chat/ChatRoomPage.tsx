import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ChatMessage } from '@/types/chat/chat';
import ChatRoom from '@/components/chat/ChatRoom';

function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { state } = useLocation();
  const [initialMessages] = useState<ChatMessage[]>([]);

  const myBookId = state?.myBookId || [];
  const myBookName = state?.myBookName || [];
  const otherBookId = state?.otherBookId || [];
  const otherBookName = state?.otherBookName || [];

  if (!roomId) return <div className="p-4 text-center text-gray-500">잘못된 접근입니다.</div>;

  return (
    <ChatRoom
      initialMessages={initialMessages}
      myBookId={myBookId}
      myBookName={myBookName}
      otherBookId={otherBookId}
      otherBookName={otherBookName}
    />
  );
}

export default ChatRoomPage;
