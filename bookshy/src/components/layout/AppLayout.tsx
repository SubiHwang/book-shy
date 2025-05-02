import { FC } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, matchPath } from 'react-router-dom';
import BottomTabBar from '../common/BottomTabBar';
import MatchingPage from '@/pages/matching/MatchingPage';
import ChatListPage from '@/pages/chat/ChatListPage';
import ChatRoomPage from '@/pages/chat/ChatRoomPage';

const AppLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 탭 변경 시 해당 경로로 이동
  const handleTabChange = (tabId: string): void => {
    navigate(`/${tabId}`);
  };

  // 채팅창에서 BottomTabBar 숨기기
  const isChatRoom = matchPath('/chat/:roomId', location.pathname);

  return (
    <div className="app-container">
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/bookshelf" replace />} />
          <Route path="/bookshelf" element={<div>내 서재</div>} />
          <Route path="/matching" element={<MatchingPage />} />
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:roomId" element={<ChatRoomPage />} />
          <Route path="/booknote" element={<div>독서 기록</div>} />
          <Route path="/mypage" element={<div>마이</div>} />
        </Routes>
      </div>
      {!isChatRoom && <BottomTabBar onTabChange={handleTabChange} />}
    </div>
  );
};

export default AppLayout;
