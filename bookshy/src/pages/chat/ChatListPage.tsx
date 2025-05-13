import ChatList from '@/components/chatlist/ChatList';
import Header from '@/components/common/Header';

function ChatListPage() {
  return (
    <div>
      <Header title={'채팅'} showBackButton={false} />
      <ChatList />
    </div>
  );
}

export default ChatListPage;
