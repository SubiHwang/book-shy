// src/components/mylibrary/StatsCard.tsx
import React from 'react';
import { StatsCardProps } from '@/types/mylibrary/components';

const StatsCard: React.FC<StatsCardProps> = ({
  totalBooks = 98,
  rank = 1,
  achievement = '축하합니다! 현재까지 건물 1층 높이 만큼 독서를 했어요!',
}) => {
  return (
    <div className="bg-primary-light rounded-xl p-4 mb-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start">
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 font-semibold text-base mb-1">
            지금까지 {totalBooks}권을 읽었어요.
          </p>
          <p className="text-gray-600 text-sm">{achievement}</p>
        </div>
        {/* 책 이미지 */}
        <img
          src="/images/book-stack.png"
          alt="책 이미지"
          className="w-14 h-14 ml-4 flex-shrink-0"
        />
      </div>
    </div>
  );
};

export default StatsCard;
