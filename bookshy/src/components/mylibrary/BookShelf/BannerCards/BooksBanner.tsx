// src/components/Mylibrary/BookShelf/BannerCards/BooksBanner.tsx
import React from 'react';
import { BooksBannerData } from '@/types/mylibrary/components';
//import { getNextAchievement } from '@/utils/achievementUtils';

interface BooksBannerProps {
  data: BooksBannerData;
}

const BooksBanner: React.FC<BooksBannerProps> = ({ data }) => {
  const { totalBooks, achievement } = data;
  //const nextAchievement = getNextAchievement(totalBooks);

  return (
    <div className="bg-card-bg-pink rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center">
        <div className="flex-1 min-w-0 flex flex-col justify-center m-1">
          <p className="text-gray-800 font-semibold text-base mb-1 ">
            지금까지 <span className="text-primary">{totalBooks}권</span>을 읽었어요.
          </p>
          <p className="text-gray-600 text-sm mb-4">{achievement}</p>
        </div>
        <img src="/icons/bookstats.svg" alt="책 이미지" className="w-22 h-22 ml-2 flex-shrink-0" />
      </div>
    </div>
  );
};

export default BooksBanner;
