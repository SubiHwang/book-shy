// src/components/Mylibrary/BookShelf/BannerCards/BooksBanner.tsx
import React from 'react';
import { BooksBannerData } from '@/types/mylibrary/components';
import BannerCard from './BannerCard';

interface BooksBannerProps {
  data: BooksBannerData;
}

const BooksBanner: React.FC<BooksBannerProps> = ({ data }) => {
  const { totalBooks, achievement } = data;

  return (
    <BannerCard
      backgroundColor="bg-card-bg-pink"
      accentColor="text-primary"
      highlightedText={`${totalBooks}권`}
      description={achievement || ''} // 빈 문자열을 기본값으로 추가
      iconSrc="/icons/bookstats.svg"
      iconAlt="책 통계"
      preText="지금까지"
      postText="을 읽었어요."
    />
  );
};

export default BooksBanner;
