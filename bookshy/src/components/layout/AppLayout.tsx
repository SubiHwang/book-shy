import { FC } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, matchPath } from 'react-router-dom';
import BottomTabBar from '../common/BottomTabBar';
import MatchingPage from '@/pages/matching/MatchingPage';
import ChatListPage from '@/pages/chat/ChatListPage';
import ChatRoomPage from '@/pages/chat/ChatRoomPage';
import MatchingRecommend from '@/pages/matching/MatchingRecommend';
import MyPage from '@/pages/mypage/MyPage';
import TradePromiseList from '@/pages/mypage/TradePromiseList';
import TradeHistoryList from '@/pages/mypage/TradeHistoryList';
import WishBooks from '@/pages/matching/WishBooks';
import NeighborBookshelfPage from '@/pages/matching/NeighborBookshelf/NeighborBookshelfPage';

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
          <Route path="/matching" element={<MatchingPage />}>
            <Route index element={<MatchingRecommend />} />
            <Route path="wish-books" element={<WishBooks />} />
          </Route>
            <Route path="matching/neigbors-bookshelf/:userId" element={<NeighborBookshelfPage />} />
          <Route path="/chat" element={<ChatListPage />} />
          <Route path="/chat/:roomId" element={<ChatRoomPage />} />
          <Route path="/booknote" element={<div>독서 기록</div>} />
          {/* ✅ 마이페이지 라우팅 추가 */}
          <Route path="/mypage" element={<MyPage />}>
            <Route index element={<TradePromiseList />} />
            <Route path="history" element={<TradeHistoryList />} />
          </Route>
        </Routes>
      </div>
      {!isChatRoom && <BottomTabBar onTabChange={handleTabChange} />}
    </div>
  );
};

export default AppLayout;
