import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

export interface TradeCardProps {
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
  tradeId,
  type,
  userName,
  userProfileUrl,
  myBookTitle,
  myBookCoverUrl,
  partnerBookTitle,
  partnerBookCoverUrl,
  meetTime,
  timeLeft,
}) => {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate(`/chat/${tradeId}`);
  };

  const handleLibraryClick = () => {
    // TODO: 상대방 서재로 이동하는 기능 구현
  };

  const renderTimeLeft = () => {
    const { days, hours, minutes } = timeLeft;
    const parts = [];

    if (days > 0) parts.push(`${days}일`);
    if (hours > 0) parts.push(`${hours}시간`);
    if (minutes > 0) parts.push(`${minutes}분`);

    return (
      <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-pink-50 text-pink-600 text-sm font-medium shadow-sm">
        <span className="font-bold">{parts.join(' ')}</span>
        <span className="text-pink-400 ml-1">남음</span>
      </div>
    );
  };

  return (
    <div className="card bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* 상단 프로필 섹션 */}
      <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={userProfileUrl}
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
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {type === 'EXCHANGE' ? '📚 교환' : '📖 대여'}
                </span>
              </div>
              <p className="text-sm text-gray-500">{meetTime}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">{renderTimeLeft()}</div>
        </div>
      </div>

      {/* 도서 정보 섹션 */}
      <div className="p-4 bg-white">
        <div className="flex space-x-4">
          {/* 내가 줄 책 */}
          <div className="flex-1">
            <div className="relative group">
              <img
                src={myBookCoverUrl}
                alt={myBookTitle}
                className="w-full h-40 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-sm font-medium truncate">{myBookTitle}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">내가 줄 책</p>
          </div>

          {/* 화살표 */}
          <div className="flex items-center">
            <span className="text-2xl text-gray-400">→</span>
          </div>

          {/* 받을 책 */}
          <div className="flex-1">
            <div className="relative group">
              <img
                src={partnerBookCoverUrl}
                alt={partnerBookTitle}
                className="w-full h-40 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white text-sm font-medium truncate">{partnerBookTitle}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">받을 책</p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 섹션 */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex gap-3">
          <button
            onClick={handleLibraryClick}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <span>📚</span>
            <span>공개 서재</span>
          </button>
          <button
            onClick={handleChatClick}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span>💬</span>
            <span>채팅하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradePromiseCard;
