import ChatRoom from '@/components/chat/ChatRoom';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { ChatMessage } from '@/types/chat';

function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [partnerName, setPartnerName] = useState('');
  const [partnerProfileImage, setPartnerProfileImage] = useState('');
  const [initialMessages] = useState<ChatMessage[]>([]);

  if (!roomId) return <div className="p-4 text-center text-gray-500">잘못된 접근입니다.</div>;

  return (
    <ChatRoom
      partnerName={partnerName || '상대방'}
      partnerProfileImage={
        partnerProfileImage ||
        'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbguJOC%2FbtsNFnGX9MK%2F2hVVXFWQM8IwjT1h3vKh8k%2Fimg.jpg'
      }
      initialMessages={initialMessages}
    />
  );
}

export default ChatRoomPage;
