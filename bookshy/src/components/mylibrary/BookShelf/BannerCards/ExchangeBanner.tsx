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
      <div className="flex items-center m-4">
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-gray-800 font-semibold text-base mb-1">
            지금까지 <span className="text-blue-500">{peopleCount}명</span>과
            <span className="text-blue-500 ml-1">{exchangeCount}권</span>의 책을 교환했어요.
          </p>
          <p className="text-gray-600 text-sm mb-1">{exchangeMessage}</p>
          {lastExchangeDate && (
            <p className="text-xs text-gray-500">
              마지막 교환: {formatDate(lastExchangeDate)}{' '}
              {lastExchangeMessage && `- ${lastExchangeMessage}`}
            </p>
          )}
        </div>
        <div className="w-16 h-16 ml-4 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
          <Repeat size={32} className="text-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default ExchangeBanner;
