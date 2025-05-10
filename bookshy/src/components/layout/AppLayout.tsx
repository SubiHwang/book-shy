import { FC } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BottomTabBar from '../common/BottomTabBar';
import MyLibraryPage from '../../pages/mylibrary/MyLibraryPage';
import MatchingPage from '@/pages/matching/matching/MatchingPage';
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
import MyBookNotesPage from '@/pages/mybooknote/MyBookNotesPage';
import BookNoteDetailPage from '@/pages/mybooknote/BookNoteDetailPage';
import BookNoteFullPage from '@/pages/mybooknote/BookNoteFullPage';
import BookNoteEditPage from '@/pages/mybooknote/BookNoteEditPage';
import BookNoteCreatePage from '@/pages/mybooknote/BookNoteCreatePage';
import BookNoteSelectPage from '@/pages/mybooknote/BookNoteSelectPage';
import Login from '@/pages/auth/Login';
import PrivateRoute from '@/components/layout/PrivateRoute';
import KaKaoOauth from '@/pages/auth/KaKaoOauth';

const AppLayout: FC = () => {
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  // 탭 변경 시 해당 경로로 이동
  const handleTabChange = (tabId: string): void => {
    navigate(`/${tabId}`);
  };

  return (
    <div className="app-container">
      <div className="content">
        <Routes>
          {/* 공개 라우트 - 로그인하지 않아도 접근 가능 */}
          <Route path="/login" element={<Login />} />
          <Route path="/oauth" element={<KaKaoOauth />} />

          {/* 📚 매칭 페이지 */}
          <Route path="/matching" element={<MatchingPage />}>
            <Route index element={<MatchingRecommend />} />
            <Route path="wish-books" element={<WishBooks />} />
          </Route>
          <Route path="matching/neigbors-bookshelf/:userId" element={<NeighborBookshelfPage />} />
          <Route path="matching/search-wish-books" element={<SearchWishBooks />} />
          <Route path="/chat" element={<div>채팅</div>} />

          <Route path="/booknotes" element={<MyBookNotesPage />} />
          <Route path="/booknotes/detail/:bookId" element={<BookNoteDetailPage />} />
          <Route path="/booknotes/full/:bookId" element={<BookNoteFullPage />} />
          <Route path="/booknotes/edit/:bookId" element={<BookNoteEditPage />} />
          <Route path="/booknotes/create" element={<BookNoteCreatePage />} />
          <Route path="/booknotes/select" element={<BookNoteSelectPage />} />

          {/* 보호된 라우트 - 로그인해야만 접근 가능 */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Routes>
                  {/* 기본 경로 리다이렉션 */}
                  <Route path="/" element={<Navigate to="/bookshelf" replace />} />

                  {/* 📚 서재 기본 페이지 */}
                  <Route path="/bookshelf" element={<MyLibraryPage />}>
                    <Route index element={<AllMyBooksTab />} />
                    <Route path="/bookshelf/public-my-books" element={<PublicMyBooksTab />} />
                  </Route>

                  {/* 책 상세 페이지 */}
                  <Route path="/bookshelf/books/:id" element={<BookDetailPage />}>
                    <Route index element={<BookInfoTab />} />
                    <Route path="notes" element={<BookNotesTab />} />
                  </Route>

                  {/* 📚 책 추가 페이지 */}
                  <Route path="/bookshelf/add/search" element={<AddBySearchPage />} />
                  <Route path="/bookshelf/add/self" element={<AddBySelfPage />} />
                  <Route path="/bookshelf/add/title" element={<AddByTitlePage />} />
                  <Route path="/bookshelf/add/isbn" element={<AddByBarcodePage />} />
                  <Route path="/bookshelf/add/isbn-scan-result" element={<AddISBNResultPage />} />
                  {/* OCR, ISBN결과 페이지 */}
                  <Route path="/bookshelf/add/ocr-result" element={<OCRResultPage />} />
                  <Route path="/bookshelf/add/isbn-result/:isbn" element={<ISBNScanResultPage />} />

                  {/* 📚 매칭 페이지 */}
                  <Route path="/matching" element={<MatchingPage />}>
                    <Route index element={<MatchingRecommend />} />
                    <Route path="wish-books" element={<WishBooks />} />
                  </Route>
                  <Route
                    path="/matching/neigbors-bookshelf/:userId"
                    element={<NeighborBookshelfPage />}
                  />
                  <Route path="/matching/search-wish-books" element={<SearchWishBooks />} />

                  {/* 채팅과 독서기록 페이지 */}
                  <Route path="/chat" element={<div>채팅</div>} />

                  {/* ✅ 마이페이지 라우팅 */}
                  <Route path="/mypage" element={<MyPage />}>
                    <Route index element={<TradePromiseList />} />
                    <Route path="history" element={<TradeHistoryList />} />
                  </Route>

                  {/* 그 외 경로는 홈으로 리다이렉션 */}
                  <Route path="*" element={<Navigate to="/bookshelf" />} />
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>

      {/* 하단 탭 바 (로그인된 경우에만 표시) */}
      {!isLoading && <BottomTabBar onTabChange={handleTabChange} />}
    </div>
  );
};

export default AppLayout;
