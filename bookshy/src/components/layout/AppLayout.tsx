import { FC, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import BottomTabBar from '../common/BottomTabBar';
import MyLibraryPage from '../../pages/mylibrary/MyLibraryPage';

const AppLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('bookshelf');

  // 현재 경로에 맞게 activeTab 상태 업데이트
  useEffect(() => {
    const path = location.pathname.substring(1); // '/' 제거
    if (path === '') {
      setActiveTab('bookshelf');
    } else if (['bookshelf', 'matching', 'chat', 'booknote', 'mypage'].includes(path)) {
      setActiveTab(path);
    }
  }, [location.pathname]);

  // 탭 변경 시 해당 경로로 이동
  const handleTabChange = (tabId: string): void => {
    navigate(`/${tabId}`);
  };

  return (
    <div className="app-container pb-16">
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/bookshelf" replace />} />
          <Route path="/bookshelf" element={<MyLibraryPage />} />
          <Route path="/matching" element={<div>매칭 추천</div>} />
          <Route path="/chat" element={<div>채팅</div>} />
          <Route path="/booknote" element={<div>독서 기록</div>} />
          <Route path="/mypage" element={<div>마이</div>} />
        </Routes>
      </div>
      <BottomTabBar defaultActiveTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default AppLayout;
