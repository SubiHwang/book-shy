import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTradeHistory } from '@/services/mypage/trade';
import type { TradeHistoryGroup } from '@/types/trade';
import TradeHistoryCard from '@/components/mypage/trade/TradeHistoryCard';
import Loading from '@/components/common/Loading';

const TradeHistoryList: FC = () => {
  const { data, isLoading, error } = useQuery<TradeHistoryGroup[]>({
    queryKey: ['trade-history'],
    queryFn: fetchTradeHistory,
  });

  if (isLoading) return <Loading loadingText="거래 내역 불러오는 중..." />;
  if (error || !data) return <div className="p-4 text-red-500">거래 내역 불러오기 실패</div>;

  // 거래 내역이 없는 경우
  if (data.length === 0 || data.every((group) => group.trades.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 h-[50vh]">
        <p className="text-lg mb-2">거래 내역이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="px-4 mt-4 pb-32 space-y-6">
      {data.map(({ yearMonth, trades }) => (
        <div key={yearMonth} className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">{yearMonth}</h2>
          {trades.map((trade) => (
            <TradeHistoryCard
              key={trade.tradeId}
              tradeId={trade.tradeId}
              completedAt={trade.completedAt}
              counterpartNickname={trade.counterpartNickname}
              counterpartProfileImageUrl={trade.counterpartProfileImageUrl}
              receivedBooks={trade.receivedBooks}
              givenBooks={trade.givenBooks}
              tradeType={trade.tradeType}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TradeHistoryList;
