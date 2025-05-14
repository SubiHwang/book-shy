// src/components/Mylibrary/BookShelf/BannerCards/ExchangeBanner.tsx
import React from 'react';
import { ExchangeBannerData } from '@/types/mylibrary/components';
import { getExchangeMessage } from '@/utils/exchangeUtils';
import BannerCard from './BannerCard';

interface ExchangeBannerProps {
  data: ExchangeBannerData;
}

const ExchangeBanner: React.FC<ExchangeBannerProps> = ({ data }) => {
  const { exchangeCount, peopleCount } = data;

  // 교환 메시지 생성
  const exchangeMessage = getExchangeMessage(exchangeCount, peopleCount);

  return (
    <BannerCard
      backgroundColor="bg-card-bg-blue"
      accentColor="text-blue-500"
      highlightedText={`${peopleCount}명`}
      extraHighlightedText={`${exchangeCount}권`}
      description={exchangeMessage || ''} // 빈 문자열을 기본값으로 추가
      iconSrc="/icons/exchangeimage.svg"
      iconAlt="책 교환"
      preText="총"
      midText="과"
      postText="의 책을 교환했어요."
    />
  );
};

export default ExchangeBanner;
