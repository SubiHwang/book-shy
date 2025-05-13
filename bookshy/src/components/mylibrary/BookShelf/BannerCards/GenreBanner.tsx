// src/components/Mylibrary/BookShelf/BannerCards/GenreBanner.tsx
import React from 'react';
import { GenreBannerData } from '@/types/mylibrary/components';
import { getMatchingRateMessage } from '@/utils/genreUtils';
import { BookOpen } from 'lucide-react';

interface GenreBannerProps {
  data: GenreBannerData;
}

const GenreBanner: React.FC<GenreBannerProps> = ({ data }) => {
  const { favoriteGenre, genreDescription } = data;
  // const { favoriteGenre, genreDescription, matchingRate } = data;

  // 매칭률 메시지 생성
  // const matchingRateMessage = getMatchingRateMessage(matchingRate);

  return (
    <div className="bg-card-bg-green rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center">
        <div className="flex-1 min-w-0 flex flex-col justify-center m-1">
          <p className="text-gray-800 font-semibold text-base mb-1">
            당신의 선호 장르는 <span className="text-green-600">{favoriteGenre}</span>
          </p>
          <p className="text-gray-600 text-sm mb-4">{genreDescription}</p>
          {/* <p className="text-xs text-gray-500 mt-1">{matchingRateMessage}</p> */}
        </div>
        <img src="/icons/mytype.svg" alt="책 이미지" className="w-22 h-22 ml-2 flex-shrink-0" />
      </div>
    </div>
  );
};

export default GenreBanner;
