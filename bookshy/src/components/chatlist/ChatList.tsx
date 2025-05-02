import { ChatRoomSummary } from '../../types/chat';
import ChatListItem from './ChatListItem.tsx';

const dummyChatRooms: ChatRoomSummary[] = [
  {
    roomId: '1',
    partnerName: '마이콜',
    partnerProfileImage:
      'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbguJOC%2FbtsNFnGX9MK%2F2hVVXFWQM8IwjT1h3vKh8k%2Fimg.jpg',
    lastMessage: '위치가 어디시죠?',
    lastMessageTime: '오후 3:01',
    unreadCount: 2,
  },
  {
    roomId: '2',
    partnerName: '잭슨',
    partnerProfileImage:
      'https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbzIOjQ%2FbtsNE2iIUCt%2FScKePxVg6XZCFUMPi6KIg0%2Fimg.png',
    lastMessage: '좋아요. 거래 합시다.',
    lastMessageTime: '오후 3:01',
    unreadCount: 1,
  },
];

function ChatList() {
  return (
    <div className="bg-light-bg dark:bg-dark-bg h-full">
      {dummyChatRooms.map((room) => (
        <ChatListItem key={room.roomId} room={room} />
      ))}
    </div>
  );
}

export default ChatList;
