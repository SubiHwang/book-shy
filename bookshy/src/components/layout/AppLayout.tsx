import { FC } from 'react';
import { Routes, Route, Navigate, useNavigate, matchPath, useLocation } from 'react-router-dom';
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
import AddByBarcodePage from '@/pages/mylibrary/AddBook/AddByISBNPage';
import AddISBNResultPage from '@/pages/mylibrary/AddBook/AddISBNResultPage';
import AddBySearchPage from '@/pages/mylibrary/AddBook/AddBySearchPage';
import AllMyBooksTab from '@/pages/mylibrary/tabs/AllBooksTab';
import PublicMyBooksTab from '@/pages/mylibrary/tabs/PublicBooksTab';
import SearchWishBooks from '@/pages/matching/wishbook/SearchWishBooks';
import BookDetailPage from '@/pages/mylibrary/BookDetailPage';
import BookInfoTab from '@/pages/mylibrary/tabs/BookInfoTab';
import BookNotesTab from '@/pages/mylibrary/tabs/BookNotesTab';
import ISBNScanResultPage from '@/pages/mylibrary/AddBook/ISBNScanResultPage';
import SearchBookDetailPage from '@/pages/mylibrary/AddBook/SearchBookDetailPage';
import MyBookNotesPage from '@/pages/mybooknote/booknote/MyBookNotesPage';
import BookNoteFullPage from '@/pages/mybooknote/booknote/BookNoteFullPage';
import BookNoteEditPage from '@/pages/mybooknote/booknote/BookNoteEditPage';
import BookNoteCreatePage from '@/pages/mybooknote/booknote/BookNoteCreatePage';
import BookNoteSelectPage from '@/pages/mybooknote/booknote/BookNoteSelectPage';
import BookTripPage from '@/pages/mybooknote/booktrip/BookTripPage';
import BookTripDetailPage from '@/pages/mybooknote/booktrip/BookTripDetailPage';
import EditProfilePage from '@/pages/mypage/EditProfilePage';
import Login from '@/pages/auth/Login';
import PrivateRoute from '@/components/layout/PrivateRoute';
import KaKaoOauth from '@/pages/auth/KaKaoOauth';
import WishBooksDetailPage from '@/pages/matching/wishbook/WishBooksDetailPage';
import RecommandedWishBookList from '@/components/matching/searchwishbooks/RecommandedWishBookList';
import SearchResultBookList from '@/components/matching/searchwishbooks/SearchResultBookList';
import ChatListPage from '@/pages/chat/ChatListPage';
import ChatRoomPage from '@/pages/chat/ChatRoomPage';
import TradeReviewPage from '@/pages/chat/TradeReviewPage';
import LocationSetting from '@/pages/auth/LocationSetting';
import BookNotePage from '@/pages/mybooknote/booknote/BookNotePage';
import ErrorState from '../common/error/ErrorState';
import ErrorHandler from '../common/error/ErrorHandler';
import NotificationPage from '@/pages/common/NotificationPage';
import QuoteGalaxyPage from '@/pages/mybooknote/booknote/QuoteGalaxyPage';
import BookTripMapPage from '@/pages/mybooknote/booktrip/BookTripMapPage';
import TradeCompletedPage from '@/pages/chat/TradeCompletedPage';
import { CustomToastContainer } from '../common/CustomToastContainer';
const AppLayout: FC = () => {
  const navigate = useNavigate();
  const { isLoading } = useAuth();
  const location = useLocation();

  // 탭 변경 시 해당 경로로 이동
  const handleTabChange = (tabId: string): void => {
    navigate(`/${tabId}`);
  };

  // 채팅창에서 BottomTabBar 숨기기
  const isChatRoom = matchPath('/chat/:roomId', location.pathname);
  const isReviewPage = matchPath('/chat/:roomId/review', location.pathname);

  return (
    <div className="app-container h-full min-h-screen min-h-0">
      <ErrorHandler />
      <CustomToastContainer />
      <div className="content h-full min-h-0">
        <Routes>
          {/* 공개 라우트 - 로그인하지 않아도 접근 가능 */}
          <Route path="/login" element={<Login />} />
          <Route path="/oauth" element={<KaKaoOauth />} />
          {/* 에러 페이지 라우트 */}
          <Route
            path="/error/system"
            element={<ErrorState type={'server-error'} bgHeight="min-h-screen" />}
          />
          <Route
            path="/error/not-found"
            element={<ErrorState type={'not-found'} bgHeight="min-h-screen" />}
          />
          {/* 보호된 라우트 - 로그인해야만 접근 가능 */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Routes>
                  <Route path="/notifications" element={<NotificationPage />} />
                  <Route path="/setting-location" element={<LocationSetting />} />
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
                  <Route path="/bookshelf/add/isbn" element={<AddByBarcodePage />} />
                  <Route path="/bookshelf/add/isbn-scan-result" element={<AddISBNResultPage />} />
                  {/* ISBN결과 페이지 */}
                  <Route path="/bookshelf/add/isbn-result/:isbn" element={<ISBNScanResultPage />} />
                  <Route
                    path="/bookshelf/add/searchdetail/:id"
                    element={<SearchBookDetailPage />}
                  />

                  {/* 📚 매칭 페이지 */}
                  <Route path="/matching" element={<MatchingPage />}>
                    <Route index element={<MatchingRecommend />} />
                    <Route path="wish-books" element={<WishBooks />} />
                  </Route>
                  <Route
                    path="/matching/neigbors-bookshelf/:userId"
                    element={<NeighborBookshelfPage />}
                  />
                  <Route path="/matching/search-wish-books" element={<SearchWishBooks />}>
                    <Route index element={<RecommandedWishBookList />} />
                    <Route path="result" element={<SearchResultBookList />} />
                  </Route>

                  <Route path="/matching/books/:id" element={<WishBooksDetailPage />} />

                  {/* 채팅 페이지 */}
                  <Route path="/chat" element={<ChatListPage />} />
                  <Route path="/chat/:roomId" element={<ChatRoomPage />} />
                  <Route path="/chat/:roomId/review" element={<TradeReviewPage />} />
                  <Route path="/exchange/completed" element={<TradeCompletedPage />} />

                  {/* 독서기록 페이지 - 탭이 있는 부분은 중첩 라우팅 적용용 */}
                  <Route path="/booknotes" element={<BookNotePage />}>
                    <Route index element={<MyBookNotesPage />} />
                    <Route path="/booknotes/trip" element={<BookTripPage />} />
                  </Route>

                  <Route path="/booknotes/full/:bookId" element={<BookNoteFullPage />} />
                  <Route path="/booknotes/edit/:bookId" element={<BookNoteEditPage />} />
                  <Route path="/booknotes/create" element={<BookNoteCreatePage />} />
                  <Route path="/booknotes/select" element={<BookNoteSelectPage />} />
                  <Route path="/booknotes/quote-galaxy" element={<QuoteGalaxyPage />} />

                  {/* 책의 여정 페이지 */}
                  <Route
                    path="/booknotes/trip/:bookId"
                    element={<BookTripDetailPage key={location.key} />}
                  />
                  <Route path="/booknotes/trip-map" element={<BookTripMapPage />} />

                  {/* ✅ 마이페이지 라우팅 (공통 레이아웃) */}
                  <Route path="/mypage" element={<MyPage />}>
                    <Route index element={<TradeHistoryList />} />
                    <Route path="promises" element={<TradePromiseList />} />
                  </Route>

                  {/* ✅ 독립적인 프로필 수정 페이지 (레이아웃 없음) */}
                  <Route path="/mypage/edit" element={<EditProfilePage />} />

                  {/* 그 외 경로는 404 not found 에러 처리 컴포넌트 보여주기 */}
                  <Route
                    path="*"
                    element={<ErrorState type={'not-found'} bgHeight="min-h-screen" />}
                  />
                </Routes>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>

      {/* 하단 탭 바 (로그인된 경우에만 표시) */}
      {!(isLoading || isChatRoom || isReviewPage) && <BottomTabBar onTabChange={handleTabChange} />}
    </div>
  );
};

export default AppLayout;
