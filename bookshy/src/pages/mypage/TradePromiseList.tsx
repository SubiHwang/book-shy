import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTradePromises } from '@/services/mypage/trade';
import TradeCard from '@/components/MyPage/TradePromiseCard';
import type { TradePromise } from '@/types/trade';

const TradePromiseList: FC = () => {
  const { data, isLoading, error } = useQuery<TradePromise[], Error>({
    queryKey: ['tradePromises'],
    queryFn: fetchTradePromises,
  });

  if (isLoading) return <div className="p-4">거래 약속 불러오는 중...</div>;
  if (error || !data) return <div className="p-4 text-red-500">거래 약속 불러오기 실패</div>;

  return (
    <div className="px-4 mt-4 space-y-4 pb-32">
      {data.map((item) => (
        <TradeCard
          key={item.tradeId}
          tradeId={item.tradeId}
          userName={item.counterpart.nickname}
          userProfileUrl={item.counterpart.profileImageUrl}
          statusText={item.timeLeft.display}
          meetTime={new Date(item.scheduledTime).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        />
      ))}
    </div>
  );
};

export default TradePromiseList;
