import ChatList from '@/components/chatlist/ChatList';
import Header from '@/components/common/Header';

function ChatListPage() {
  return (
    <div className="flex flex-col bg-light-bg pb-16">
      <Header title={'채팅'} showBackButton={false} />
      <ChatList />
    </div>
  );
}

export default ChatListPage;
