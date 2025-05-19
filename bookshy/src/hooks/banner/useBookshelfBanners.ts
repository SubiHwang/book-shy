// src/hooks/banner/useBookshelfBanners.ts
import { useState, useEffect } from 'react';
import { AllBannersData } from '@/types/mylibrary/components';
import { fetchFavoriteCategory } from '@/services/mylibrary/bannersService';
// 다른 필요한 API 함수들도 import

export const useBookshelfBanners = (userId: number) => {
  const [data, setData] = useState<AllBannersData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setIsLoading(true);

        // 선호 카테고리 데이터 가져오기
        const categoryData = await fetchFavoriteCategory(userId);

        // 응답에서 필요한 데이터 추출하여 genreData 형식에 맞게 변환
        const genreData = {
          favoriteGenre: categoryData.favoriteCategory,
          genreDescription: categoryData.message,
        };

        // 다른 배너 데이터도 같은 방식으로 가져옵니다
        // const booksData = ...

        // Exchange 관련 데이터는 주석 처리하고 빈 객체로 대체
        // ExchangeBannerData 타입에 맞는 임시 데이터 객체 생성
        // const exchangeData = { ... };

        // 모든 배너 데이터 설정 (Exchange 데이터 제외)
        setData({
          genreData,
          booksData: { totalBooks: 0, achievement: '' }, // 임시 데이터 또는 실제 데이터로 교체

          // Exchange 관련 데이터는 임시로 빈 객체로 설정
          // TypeScript에게 타입 오류를 무시하도록 as any 사용
          exchangeData: {} as any,
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchBannerData();
    }
  }, [userId]);

  return { data, isLoading, error };
};
