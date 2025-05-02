import { FC } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import BottomTabBar from '../common/BottomTabBar';
import MyLibraryPage from '../../pages/mylibrary/MyLibraryPage';
import MatchingPage from '@/pages/matching/MatchingPage';
import BookSearchPage from '@/pages/mylibrary/BookSearchPage';
import SelfBookEntryPage from '@/pages/mylibrary/SelfBookEntryPage';
import AllMyBooksTab from '@/pages/mylibrary/tabs/AllBooksTab';
import PublicMyBooksTab from '@/pages/mylibrary/tabs/PublicBooksTab';

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
          <Route path="/bookshelf" element={<MyLibraryPage />}>
            <Route index element={<Navigate to="/bookshelf/all-my-books" replace />} />
            <Route path="all-my-books" element={<AllMyBooksTab />} />
            <Route path="public-my-books" element={<PublicMyBooksTab />} />
          </Route>
          <Route path="/matching" element={<MatchingPage />}>
            <Route index element={<div>매칭 추천</div>} />
            <Route path="matching-recommendations" element={<div>매칭된 책</div>} />
            <Route path="wish-books" element={<div>읽고 싶은 책</div>} />
          </Route>
          <Route path="/chat" element={<div>채팅</div>} />
          <Route path="/booknote" element={<div>독서 기록</div>} />
          <Route path="/mypage" element={<div>마이</div>} />

          <Route path="/bookshelf/add-by-search" element={<BookSearchPage />} />
          <Route path="/bookshelf/self-book-entry" element={<SelfBookEntryPage />} />
          {/* <Route path="/my-library/add-by-title" element={<AddByTitlePage />} />
          <Route path="/my-library/add-by-isbn" element={<AddByISBNPage />} /> */}
        </Routes>
      </div>
      <BottomTabBar onTabChange={handleTabChange} />
    </div>
  );
};

export default AppLayout;
