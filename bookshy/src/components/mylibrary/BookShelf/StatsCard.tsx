// src/components/Mylibrary/BookShelf/StatsCard.tsx
import React from 'react';
import { StatsCardProps } from '@/types/mylibrary/components';
import BooksBanner from './BannerCards/BooksBanner';
import { getHeightAchievementMessage } from '@/utils/achievementUtils';

const StatsCard: React.FC<StatsCardProps> = ({ totalBooks = 0, achievement }) => {
  // 업적 메시지가 전달되지 않은 경우 자동 생성
  const actualAchievement = achievement || getHeightAchievementMessage(totalBooks);

  // BooksBanner 컴포넌트를 활용하여 렌더링
  return (
    <BooksBanner
      data={{
        totalBooks,
        achievement: actualAchievement,
      }}
    />
  );
};

export default StatsCard;
