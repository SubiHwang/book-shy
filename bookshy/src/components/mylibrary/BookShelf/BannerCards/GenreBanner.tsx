// src/components/Mylibrary/BookShelf/BannerCards/GenreBanner.tsx
import React from 'react';
import { GenreBannerData } from '@/types/mylibrary/components';
import BannerCard from './BannerCard';

interface GenreBannerProps {
  data: GenreBannerData;
}

const GenreBanner: React.FC<GenreBannerProps> = ({ data }) => {
  const { favoriteGenre, genreDescription } = data;

  return (
    <BannerCard
      backgroundColor="bg-card-bg-green"
      accentColor="text-green-600"
      highlightedText={favoriteGenre}
      description={genreDescription || ''} // 빈 문자열을 기본값으로 추가
      iconSrc="/icons/mytype.svg"
      iconAlt="장르 유형"
      preText="당신의 선호 장르는"
      postText="!"
    />
  );
};

export default GenreBanner;
