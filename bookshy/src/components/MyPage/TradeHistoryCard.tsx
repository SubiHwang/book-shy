import { FC } from 'react';

interface TradeHistoryCardProps {
  tradeId: number;
  completedAt: string;
  counterpartNickname: string;
  counterpartProfileImageUrl: string;
  receivedBookTitle: string;
  receivedBookAuthor: string;
  receivedBookCoverUrl: string;
}

const TradeHistoryCard: FC<TradeHistoryCardProps> = ({
  tradeId,
  completedAt,
  counterpartNickname,
  counterpartProfileImageUrl,
  receivedBookTitle,
  receivedBookAuthor,
  receivedBookCoverUrl,
}) => {
  return (
    <div key={tradeId} className="card flex flex-col space-y-3">
      {/* 날짜 + 상태 */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {new Date(completedAt).toLocaleDateString('ko-KR', {
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
          src={counterpartProfileImageUrl}
          alt="상대방 프로필"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="text-sm font-medium">{counterpartNickname} 님</div>
      </div>

      {/* 책 정보 */}
      <div className="flex flex-col text-sm">
        <p>
          📗 <b>받은 책:</b> {receivedBookTitle}
        </p>
        <p>
          ✍ <b>저자:</b> {receivedBookAuthor}
        </p>
      </div>

      {/* 책 이미지 */}
      <div className="flex gap-2 mt-2">
        <img
          src={receivedBookCoverUrl}
          alt="받은 책"
          className="w-14 h-20 rounded shadow object-cover"
        />
      </div>
    </div>
  );
};

export default TradeHistoryCard;
