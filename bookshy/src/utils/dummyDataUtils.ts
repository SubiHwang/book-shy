// src/utils/dummyDataUtils.ts
import {
  BooksBannerData,
  ExchangeBannerData,
  GenreBannerData,
  AllBannersData,
} from '@/types/mylibrary/components';
import { getHeightAchievementMessage } from './achievementUtils';
import { getGenreDescription } from './genreUtils';

/**
 * 책 배너를 위한 더미 데이터
 * @param totalBooks 총 읽은 책 수 (기본값: 랜덤 0~200)
 * @returns 책 배너 더미 데이터
 */
export const getBooksBannerDummyData = (
  totalBooks = Math.floor(Math.random() * 200),
): BooksBannerData => {
  return {
    totalBooks,
    achievement: getHeightAchievementMessage(totalBooks),
  };
};

/**
 * 책 교환 배너를 위한 더미 데이터
 * @returns 책 교환 배너 더미 데이터
 */
export const getExchangeBannerDummyData = (): ExchangeBannerData => {
  // 랜덤 데이터 생성
  const exchangeCount = Math.floor(Math.random() * 30);
  const peopleCount = Math.max(1, Math.floor(exchangeCount / 2)); // 평균적으로 한 사람당 2번 교환한다고 가정

  // 최근 6개월 내 랜덤 날짜 생성
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);
  const randomTimestamp =
    sixMonthsAgo.getTime() + Math.random() * (today.getTime() - sixMonthsAgo.getTime());
  const randomDate = new Date(randomTimestamp);

  return {
    exchangeCount,
    peopleCount,
    lastExchangeDate: randomDate.toISOString().split('T')[0], // YYYY-MM-DD 형식
  };
};

/**
 * 장르 배너를 위한 더미 데이터
 * @returns 장르 배너 더미 데이터
 */
export const getGenreBannerDummyData = (): GenreBannerData => {
  // 장르 목록
  const genres = [
    '소설',
    '자기계발',
    '역사',
    '과학',
    '경제/경영',
    '인문학',
    '예술',
    '종교',
    '건강',
    '취미',
  ];

  // 랜덤으로 하나 선택
  const randomIndex = Math.floor(Math.random() * genres.length);
  const selectedGenre = genres[randomIndex];

  // 랜덤 매칭률 (30-95%)
  const matchingRate = Math.floor(Math.random() * 66) + 30;

  return {
    favoriteGenre: selectedGenre,
    genreDescription: getGenreDescription(selectedGenre),
    matchingRate,
  };
};

/**
 * 모든 배너 데이터를 포함한 통합 더미 데이터
 * @param totalBooks 총 읽은 책 수 (기본값: 랜덤)
 * @returns 모든 배너를 위한 통합 더미 데이터
 */
export const getAllBannersDummyData = (totalBooks?: number): AllBannersData => {
  return {
    booksData: getBooksBannerDummyData(totalBooks),
    exchangeData: getExchangeBannerDummyData(),
    genreData: getGenreBannerDummyData(),
  };
};
