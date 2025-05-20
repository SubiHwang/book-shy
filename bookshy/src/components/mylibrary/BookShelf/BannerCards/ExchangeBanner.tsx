// src/components/mylibrary/BookShelf/BannerCards/ExchangeBanner.tsx
import React from 'react';
import { ExchangeBannerData } from '@/types/mylibrary/components';

interface ExchangeBannerProps {
  data: ExchangeBannerData;
}

const ExchangeBanner: React.FC<ExchangeBannerProps> = ({ data }) => {
  const { peopleCount, bookCount } = data;

  // 교환 통계에 따른 호칭과 이모지 부여
  const getTitleInfo = (): { emoji: string; title: string } => {
    let emoji = '';
    let title = '';

    if (bookCount <= 0) {
      emoji = '🤝';
      title = '교환을 기다리는 독서인';
    } else if (bookCount < 5) {
      emoji = '📚';
      title = '교환을 시작한 독서인';
    } else if (bookCount < 10) {
      emoji = '🔄';
      title = '활발한 교환 독서인';
    } else if (bookCount < 20) {
      emoji = '🌟';
      title = '열정적인 교환 애호가';
    } else {
      emoji = '👑';
      title = '독서 교환 마스터';
    }

    return { emoji, title };
  };

  // 통계 메시지 생성
  const getStatisticsMessage = (): string => {
    if (bookCount <= 0) {
      return '첫 교환을 시작해보세요!';
    } else {
      return peopleCount > 0
        ? `지금까지 ${peopleCount}명과 ${bookCount}권의 책을 교환했어요`
        : `지금까지 ${bookCount}권의 책을 교환했어요`;
    }
  };

  const { emoji, title } = getTitleInfo();
  const statisticsMessage = getStatisticsMessage();

  return (
    <div className="bg-card-bg-blue rounded-xl p-4 shadow transition-all duration-200 h-32 flex items-center relative overflow-visible">
      <div className="flex items-center w-full">
        <div className="flex-1 min-w-0 flex flex-col justify-center m-1 ml-3">
          {/* 호칭 줄 - 굵게 처리 (이모지 제외) */}
          <p className="text-gray-800 font-semibold text-base mb-1">
            당신은 <span className="text-blue-600">{title}</span>!
          </p>

          {/* 통계 정보 줄 - 이모지 포함 */}
          <p className="text-gray-600 text-sm">
            {emoji} {statisticsMessage}
          </p>
        </div>
        <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center mr-2">
          <img
            src="/icons/exchangeimage.svg"
            alt="교환 통계"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ExchangeBanner;
