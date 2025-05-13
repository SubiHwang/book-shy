// src/components/Mylibrary/BookShelf/BannerCards/ExchangeBanner.tsx
import React from 'react';
import { ExchangeBannerData } from '@/types/mylibrary/components';
import { getExchangeMessage, getLastExchangeMessage } from '@/utils/exchangeUtils';
import { Repeat } from 'lucide-react';

interface ExchangeBannerProps {
  data: ExchangeBannerData;
}

const ExchangeBanner: React.FC<ExchangeBannerProps> = ({ data }) => {
  const { exchangeCount, peopleCount, lastExchangeDate } = data;

  // 교환 메시지 생성
  const exchangeMessage = getExchangeMessage(exchangeCount, peopleCount);
  const lastExchangeMessage = getLastExchangeMessage(lastExchangeDate);

  // 날짜 포맷팅
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-card-bg-blue rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center">
        <div className="flex-1 min-w-0 flex flex-col justify-center m-1">
          <p className="text-gray-800 font-semibold text-base mb-1">
            총 <span className="text-blue-500">{peopleCount}명</span>과
            <span className="text-blue-500 ml-1">{exchangeCount}권</span>의 책을 교환했어요.
          </p>
          <p className="text-gray-600 text-sm mb-4">{exchangeMessage}</p>
        </div>
        <img src="/icons/exchangeimage.svg" alt="책 이미지" className="w-21 h-21  flex-shrink-0" />
      </div>
    </div>
  );
};

export default ExchangeBanner;
