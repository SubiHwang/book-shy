// src/components/mylibrary/BookShelf/BannerCards/ExchangeBanner.tsx
import React from 'react';
import { ExchangeBannerData } from '@/types/mylibrary/components';
import BannerCard from './BannerCard';
import { getParticle } from '@/utils/library/koreanUtils'; // 받침에 따른 조사 처리를 위해 추가

interface ExchangeBannerProps {
  data: ExchangeBannerData;
}

const ExchangeBanner: React.FC<ExchangeBannerProps> = ({ data }) => {
  const { peopleCount, bookCount } = data;

  // 교환 통계에 따른 메시지 생성
  const getExchangeDescription = (): string => {
    if (bookCount <= 0) {
      return '첫 교환을 시작해보세요! 새로운 만남이 기다리고 있어요.';
    } else if (peopleCount <= 0) {
      return `지금까지 ${bookCount}권${getParticle(String(bookCount), '을', '를')} 교환했어요!`;
    } else {
      return `지금까지 ${peopleCount}명의 사람들과\n${bookCount}권의 책을 나누었어요!`;
    }
  };

  // 통계에 따른 이모지 선택
  const getExchangeEmoji = (): string => {
    if (bookCount <= 0) {
      return '🤝';
    } else if (bookCount < 5) {
      return '📚';
    } else if (bookCount < 10) {
      return '🔄';
    } else {
      return '🌟';
    }
  };

  const exchangeDescription = getExchangeDescription();
  const exchangeEmoji = getExchangeEmoji();

  return (
    <BannerCard
      backgroundColor="bg-card-bg-blue"
      accentColor="text-blue-600"
      highlightedText={`${bookCount}권`}
      description={exchangeDescription}
      iconSrc="/icons/exchange.svg"
      iconAlt="교환 통계"
      preText="지금까지"
      postText={getParticle(String(bookCount), '을', '를')} // 받침에 따라 "을" 또는 "를" 선택
      descriptionPrefix={exchangeEmoji}
    />
  );
};

export default ExchangeBanner;
