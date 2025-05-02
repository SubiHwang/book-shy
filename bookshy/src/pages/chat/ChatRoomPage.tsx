import ChatRoom from '@/components/chat/ChatRoom';
import { useParams } from 'react-router-dom';

function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  // roomId에 따라 상대방 정보 가져오는 로직 추가 가능
  const dummyPartner = {
    partnerName: '마이클',
    partnerProfileImage:
      'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbzIOjQ%2FbtsNE2iIUCt%2FScKePxVg6XZCFUMPi6KIg0%2Fimg.png',
  };

  const dummyMessages = [
    { id: '1', senderId: 'partner', content: '거래하실게요.', timestamp: '09:10' },
    { id: '2', senderId: 'partner', content: '위치가 어디시죠?', timestamp: '09:10' },
  ];

  return (
    <ChatRoom
      partnerName={dummyPartner.partnerName}
      partnerProfileImage={dummyPartner.partnerProfileImage}
      initialMessages={dummyMessages}
    />
  );
}

export default ChatRoomPage;
