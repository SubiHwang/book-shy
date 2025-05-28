// src/services/mylibrary/bannersService.ts
import { authAxiosInstance } from '@/services/axiosInstance';
import { getDefaultReadingMessage, getDefaultGenreMessage } from '@/utils/library/messageUtils';

// 선호 카테고리 데이터 타입
export interface FavoriteCategoryData {
  favoriteCategory: string;
  message: string;
}

// 독서량 환산 데이터 타입
export interface ReadingLevelData {
  readCount: number;
  height: string;
  stageMessage: string;
}

// 선호 카테고리 조회 함수
export const fetchFavoriteCategory = async (userId: number): Promise<FavoriteCategoryData> => {
  try {
    console.log('선호 카테고리 조회 요청:', { userId });

    const url = `/stats/favorite-category?userId=${userId}`;
    console.log('API 요청 URL:', url);

    // GET 요청 전송
    // authAxiosInstance는 이미 response.data.data를 반환하므로, 타입 단언을 사용합니다
    const response = await authAxiosInstance.get(url);

    // 응답을 FavoriteCategoryData 타입으로 캐스팅
    const categoryData = response as unknown as FavoriteCategoryData;

    console.log('선호 카테고리 조회 성공:', categoryData);

    return categoryData;
  } catch (error) {
    console.error('선호 카테고리 조회 오류:', error);

    // 오류 발생 시 기본 데이터 반환
    return {
      favoriteCategory: '정보 없음',
      message: getDefaultGenreMessage(),
    };
  }
};

// 독서량 환산 조회 함수
export const fetchReadingLevel = async (userId: number): Promise<ReadingLevelData> => {
  try {
    console.log('독서량 환산 조회 요청:', { userId });

    const url = `/stats/reading-level?userId=${userId}`;
    console.log('API 요청 URL:', url);

    // GET 요청 전송
    const response = await authAxiosInstance.get(url);

    // 응답을 ReadingLevelData 타입으로 캐스팅
    const readingLevelData = response as unknown as ReadingLevelData;

    console.log('독서량 환산 조회 성공:', readingLevelData);

    return readingLevelData;
  } catch (error) {
    console.error('독서량 환산 조회 오류:', error);

    // 오류 발생 시 기본 데이터 반환 - 유틸리티 함수 사용
    return {
      readCount: 0,
      height: '0cm',
      stageMessage: getDefaultReadingMessage(0),
    };
  }
};

export interface ExchangeSummaryData {
  peopleCount: number;
  bookCount: number;
}

// 교환 통계 조회 함수
export const fetchExchangeSummary = async (): Promise<ExchangeSummaryData> => {
  try {
    console.log('교환 통계 조회 요청');

    const url = `/trades/summary`;
    console.log('API 요청 URL:', url);

    // GET 요청 전송
    const response = await authAxiosInstance.get(url);

    // 응답을 ExchangeSummaryData 타입으로 캐스팅
    const summaryData = response as unknown as ExchangeSummaryData;

    console.log('교환 통계 조회 성공:', summaryData);

    // API 응답을 그대로 반환
    return summaryData;
  } catch (error) {
    console.error('교환 통계 조회 오류:', error);

    // 오류 발생 시 기본 데이터 반환
    return {
      peopleCount: 0,
      bookCount: 0,
    };
  }
};
