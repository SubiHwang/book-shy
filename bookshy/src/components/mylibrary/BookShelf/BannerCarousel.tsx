// src/components/Mylibrary/BookShelf/BannerCarousel.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AllBannersData } from '@/types/mylibrary/components';
import BooksBanner from './BannerCards/BooksBanner';
import ExchangeBanner from './BannerCards/ExchangeBanner';
import GenreBanner from './BannerCards/GenreBanner';

interface BannerCarouselProps {
  data: AllBannersData | null;
  isLoading: boolean;
  error: string | null;
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ data, isLoading, error }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // 이전 배너로 이동
  const prevBanner = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? (data ? 3 - 1 : 0) : current - 1));
  }, [data]);

  // 다음 배너로 이동
  const nextBanner = useCallback(() => {
    setActiveIndex((current) => (current === (data ? 3 - 1 : 0) ? 0 : current + 1));
  }, [data]);

  // 인디케이터 클릭 핸들러
  const goToBanner = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 50) {
      // 왼쪽으로 스와이프 (다음)
      nextBanner();
    }

    if (touchStart - touchEnd < -50) {
      // 오른쪽으로 스와이프 (이전)
      prevBanner();
    }
  }, [touchStart, touchEnd, nextBanner, prevBanner]);

  // 자동 슬라이드
  useEffect(() => {
    if (!data) return; // 데이터가 없으면 실행하지 않음

    const interval = setInterval(() => {
      nextBanner();
    }, 4000); // 5초마다 슬라이드

    return () => clearInterval(interval);
  }, [nextBanner, data]);

  // 로딩 및 에러 처리
  if (isLoading) {
    return (
      <div className="bg-card-bg-pink rounded-xl p-8 mb-5 shadow-sm flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 rounded-xl p-6 mb-5 shadow-sm">
        <p className="text-red-600 text-center">{error}</p>
        <p className="text-red-500 text-sm text-center mt-1">새로고침 후 다시 시도해주세요.</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // 배너 컴포넌트 배열
  const banners = [
    { id: 'books', component: <BooksBanner data={data.booksData} /> },
    { id: 'exchange', component: <ExchangeBanner data={data.exchangeData} /> },
    { id: 'genre', component: <GenreBanner data={data.genreData} /> },
  ];

  // 인디케이터 색상 설정
  const getIndicatorColors = (index: number) => {
    // 배너 타입에 따른 색상 설정
    switch (index) {
      case 0: // BooksBanner
        return { active: 'bg-primary', inactive: 'bg-primary bg-opacity-30' };
      case 1: // ExchangeBanner
        return { active: 'bg-blue-500', inactive: 'bg-blue-500 bg-opacity-30' };
      case 2: // GenreBanner
        return { active: 'bg-green-600', inactive: 'bg-green-600 bg-opacity-30' };
      default:
        return { active: 'bg-primary', inactive: 'bg-gray-300' };
    }
  };

  const indicatorColors = getIndicatorColors(activeIndex);

  return (
    <div className="relative mb-1">
      {/* 배너 컨테이너 */}
      <div
        ref={carouselRef}
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 현재 활성화된 배너 */}
        <div className="transition-all duration-300 ease-in-out relative">
          {banners[activeIndex].component}

          {/* 인디케이터를 배너 내부 하단에 위치시킴 */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                className={`w-2 h-2 mx-1 rounded-full ${
                  index === activeIndex ? indicatorColors.active : indicatorColors.inactive
                }`}
                onClick={() => goToBanner(index)}
                aria-label={`${index + 1}번 배너`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
