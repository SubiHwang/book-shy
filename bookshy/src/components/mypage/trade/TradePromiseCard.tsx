import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TradeCardProps {
  tradeId: number;
  type: 'EXCHANGE' | 'RENTAL';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  userName: string;
  userProfileUrl: string;
  myBookTitle: string;
  partnerBookTitle: string;
  statusText: string;
  meetTime: string;
}

const TradePromiseCard: FC<TradeCardProps> = ({
  tradeId,
  type,
  userName,
  userProfileUrl,
  myBookTitle,
  partnerBookTitle,
  statusText,
  meetTime,
}) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/chat/${tradeId}`);
  };

  const handleLibraryClick = () => {
    // TODO: 상대방 서재로 이동하는 기능 구현
  };

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
            <p className="text-xs text-gray-500">
              {type === 'EXCHANGE' ? '도서 교환' : '도서 대여'}
            </p>
          </div>
        </div>
        <div className="badge bg-pink-100 text-pink-600">{statusText}</div>
      </div>

      {/* 도서 정보 */}
      <div className="space-y-2">
        <div>
          <p className="text-sm font-semibold flex items-center">
            <span className="mr-1">📚</span>내가 줄 책
          </p>
          <p className="text-sm text-gray-600 mt-1">{myBookTitle}</p>
        </div>
        <div>
          <p className="text-sm font-semibold flex items-center">
            <span className="mr-1">📖</span>받을 책
          </p>
          <p className="text-sm text-gray-600 mt-1">{partnerBookTitle}</p>
        </div>
      </div>

      {/* 만남 정보 */}
      <div>
        <p className="text-sm font-semibold flex items-center">
          <span className="mr-1">🕒</span>약속 시간
        </p>
        <p className="text-sm text-gray-600 mt-1">{meetTime}</p>
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleLibraryClick}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-100"
        >
          📖 공개 서재 보기
        </button>
        <button
          onClick={handleChatClick}
          className="flex-1 bg-pink-400 hover:bg-pink-500 text-white rounded-lg px-3 py-1.5 text-sm"
        >
          💬 채팅 바로가기
        </button>
      </div>
    </div>
  );
};

export default TradePromiseCard;
