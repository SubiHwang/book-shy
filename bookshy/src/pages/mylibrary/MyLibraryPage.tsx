// src/pages/MyLibrary/MyLibraryPage.tsx
import React, { useState } from 'react';
import Header from '@/components/common/Header';
import StatsCard from '@/components/MyLibrary/BookShelf/StatsCard';
import AddBookDialog from '@/components/MyLibrary/BookAdd/AddBookDialog';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import TabNavBar from '@/components/common/TabNavBar';

const MyLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 탭 페이지 설정
  const pages = [
    { path: '/bookshelf/all-my-books', label: '내 전체 서재' },
    { path: '/bookshelf/public-my-books', label: '내 공개 서재' },
  ];

  // 현재 활성화된 탭 결정
  const currentPath = location.pathname;
  const isPublicTab = currentPath.includes('public-my-books');

  const [userRank, setUserRank] = useState<number>(1);
  const [achievement, setAchievement] = useState<string>('전체 1등 독서 왕이 되었어요!');

  // 다이얼로그 상태 관리
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // 다이얼로그 열기
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // 다이얼로그 닫기
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="bookshelf-container flex flex-col h-screen bg-light-bg">
      {/* Header 컴포넌트 적용 */}
      <Header
        title="내 서재"
        onBackClick={() => navigate(-1)}
        showBackButton={false}
        showNotification={true}
        extraButton={null}
        extraButtonIcon={null}
        onExtraButtonClick={() => {}}
        className="bg-light-bg shadow-md"
      />

      {/* 스크롤 영역 */}
      <div className="pb-16 bg-light-bg flex-1">
        <div className="max-w-screen-md mx-auto px-4 py-4">
          {/* 통계 카드 */}
          <StatsCard
            totalBooks={0} // 이 값은 자식 컴포넌트에서 업데이트
            rank={userRank}
            achievement={achievement}
          />

          {/* 탭 네비게이션 */}
          <TabNavBar pages={pages} />

          {/* 중첩 라우트 컨텐츠 */}
          <div className="tab-content mt-4">
            <Outlet />
          </div>
        </div>

        {/* 책 추가 플로팅 액션 버튼*/}
        <div className="fixed bottom-28 right-5 md:right-10">
          <button
            className="bg-primary hover:bg-primary-dark text-light-text-inverted rounded-full p-3 shadow-lg transition-colors"
            onClick={openDialog}
          >
            <img src="/icons/camera-upload.svg" alt="카메라 업로드" className="w-10 h-10" />
          </button>
        </div>

        {/* 책 추가 다이얼로그 */}
        <AddBookDialog isOpen={isDialogOpen} onClose={closeDialog} />
      </div>
    </div>
  );
};

export default MyLibraryPage;
