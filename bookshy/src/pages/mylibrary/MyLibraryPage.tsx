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
  // const location = useLocation();

  // 탭 페이지 설정
  const pages = [
    { path: '/bookshelf', label: '내 전체 서재' },
    { path: '/bookshelf/public-my-books', label: '내 공개 서재' },
  ];

  // 현재 활성화된 탭 결정
  // const currentPath = location.pathname;

  // 배너 데이터 상태
  const [bannerData, setBannerData] = useState<AllBannersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 더미 데이터 생성 함수
  const generateDummyBannerData = (): AllBannersData => {
    // 테스트용 더미 데이터
    const totalBooks = 33; // 테스트용 고정값

    // 책 배너 데이터
    const booksData = {
      totalBooks,
      achievement: getHeightAchievementMessage(totalBooks),
    };

    // 교환 배너 데이터
    const exchangeData = {
      exchangeCount: 12,
      peopleCount: 5,
      lastExchangeDate: '2023-05-15',
    };

    // 장르 배너 데이터
    const genreData = {
      favoriteGenre: '소설',
      genreDescription: '이야기 속에서 다양한 감정과 인생을 경험하는 것을 즐기시는군요!',
      matchingRate: 85,
    };

    return {
      booksData,
      exchangeData,
      genreData,
    };
  };

  // 데이터 초기화 (컴포넌트 마운트시 한 번만 실행)
  useEffect(() => {
    // 로딩 상태 시뮬레이션
    setIsLoading(true);

    // 1초 후에 더미 데이터 설정 (API 호출 지연 시뮬레이션)
    const timer = setTimeout(() => {
      try {
        const dummyData = generateDummyBannerData();
        setBannerData(dummyData);
        setIsLoading(false);
      } catch (err) {
        console.error('더미 데이터 생성 중 오류 발생:', err);
        setError('데이터를 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    }, 1000);

    // 타이머 정리
    return () => clearTimeout(timer);
  }, []);

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
          {/* 배너 캐로셀 */}
          <BannerCarousel data={bannerData} isLoading={isLoading} error={error} />

          {/* 탭 네비게이션 */}
          <TabNavBar pages={pages} />

          {/* 중첩 라우트 컨텐츠 */}
          <div className="tab-content mt-4">
            <Outlet />
          </div>
        </div>

        {/* 책 추가 플로팅 액션 버튼*/}
        <div className="fixed bottom-24 right-6">
          <button
            className="w-14 h-14 rounded-xl bg-primary text-white flex justify-center items-center shadow-lg"
            onClick={openDialog}
          >
            <img src="/icons/camera-upload.svg" alt="카메라 업로드" className="mt-1 w-10 h-10" />
          </button>
        </div>

        {/* 책 추가 다이얼로그 */}
        <AddBookDialog isOpen={isDialogOpen} onClose={closeDialog} />
      </div>
    </div>
  );
};

export default MyLibraryPage;
