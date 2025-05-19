import ChatRoom from '@/components/chat/ChatRoom';
import { useParams } from 'react-router-dom';

function ChatRoomTestPage() {
  const { roomId } = useParams();

  return (
    <ChatRoom
      partnerName="테스트 사용자"
      partnerProfileImage="https://cdn.bookshy.com/profile/user5.jpg"
      bookShyScore={87.5}
      initialMessages={[
        {
          id: 'msg1',
          chatRoomId: Number(roomId) || 1,
          senderId: 999, // 본인
          content: '안녕하세요!',
          type: 'chat',
          sentAt: new Date().toISOString(),
          read: true,
          emoji: '',
        },
        {
          id: 'msg2',
          chatRoomId: Number(roomId) || 1,
          senderId: 123, // 상대방
          content: '책 잘 부탁드려요.',
          type: 'chat',
          sentAt: new Date().toISOString(),
          read: false,
          emoji: '',
        },
      ]}
      myBookId={[101]}
      myBookName={['해리포터']}
      otherBookId={[202]}
      otherBookName={['반지의 제왕']}
    />
  );
}

export default ChatRoomTestPage;
