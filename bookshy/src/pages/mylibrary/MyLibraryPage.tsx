// src/pages/MyLibrary/MyLibraryPage.tsx
import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import BannerCarousel from '@/components/mylibrary/BookShelf/BannerCarousel';
import AddBookDialog from '@/components/mylibrary/BookAdd/AddBookDialog';
import { useNavigate, Outlet } from 'react-router-dom';
import TabNavBar from '@/components/common/TabNavBar';
import { getHeightAchievementMessage } from '@/utils/achievementUtils';
import { AllBannersData } from '@/types/mylibrary/components';

const MyLibraryPage: React.FC = () => {
  const navigate = useNavigate();

  // 탭 페이지 설정
  const pages = [
    { path: '/bookshelf', label: '내 전체 서재' },
    { path: '/bookshelf/public-my-books', label: '내 공개 서재' },
  ];

  // 초기 더미 데이터 미리 생성 (컴포넌트 외부에서 한 번만 계산)
  const initialBannerData: AllBannersData = {
    booksData: {
      totalBooks: 33,
      achievement: getHeightAchievementMessage(33),
    },
    exchangeData: {
      exchangeCount: 12,
      peopleCount: 5,
      lastExchangeDate: '2023-05-15',
    },
    genreData: {
      favoriteGenre: '소설',
      genreDescription: '이야기 속에서 다양한 감정과 인생을 경험하는 것을 즐기시는군요!',
      matchingRate: 85,
    },
  };

  // 배너 데이터 상태를 초기값으로 바로 설정
  const [bannerData] = useState<AllBannersData>(initialBannerData);
  const [isLoading] = useState(false); // 기본값을 false로 설정
  const [error] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // useEffect에서 로딩 처리가 필요 없음 (이미 데이터가 준비됨)
  useEffect(() => {
    // 페이지 초기화 로직이 필요하면 여기에 추가
    // 하지만 로딩 시뮬레이션은 제거
  }, []);

  // 다이얼로그 토글 핸들러
  const toggleDialog = (isOpen: boolean) => setIsDialogOpen(isOpen);

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
          {/* 배너 캐로셀 - 이미 데이터가 있으므로 로딩 상태 없음 */}
          <BannerCarousel data={bannerData} isLoading={isLoading} error={error} />

          {/* 탭 네비게이션과 컨텐츠를 감싸는 흰색 박스 */}
          <div className="bg-white rounded-xl shadow-md mt-4 pt-3 px-4 min-h-screen">
            {/* 탭 네비게이션 */}
            <TabNavBar pages={pages} />

            {/* 중첩 라우트 컨텐츠 */}
            <div className="tab-content">
              <Outlet />
            </div>
          </div>
        </div>

        {/* 책 추가 플로팅 액션 버튼*/}
        <div className="fixed bottom-24 right-6">
          <button
            className="w-14 h-14 rounded-xl bg-primary text-white flex justify-center items-center shadow-lg"
            onClick={() => toggleDialog(true)}
          >
            <img src="/icons/camera-upload.svg" alt="카메라 업로드" className="mt-1 w-10 h-10" />
          </button>
        </div>

        {/* 책 추가 다이얼로그 */}
        <AddBookDialog isOpen={isDialogOpen} onClose={() => toggleDialog(false)} />
      </div>
    </div>
  );
};

export default MyLibraryPage;
