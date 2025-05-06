// src/components/Mylibrary/BookShelf/BannerCards/GenreBanner.tsx
import React from 'react';
import { GenreBannerData } from '@/types/mylibrary/components';
import { getMatchingRateMessage } from '@/utils/genreUtils';
import { BookOpen } from 'lucide-react';

interface GenreBannerProps {
  data: GenreBannerData;
}

const GenreBanner: React.FC<GenreBannerProps> = ({ data }) => {
  const { favoriteGenre, genreDescription, matchingRate } = data;

  // 매칭률 메시지 생성
  const matchingRateMessage = getMatchingRateMessage(matchingRate);

  return (
    <div className="bg-card-bg-green rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center m-4">
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-gray-800 font-semibold text-base mb-1">
            당신의 선호 장르는 <span className="text-green-600">{favoriteGenre}</span>
          </p>
          <p className="text-gray-600 text-sm mb-1">{genreDescription}</p>
          <div className="flex items-center mt-1">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${matchingRate}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 ml-2">{matchingRate}%</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{matchingRateMessage}</p>
        </div>
        <div className="w-16 h-16 ml-4 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center">
          <BookOpen size={32} className="text-green-600" />
        </div>
      </div>
    </div>
  );
};

export default GenreBanner;
