import { FC } from 'react';
import TradeCard from '@/components/MyPage/TradePromiseCard';

const dummyTradeData = [
  {
    id: 1,
    userName: '제니',
    userProfileUrl: '/images/jennie.jpg',
    statusText: '12시간 전',
    meetTime: '2025년 4월 24일 목 오후 12:00',
  },
  {
    id: 2,
    userName: '잭슨',
    userProfileUrl: '/images/jackson.jpg',
    statusText: '3일 남음',
    meetTime: '2025년 4월 24일 목 오후 12:00',
  },
];

const TradePromiseList: FC = () => {
  return (
    <div className="px-4 mt-4 space-y-4 pb-32">
      {dummyTradeData.map((trade) => (
        <TradeCard key={trade.id} {...trade} />
      ))}
    </div>
  );
};

export default TradePromiseList;
