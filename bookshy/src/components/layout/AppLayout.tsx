import { FC } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import BottomTabBar from '../common/BottomTabBar';
import MyLibraryPage from '../../pages/mylibrary/MyLibraryPage';
import MatchingPage from '@/pages/matching/MatchingPage';
import MatchingRecommend from '@/pages/matching/MatchingRecommend';
import MyPage from '@/pages/mypage/MyPage';
import TradePromiseList from '@/pages/mypage/TradePromiseList';
import TradeHistoryList from '@/pages/mypage/TradeHistoryList';
import WishBooks from '@/pages/matching/WishBooks';
import NeighborBookshelfPage from '@/pages/matching/NeighborBookshelf/NeighborBookshelfPage';
import AddBySelfPage from '@/pages/mylibrary/AddBook/AddBySelfPage';
import AddByTitlePage from '@/pages/mylibrary/AddBook/AddByTitlePage';
import AddByISBNPage from '@/pages/mylibrary/AddBook/AddByISBNPage';
import AddBySearchPage from '@/pages/mylibrary/AddBook/AddBySearchPage';
import OCRResultPage from '@/pages/mylibrary/AddBook/OCRResultPage';
import AllMyBooksTab from '@/pages/mylibrary/tabs/AllBooksTab';
import PublicMyBooksTab from '@/pages/mylibrary/tabs/PublicBooksTab';
import BookDetailPage from '@/pages/mylibrary/BookDetailPage';
import BookInfoTab from '@/pages/mylibrary/tabs/BookInfoTab';
import BookNotesTab from '@/pages/mylibrary/tabs/BookNotesTab';

const AppLayout: FC = () => {
  const navigate = useNavigate();

  // 탭 변경 시 해당 경로로 이동
  const handleTabChange = (tabId: string): void => {
    navigate(`/${tabId}`);
  };

  return (
    <div className="app-container">
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/bookshelf" replace />} />
          {/* 📚 서재 기본 페이지 */}
          <Route path="/bookshelf" element={<MyLibraryPage />}>
            {/* 기본 라우트는 모든 책 페이지로 리다이렉트 */}
            <Route index element={<Navigate to="/bookshelf/all-my-books" replace />} />
            {/* 책 보기 탭 */}
            <Route path="all-my-books" element={<AllMyBooksTab />} />
            <Route path="public-my-books" element={<PublicMyBooksTab />} />
          </Route>
          {/* 책 상세 페이지 */}
          <Route path="/bookshelf/books/:id" element={<BookDetailPage />}>
            <Route path="info" element={<BookInfoTab />} />
            <Route path="notes" element={<BookNotesTab />} />
          </Route>

          {/* 📚 책 추가 페이지들 - 별도 라우트로 분리 */}
          <Route path="/bookshelf/add/search" element={<AddBySearchPage />} />
          <Route path="/bookshelf/add/self" element={<AddBySelfPage />} />
          <Route path="/bookshelf/add/title" element={<AddByTitlePage />} />
          <Route path="/bookshelf/add/isbn" element={<AddByISBNPage />} />
          <Route path="/bookshelf/add/ocr-result" element={<OCRResultPage />} />
          <Route path="/matching" element={<MatchingPage />}>
            <Route index element={<MatchingRecommend />} />
            <Route path="wish-books" element={<WishBooks />} />
          </Route>
          <Route path="matching/neigbors-bookshelf/:userId" element={<NeighborBookshelfPage />} />
          <Route path="/chat" element={<div>채팅</div>} />
          <Route path="/booknote" element={<div>독서 기록</div>} />
          {/* ✅ 마이페이지 라우팅 추가 */}
          <Route path="/mypage" element={<MyPage />}>
            <Route index element={<TradePromiseList />} />
            <Route path="history" element={<TradeHistoryList />} />
          </Route>
        </Routes>
      </div>
      <BottomTabBar onTabChange={handleTabChange} />
    </div>
  );
};

export default AppLayout;
