import { FC } from 'react';

interface TradeCardProps {
  userName: string;
  userProfileUrl: string;
  statusText: string;
  meetTime: string;
}

const TradeCard: FC<TradeCardProps> = ({ userName, userProfileUrl, statusText, meetTime }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={userProfileUrl}
            alt={`${userName} 프로필`}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <p className="font-medium">{userName} 님</p>
            <p className="text-sm text-gray-500">구매자 입장에서</p>
          </div>
        </div>
        <div className="text-xs text-white bg-pink-400 px-2 py-1 rounded">{statusText}</div>
      </div>
      <div className="text-sm font-medium">📍 반납 시간 (만나서 책 반납)</div>
      <div className="text-sm text-gray-600">{meetTime}</div>
      <div className="flex justify-between mt-2">
        <button className="text-sm border border-gray-300 px-3 py-1 rounded">공개 서재 보기</button>
        <button className="text-sm bg-pink-500 text-white px-3 py-1 rounded">채팅 바로가기</button>
      </div>
    </div>
  );
};

export default TradeCard;
