// src/pages/mylibrary/MyLibraryPage.tsx
import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import BannerCarousel from '@/components/mylibrary/BookShelf/BannerCarousel';
import AddBookDialog from '@/components/mylibrary/BookAdd/AddBookDialog';
import { useNavigate, Outlet } from 'react-router-dom';
import TabNavBar from '@/components/common/TabNavBar';
import { AllBannersData } from '@/types/mylibrary/components';
import {
  fetchFavoriteCategory,
  fetchReadingLevel,
  fetchExchangeSummary,
} from '@/services/mylibrary/bannersService';
import { getUserIdFromToken } from '@/utils/jwt';
import { getDefaultReadingMessage, getDefaultGenreMessage } from '@/utils/library/messageUtils';

const MyLibraryPage: React.FC = () => {
  const navigate = useNavigate();

  // JWT 토큰에서 사용자 ID 가져오기
  const userId = getUserIdFromToken() || 0;
  console.log('JWT 토큰에서 가져온 사용자 ID:', userId);

  const pages = [
    { path: '/bookshelf', label: '내 전체 서재' },
    { path: '/bookshelf/public-my-books', label: '내 공개 서재' },
  ];

  const [bannerData, setBannerData] = useState<AllBannersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchBannerData = async () => {
      console.log('배너 데이터 가져오기 시작...');

      try {
        setIsLoading(true);
        console.log('로딩 상태 설정: true');

        // 병렬로 모든 API 호출하기
        console.log('API 호출 시작: 카테고리, 독서량, 교환 통계 데이터, userId =', userId);

        // Promise.all로 여러 API 동시 호출
        const [categoryData, readingLevelData, exchangeData] = await Promise.all([
          fetchFavoriteCategory(userId),
          fetchReadingLevel(userId),
          fetchExchangeSummary(), // 교환 통계 API 추가
        ]);

        console.log('API 응답 (카테고리 데이터):', categoryData);
        console.log('API 응답 (독서량 데이터):', readingLevelData);
        console.log('API 응답 (교환 통계 데이터):', exchangeData);

        // 배너 데이터 설정
        const newBannerData = {
          booksData: {
            totalBooks: readingLevelData.readCount,
            achievement: readingLevelData.stageMessage,
          },
          genreData: {
            favoriteGenre: categoryData.favoriteCategory,
            genreDescription: categoryData.message,
          },
          exchangeData: {
            peopleCount: exchangeData.peopleCount,
            bookCount: exchangeData.bookCount, // API에서 받은 이름 그대로 사용
          },
        };

        console.log('새 배너 데이터 구성:', newBannerData);
        setBannerData(newBannerData);
        console.log('배너 데이터 상태 업데이트 완료');
      } catch (err) {
        console.error('배너 데이터 가져오기 오류 세부 정보:', err);
        if (err instanceof Error) {
          console.error('오류 메시지:', err.message);
          console.error('오류 스택:', err.stack);
        }

        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.log('오류 상태 설정:', '데이터를 불러오는 중 오류가 발생했습니다.');

        // 기본 데이터 설정 - 유틸리티 함수 사용
        const fallbackData = {
          booksData: {
            totalBooks: 0,
            achievement: getDefaultReadingMessage(0),
          },
          genreData: {
            favoriteGenre: '정보 없음',
            genreDescription: getDefaultGenreMessage(),
          },
          exchangeData: {
            peopleCount: 0,
            bookCount: 0, // 기존의 exchangeCount 대신 bookCount 사용
          },
        };

        console.log('폴백 배너 데이터 설정:', fallbackData);
        setBannerData(fallbackData);
      } finally {
        setIsLoading(false);
        console.log('로딩 상태 설정: false (완료)');
      }
    };

    console.log('useEffect 실행, userId =', userId);
    if (userId) {
      console.log('userId가 유효하므로 배너 데이터 가져오기 함수 호출');
      fetchBannerData();
    } else {
      console.log('userId가 없거나 0이므로 배너 데이터를 가져오지 않음');
      setIsLoading(false);
    }
  }, [userId]);

  const toggleDialog = (isOpen: boolean) => setIsDialogOpen(isOpen);

  return (
    <div className="bookshelf-container flex flex-col h-screen bg-light-bg">
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

      <div className="pb-16 bg-light-bg flex-1">
        <div className="max-w-screen-md mx-auto px-4 py-4">
          <BannerCarousel data={bannerData} isLoading={isLoading} error={error} />

          <div className="bg-white rounded-xl shadow-md mt-4 pt-3 px-4 min-h-screen">
            <TabNavBar pages={pages} />

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

        <AddBookDialog isOpen={isDialogOpen} onClose={() => toggleDialog(false)} />
      </div>
    </div>
  );
};

export default MyLibraryPage;
