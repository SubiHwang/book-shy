import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTradePromises } from '@/services/mypage/trade';
import TradePromiseCard from '@/components/mypage/trade/TradePromiseCard';
import type { TradePromise } from '@/types/trade';
import Loading from '@/components/common/Loading';

const TradePromiseList: FC = () => {
  const { data, isLoading, error } = useQuery<TradePromise[], Error>({
    queryKey: ['tradePromises'],
    queryFn: fetchTradePromises,
  });

  if (isLoading) return <Loading loadingText="거래 약속 불러오는 중..." />;
  if (error || !data) return <div className="p-4 text-red-500">거래 약속 불러오기 실패</div>;

  // 거래 목록이 없는 경우 처리
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 h-[50vh]">
        <p className="text-lg mb-2">예정된 거래 약속이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="px-4 mt-4 space-y-4 pb-32">
      {data.map((item) => (
        <TradePromiseCard
          key={item.tradeId}
          tradeId={item.tradeId}
          type={item.type}
          status={item.status}
          userName={item.counterpart.nickname}
          userProfileUrl={item.counterpart.profileImageUrl}
          myBookTitle={item.myBookTitle}
          myBookCoverUrl={item.myBookCoverUrl}
          partnerBookTitle={item.partnerBookTitle}
          partnerBookCoverUrl={item.partnerBookCoverUrl}
          statusText={item.timeLeft.display}
          meetTime={new Date(item.scheduledTime).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
          timeLeft={item.timeLeft}
        />
      ))}
    </div>
  );
};

export default TradePromiseList;
