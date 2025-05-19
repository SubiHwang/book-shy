// src/components/mylibrary/BookShelf/BannerCards/GenreBanner.tsx
import React from 'react';
import { GenreBannerData } from '@/types/mylibrary/components';
import BannerCard from './BannerCard';
// 메시지 유틸리티 함수 import
import { extractEmoji, getDefaultGenreMessage } from '@/utils/library/messageUtils';
// 한국어 조사 처리 유틸리티 import
import { getParticle } from '@/utils/library/koreanUtils';

interface GenreBannerProps {
  data: GenreBannerData;
}

const GenreBanner: React.FC<GenreBannerProps> = ({ data }) => {
  const { favoriteGenre, genreDescription } = data;

  // 이모지와 나머지 텍스트 분리
  const emoji = extractEmoji(genreDescription);
  const descriptionText = genreDescription.replace(emoji, '').trim();

  return (
    <BannerCard
      backgroundColor="bg-card-bg-green"
      accentColor="text-green-600"
      highlightedText={favoriteGenre}
      description={descriptionText || getDefaultGenreMessage(favoriteGenre)}
      iconSrc="/icons/mytype.svg"
      iconAlt="장르 유형"
      preText="당신의 선호 장르는"
      postText={getParticle(favoriteGenre, '이네요!', '예요!')}
      descriptionPrefix={emoji}
    />
  );
};

export default GenreBanner;
