import { FC } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, matchPath } from 'react-router-dom';
import BottomTabBar from '../common/BottomTabBar';
import MyLibraryPage from '../../pages/mylibrary/MyLibraryPage';
import MatchingPage from '@/pages/matching/matching/MatchingPage';
import ChatListPage from '@/pages/chat/ChatListPage';
import ChatRoomPage from '@/pages/chat/ChatRoomPage';
import MatchingRecommend from '@/pages/matching/matching/MatchingRecommend';
import MyPage from '@/pages/mypage/MyPage';
import TradePromiseList from '@/pages/mypage/TradePromiseList';
import TradeHistoryList from '@/pages/mypage/TradeHistoryList';
import WishBooks from '@/pages/matching/wishbook/WishBooks';
import NeighborBookshelfPage from '@/pages/matching/neighborbookshelf/NeighborBookshelfPage';
import AddBySelfPage from '@/pages/mylibrary/AddBook/AddBySelfPage';
import AddByTitlePage from '@/pages/mylibrary/AddBook/AddByTitlePage';
import AddByBarcodePage from '@/pages/mylibrary/AddBook/AddByISBNPage';
import AddISBNResultPage from '@/pages/mylibrary/AddBook/AddISBNResultPage';
import AddBySearchPage from '@/pages/mylibrary/AddBook/AddBySearchPage';
import OCRResultPage from '@/pages/mylibrary/AddBook/OCRResultPage';
import AllMyBooksTab from '@/pages/mylibrary/tabs/AllBooksTab';
import PublicMyBooksTab from '@/pages/mylibrary/tabs/PublicBooksTab';
import SearchWishBooks from '@/pages/matching/wishbook/SearchWishBooks';
import BookDetailPage from '@/pages/mylibrary/BookDetailPage';
import BookInfoTab from '@/pages/mylibrary/tabs/BookInfoTab';
import BookNotesTab from '@/pages/mylibrary/tabs/BookNotesTab';
import ISBNScanResultPage from '@/pages/mylibrary/AddBook/ISBNScanResultPage';

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
          <Route path="matching/search-wish-books" element={<SearchWishBooks />} />
          <Route path="/chat" element={<div>채팅</div>} />
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
