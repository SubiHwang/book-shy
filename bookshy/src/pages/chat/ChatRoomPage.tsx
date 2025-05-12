import ChatRoom from '@/components/chat/ChatRoom';
import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ChatMessage } from '@/types/chat/chat';

function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { state } = useLocation();
  const [initialMessages] = useState<ChatMessage[]>([]);

  const partnerName = state?.partnerName || '상대방';
  const partnerProfileImage =
    state?.partnerProfileImage || 'https://cdn.bookshy.com/profile/user5.jpg';

  if (!roomId) return <div className="p-4 text-center text-gray-500">잘못된 접근입니다.</div>;

  return (
    <ChatRoom
      partnerName={partnerName}
      partnerProfileImage={partnerProfileImage}
      initialMessages={initialMessages}
    />
  );
}

export default ChatRoomPage;
