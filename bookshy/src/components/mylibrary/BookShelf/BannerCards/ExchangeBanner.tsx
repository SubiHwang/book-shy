// src/components/mylibrary/BookShelf/BannerCards/ExchangeBanner.tsx
import React from 'react';
import { ExchangeBannerData } from '@/types/mylibrary/components';
import BannerCard from './BannerCard';
import { getParticle } from '@/utils/library/koreanUtils'; // 받침에 따른 조사 처리 함수

interface ExchangeBannerProps {
  data: ExchangeBannerData;
}

const ExchangeBanner: React.FC<ExchangeBannerProps> = ({ data }) => {
  const { peopleCount, bookCount } = data;

  // 교환 통계에 따른 호칭 부여
  const getExchangeTitle = (): string => {
    if (bookCount <= 0) {
      return '🤝 첫 만남을 기다리는 독서인';
    } else if (bookCount < 5) {
      return '📚 교환을 시작한 독서인';
    } else if (bookCount < 10) {
      return '🔄 활발한 교환 독서인';
    } else if (bookCount < 20) {
      return '🌟 열정적인 교환 애호가';
    } else {
      return '👑 독서 교환 마스터';
    }
  };

  // 교환 통계에 따른 메시지 생성 (2,3줄)
  const getExchangeDescription = (): string => {
    if (bookCount <= 0) {
      return '첫 교환을 시작해보세요!\n새로운 만남이 기다리고 있어요.';
    } else {
      const peopleLine =
        peopleCount > 0 ? `지금까지 ${peopleCount}명의 사람들과` : '지금까지 책 교환을 통해';

      const bookLine = `${bookCount}권의 책을 나누었어요!`;

      return `${peopleLine}\n${bookLine}`;
    }
  };

  // 호칭과 메시지 생성
  const exchangeTitle = getExchangeTitle();
  const exchangeDescription = getExchangeDescription();

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
      descriptionPrefix={exchangeTitle} // 첫 줄에 호칭 표시
    />
  );
};

export default ExchangeBanner;
