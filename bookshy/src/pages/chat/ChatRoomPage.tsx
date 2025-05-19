import ChatRoom from '@/components/chat/ChatRoom';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ChatMessage } from '@/types/chat/chat';

function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
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
    <div className="bg-white min-h-screen">
      {/* 상단 헤더 (고정) */}
      <div className="fixed top-0 left-0 w-full h-14 bg-white border-b flex items-center px-4 z-20">
        <button
          className="mr-3 p-1 rounded-full hover:bg-gray-100"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <span className="text-xl">←</span>
        </button>
        <span className="font-bold text-lg">{partnerName}</span>
      </div>
      {/* 채팅방 본문 (헤더 높이만큼 padding-top) */}
      <div className="pt-14">
        <ChatRoom
          partnerName={partnerName}
          partnerProfileImage={partnerProfileImage}
          initialMessages={initialMessages}
          bookShyScore={bookShyScore}
          myBookId={myBookId}
          myBookName={myBookName}
          otherBookId={otherBookId}
          otherBookName={otherBookName}
        />
      </div>
    </div>
  );
}

export default ChatRoomPage;
