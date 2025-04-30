import React from 'react';
import { StatsCardProps } from '@/types/mylibrary/components';

const StatsCard: React.FC<StatsCardProps> = ({
  totalBooks = 98,
  achievement = '축하합니다! 현재까지 건물 1층 높이 만큼 독서를 했어요!',
}) => {
  return (
    <div className="bg-card-bg-pink rounded-xl p-4 mb-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center m-5">
        {' '}
        {/* <- 수직 가운데 정렬 핵심 */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {' '}
          {/* <- 텍스트 중앙 정렬 */}
          <p className="text-gray-800 font-semibold text-base mb-1">
            지금까지 <span className="text-primary">{totalBooks}권</span>을 읽었어요.
          </p>
          <p className="text-gray-600 text-sm">{achievement}</p>
        </div>
        {/* 책 이미지 */}
        <img src="/icons/bookstats.svg" alt="책 이미지" className="w-16 h-16 ml-4 flex-shrink-0" />
      </div>
    </div>
  );
};

export default StatsCard;
