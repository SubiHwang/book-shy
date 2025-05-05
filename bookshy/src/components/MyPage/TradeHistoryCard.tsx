import { FC } from 'react';

interface TradeHistoryCardProps {
  tradeId: number;
  completedAt: string;
  counterpartNickname: string;
  counterpartProfileImageUrl: string;
  receivedBookTitle: string;
  receivedBookAuthor: string;
  receivedBookCoverUrl: string;
  // 🔜 향후 준 책 정보 추가 예정
  givenBookTitle?: string;
  givenBookAuthor?: string;
  givenBookCoverUrl?: string;
}

const TradeHistoryCard: FC<TradeHistoryCardProps> = ({
  tradeId,
  completedAt,
  counterpartNickname,
  counterpartProfileImageUrl,
  receivedBookTitle,
  receivedBookAuthor,
  receivedBookCoverUrl,
  givenBookTitle,
  givenBookAuthor,
  givenBookCoverUrl,
}) => {
  return (
    <div
      key={tradeId}
      className="bg-white rounded-xl shadow-sm p-4 space-y-3 border border-gray-100"
    >
      {/* 날짜 + 상태 */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="font-medium">
          {new Date(completedAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </span>
        <span className="text-[11px] text-pink-500 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">
          🔁 완료 / 반납
        </span>
      </div>

      {/* 3-Column Layout */}
      <div className="flex gap-4 items-start">
        {/* 1. 프로필 이미지 */}
        <img
          src={counterpartProfileImageUrl}
          alt="상대방 프로필"
          className="w-14 h-14 rounded-full object-cover border border-gray-200"
        />

        {/* 2. 유저 닉네임 + 책 정보 */}
        <div className="flex-1 space-y-1 text-sm text-gray-700">
          <div className="font-semibold text-base">{counterpartNickname} 님</div>
          <p>
            📗 <b>받은 책:</b> {receivedBookTitle}
          </p>
          <p>
            ✍ <b>저자:</b> {receivedBookAuthor}
          </p>
          {givenBookTitle && (
            <>
              <p>
                📘 <b>준 책:</b> {givenBookTitle}
              </p>
              <p>
                ✍ <b>저자:</b> {givenBookAuthor}
              </p>
            </>
          )}
        </div>

        {/* 3. 책 이미지들 */}
        <div className="flex flex-col gap-2">
          <img
            src={receivedBookCoverUrl}
            alt="받은 책"
            className="w-14 h-20 rounded-md shadow object-cover border border-gray-200"
          />
          {givenBookCoverUrl && (
            <img
              src={givenBookCoverUrl}
              alt="준 책"
              className="w-14 h-20 rounded-md shadow object-cover border border-gray-200"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeHistoryCard;
