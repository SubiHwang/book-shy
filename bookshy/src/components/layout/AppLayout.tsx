import { FC } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import BottomTabBar from '../common/BottomTabBar';
import MyLibraryPage from '../../pages/mylibrary/MyLibraryPage';
import MatchingPage from '@/pages/matching/MatchingPage';
import BookSearchPage from '@/pages/mylibrary/BookSearchPage';
import SelfBookEntryPage from '@/pages/mylibrary/SelfBookEntryPage';

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
          <Route path="/bookshelf" element={<MyLibraryPage />} />
          <Route path="/matching" element={<MatchingPage />} />
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
