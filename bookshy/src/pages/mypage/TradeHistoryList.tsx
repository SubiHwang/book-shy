import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTradeHistory } from '@/services/mypage/trade';
import type { TradeHistoryGroup } from '@/types/trade';

const TradeHistoryList: FC = () => {
  const { data, isLoading, error } = useQuery<TradeHistoryGroup[], Error>({
    queryKey: ['trade-history'],
    queryFn: fetchTradeHistory,
  });

  if (isLoading) return <div className="p-4">거래 내역 불러오는 중...</div>;
  if (error || !data) return <div className="p-4 text-red-500">거래 내역 불러오기 실패</div>;

  return (
    <div className="px-4 mt-4 pb-32 space-y-6">
      {data.map(({ yearMonth, trades }) => (
        <div key={yearMonth} className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">{yearMonth}</h2>
          {trades.map((item) => (
            <div key={item.tradeId} className="card flex flex-col space-y-3">
              {/* 날짜 + 상태 */}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  {new Date(item.completedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </span>
                <span className="bg-gray-100 text-pink-500 px-2 py-0.5 rounded-full font-medium text-[11px]">
                  완료됨
                </span>
              </div>

              {/* 상대방 정보 */}
              <div className="flex items-center gap-3">
                <img
                  src={item.counterpartProfileImageUrl}
                  alt="상대방 프로필"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-sm font-medium">{item.counterpartNickname} 님</div>
              </div>

              {/* 책 정보 */}
              <div className="flex flex-col text-sm">
                <p>
                  📗 <b>받은 책:</b> {item.receivedBookTitle}
                </p>
                <p>
                  ✍ <b>저자:</b> {item.receivedBookAuthor}
                </p>
              </div>

              {/* 책 이미지 */}
              <div className="flex gap-2 mt-2">
                <img
                  src={item.receivedBookCoverUrl}
                  alt="받은 책"
                  className="w-14 h-20 rounded shadow object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TradeHistoryList;
