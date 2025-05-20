import { useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { ChatMessage } from '@/types/chat/chat';
import ChatRoomLayout from '@/components/chat/ChatRoomLayout';

function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { state } = useLocation();
  const [initialMessages] = useState<ChatMessage[]>([]);

  const partnerName = state?.partnerName || '상대방';
  const partnerProfileImage =
    state?.partnerProfileImage || 'https://cdn.bookshy.com/profile/user5.jpg';
  const bookShyScore = state?.bookShyScore || 100.0;
  const myBookId = state?.myBookId || [];
  const myBookName = state?.myBookName || [];
  const otherBookId = state?.otherBookId || [];
  const otherBookName = state?.otherBookName || [];

  if (!roomId) return <div className="p-4 text-center text-gray-500">잘못된 접근입니다.</div>;

  return (
    <ChatRoomLayout
      roomId={roomId}
      partnerName={partnerName}
      partnerProfileImage={partnerProfileImage}
      initialMessages={initialMessages}
      bookShyScore={bookShyScore}
      myBookId={myBookId}
      myBookName={myBookName}
      otherBookId={otherBookId}
      otherBookName={otherBookName}
    />
  );
}

export default ChatRoomPage;
