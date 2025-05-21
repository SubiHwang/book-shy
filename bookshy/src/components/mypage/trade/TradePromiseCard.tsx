import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookMarked, MessageCircle } from 'lucide-react';

export interface TradeCardProps {
  userId: number;
  chatId: number;
  tradeId: number;
  type: 'EXCHANGE' | 'RENTAL';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  userName: string;
  userProfileUrl: string;
  myBookTitle: string;
  myBookCoverUrl: string;
  partnerBookTitle: string;
  partnerBookCoverUrl: string;
  statusText: string;
  meetTime: string;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    display: string;
  };
}

const TradePromiseCard: FC<TradeCardProps> = ({
  userId,
  chatId,
  type,
  userName,
  userProfileUrl,
  meetTime,
  timeLeft,
}) => {
  const navigate = useNavigate();

  const handleChatClick = (chatId: number) => {
    navigate(`/chat/${chatId}`);
  };

  const handleClickNeighborsBookshelf = (userId: number) => {
    // TODO: 상대방 서재로 이동하는 기능 구현
    navigate(`/matching/neigbors-bookshelf/${userId}`);
  };

  const renderTimeLeft = () => {
    const { days, hours, minutes } = timeLeft;
    const parts = [];

    if (days > 0) parts.push(`${days}일`);
    if (hours > 0) parts.push(`${hours}시간`);
    if (minutes > 0) parts.push(`${minutes}분`);

    return (
      <div className="px-2 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-pink-50 text-primary text-sm font-medium shadow-sm">
        <span className="font-bold">D-{parts.join(' ')}</span>
      </div>
    );
  };

  return (
    <div className="card bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 m-4 w-full max-w-md mx-auto">
      {/* 상단 프로필 섹션 */}
      <div className="p-4 bg-light-bg-card">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="relative">
              <img
                src={userProfileUrl || '#'}
                alt={`${userName} 프로필`}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">{userName} 님</h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    type === 'EXCHANGE'
                      ? 'bg-blue-100 text-light-status-info'
                      : 'bg-orange-100 text-light-status-warning'
                  }`}
                >
                  {type === 'EXCHANGE' ? '교환' : '대여'}
                </span>
              </div>
              <p className="text-sm text-light-text">{meetTime}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">{renderTimeLeft()}</div>
        </div>
      </div>

      {/* 하단 버튼 섹션 */}
      <div className="p-4 bg-light-bg-shade border-t border-gray-50">
        <div className="flex gap-3">
          <button
            onClick={() => handleClickNeighborsBookshelf(userId)}
            className="flex-1 flex items-center justify-center gap-2 px-2 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <BookMarked className="w-4 h-4" strokeWidth={1.5} />
            <span>서재 보기</span>
          </button>
          <button
            onClick={() => {
              handleChatClick(chatId);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-2 py-2 bg-primary-light text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
            <span>채팅하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradePromiseCard;
