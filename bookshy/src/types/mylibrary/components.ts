// src/types/mylibrary/components.ts

// 책 읽은 수 배너 데이터
export interface BooksBannerData {
  totalBooks: number;
  achievement?: string;
}

export interface ExchangeBannerData {
  peopleCount: number;
  bookCount: number;
}

export interface GenreBannerData {
  favoriteGenre: string;
  genreDescription: string;
}

export interface AllBannersData {
  booksData: BooksBannerData;
  exchangeData: ExchangeBannerData;
  genreData: GenreBannerData;
}

// 배너 카드 프롭스
export interface BannerCardProps {
  type: 'books' | 'exchange' | 'genre';
  data: BooksBannerData | ExchangeBannerData | GenreBannerData;
  className?: string;
}

// 배너 캐로셀 프롭스
export interface BannerCarouselProps {
  data: AllBannersData;
  isLoading: boolean;
  error: string | null;
}

// 기존 StatsCard 프롭스 (이전 코드와의 호환성)
export interface StatsCardProps {
  totalBooks: number;
  achievement?: string;
}
