import { FC } from 'react';

export interface TradeCardProps {
  tradeId: number;
  userName: string;
  userProfileUrl: string;
  statusText: string; // 예: "12시간 남음"
  meetTime: string; // 예: "2025년 4월 24일 목 오후 12:00"
}

const TradePromiseCard: FC<TradeCardProps> = ({
  // tradeId,
  userName,
  userProfileUrl,
  statusText,
  meetTime,
}) => {
  return (
    <div className="card p-4 rounded-xl shadow-sm space-y-3">
      {/* 상단 프로필 및 상태 */}
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <img
            src={userProfileUrl}
            alt={`${userName} 프로필`}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <p className="font-semibold">{userName} 님</p>
            <p className="text-xs text-gray-500">구미시 인의동</p>
          </div>
        </div>
        <div className="badge bg-pink-100 text-pink-600">{statusText}</div>
      </div>

      {/* 만남 정보 */}
      <div>
        <p className="text-sm font-semibold flex items-center">
          <span className="mr-1">🕒</span>반납 시간 (만나서 책 반납)
        </p>
        <p className="text-sm text-gray-600 mt-1">{meetTime}</p>
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-2 mt-2">
        <button className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-100">
          📖 공개 서재 보기
        </button>
        <button className="flex-1 bg-pink-400 hover:bg-pink-500 text-white rounded-lg px-3 py-1.5 text-sm">
          💬 채팅 바로가기
        </button>
      </div>
    </div>
  );
};

export default TradePromiseCard;
