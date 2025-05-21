import { FC, useState } from 'react';
import { TradeBook } from '@/types/trade';

// SVG 아이콘 컴포넌트
const ChevronDown = ({ className = '' }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 8L10 12L14 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ChevronUp = ({ className = '' }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 12L10 8L6 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface TradeHistoryCardProps {
  tradeId: number;
  completedAt: string;
  counterpartNickname: string;
  counterpartProfileImageUrl: string;
  receivedBooks: TradeBook[];
  givenBooks: TradeBook[];
  tradeType: 'EXCHANGE' | 'RENTAL';
}

const TradeHistoryCard: FC<TradeHistoryCardProps> = ({
  tradeId,
  completedAt,
  counterpartNickname,
  counterpartProfileImageUrl,
  receivedBooks,
  givenBooks,
  tradeType,
}) => {
  const tradeTypeLabel = tradeType === 'EXCHANGE' ? '🔁 교환' : '📦 대여 / 반납';

  // 아코디언 상태
  const [showReceived, setShowReceived] = useState(false);
  const [showGiven, setShowGiven] = useState(false);

  return (
    <div
      key={tradeId}
      className="relative bg-light-bg rounded-2xl shadow-md p-5 border border-primary/20 hover:shadow-lg transition-shadow duration-200 mb-4"
    >
      <div className="flex flex-row items-start gap-6">
        {/* 좌측 프로필 */}
        <div className="flex flex-col items-center min-w-[72px]">
          <img
            src={counterpartProfileImageUrl}
            alt="상대방 프로필"
            className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow mb-2"
          />
          <div className="font-bold text-base text-primary text-center whitespace-nowrap">
            {counterpartNickname} 님
          </div>
        </div>
        {/* 우측 정보 */}
        <div className="flex-1 flex flex-col gap-2">
          {/* 상단 날짜/상태 */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400 font-medium">
              {new Date(completedAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border
              ${
                tradeType === 'EXCHANGE'
                  ? 'text-primary border-primary bg-transparent'
                  : 'text-pink-500 border-pink-300 bg-transparent'
              }
            `}
            >
              {tradeTypeLabel}
            </span>
          </div>
          {/* 받은 책/준 책 정보 - 아코디언 */}
          <div className="flex flex-col md:flex-row md:justify-center gap-4">
            {/* 받은 책 */}
            <div
              className={`flex-1 rounded-2xl p-4 flex flex-col items-center shadow-sm transition bg-primary/5 ${showReceived ? 'ring-2 ring-primary/30 bg-primary/10' : ''}`}
            >
              <button
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold border transition
                  ${
                    showReceived
                      ? 'bg-primary/10 text-primary border-primary shadow'
                      : 'bg-white text-primary border-primary/30 hover:bg-primary/5'
                  }
                `}
                onClick={() => setShowReceived((prev) => !prev)}
                aria-expanded={showReceived}
              >
                <span className="text-xs font-bold tracking-wide">📗 받은 책</span>
                <span className="text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5 ml-1">
                  {receivedBooks.length}권
                </span>
                <span
                  className={`ml-1 transition-transform duration-200 ${showReceived ? 'rotate-180' : ''}`}
                >
                  {showReceived ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>
              {showReceived && (
                <>
                  <ul className="list-disc ml-5 mt-1 mb-2 w-full">
                    {receivedBooks.map((book) => (
                      <li key={book.bookId} className="text-sm text-gray-700 break-words">
                        {book.title} <span className="text-gray-400">({book.author})</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 flex-wrap justify-center w-full">
                    {receivedBooks.map((book) => (
                      <img
                        key={book.bookId}
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-12 h-16 rounded-lg border-2 border-primary/40 bg-white shadow"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* 준 책 */}
            <div
              className={`flex-1 rounded-2xl p-4 flex flex-col items-center shadow-sm transition bg-pink-50/60 ${showGiven ? 'ring-2 ring-pink-200 bg-pink-100/60' : ''}`}
            >
              <button
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold border transition
                  ${
                    showGiven
                      ? 'bg-pink-100/60 text-pink-500 border-pink-400 shadow'
                      : 'bg-white text-pink-500 border-pink-200 hover:bg-pink-100/40'
                  }
                `}
                onClick={() => setShowGiven((prev) => !prev)}
                aria-expanded={showGiven}
              >
                <span className="text-xs font-bold tracking-wide">📘 준 책</span>
                <span className="text-xs bg-pink-100 text-pink-500 rounded-full px-2 py-0.5 ml-1">
                  {givenBooks.length}권
                </span>
                <span
                  className={`ml-1 transition-transform duration-200 ${showGiven ? 'rotate-180' : ''}`}
                >
                  {showGiven ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>
              {showGiven && (
                <>
                  <ul className="list-disc ml-5 mt-1 mb-2 w-full">
                    {givenBooks.map((book) => (
                      <li key={book.bookId} className="text-sm text-gray-700 break-words">
                        {book.title} <span className="text-gray-400">({book.author})</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2 flex-wrap justify-center w-full">
                    {givenBooks.map((book) => (
                      <img
                        key={book.bookId}
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-12 h-16 rounded-lg border-2 border-pink-200 bg-white shadow"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeHistoryCard;
