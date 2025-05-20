// src/components/mylibrary/BookShelf/BannerCards/ExchangeBanner.tsx
import React from 'react';
import { ExchangeBannerData } from '@/types/mylibrary/components';
import BannerCard from './BannerCard';

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
        ? `지금까지 ${peopleCount}명과 ${bookCount}권 교환했어요!`
        : `지금까지 ${bookCount}권의 책을 교환했어요!`;
    }
  };

  const { emoji, title } = getTitleInfo();
  const statisticsMessage = getStatisticsMessage();

  return (
    <BannerCard
      backgroundColor="bg-card-bg-blue"
      accentColor="text-blue-600"
      highlightedText={title}
      description={statisticsMessage}
      descriptionPrefix={emoji}
      iconSrc="/icons/exchangeimage.svg"
      iconAlt="교환 통계"
      preText="당신은 "
      postText="!"
    />
  );
};

export default ExchangeBanner;
