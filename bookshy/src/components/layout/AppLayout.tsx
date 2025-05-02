import { FC } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import BottomTabBar from '../common/BottomTabBar';
import MatchingPage from '@/pages/matching/MatchingPage';
import MatchingRecommend from '@/pages/matching/MatchingRecommend';

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
          <Route path="/bookshelf" element={<div>내 서재</div>} />
          <Route path="/matching" element={<MatchingPage />}>
            <Route index element={<MatchingRecommend />} />
            <Route path="matching-recommendations" element={<MatchingRecommend />} />
            <Route path="wish-books" element={<div>읽고 싶은 책</div>} />
          </Route>
          <Route path="/chat" element={<div>채팅</div>} />
          <Route path="/booknote" element={<div>독서 기록</div>} />
          <Route path="/mypage" element={<div>마이</div>} />
        </Routes>
      </div>
      <BottomTabBar onTabChange={handleTabChange} />
    </div>
  );
};

export default AppLayout;
