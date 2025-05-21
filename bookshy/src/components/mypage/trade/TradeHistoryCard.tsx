import { FC, useState } from 'react';
import { TradeBook } from '@/types/trade';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const tradeTypeLabel = tradeType === 'EXCHANGE' ? '교환' : '대여 / 반납';

  // 아코디언 상태
  const [showReceived, setShowReceived] = useState(false);
  const [showGiven, setShowGiven] = useState(false);

  return (
    <div
      key={tradeId}
      className="relative bg-light-bg-card rounded-xl shadow-sm p-5 border border-light-bg-shade hover:shadow-md transition-shadow duration-200 mb-4"
    >
      <div className="flex flex-row items-start gap-4">
        {/* 좌측 프로필 */}
        <div className="flex flex-col items-center min-w-[72px]">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/40 shadow-sm mb-2">
            <img
              src={counterpartProfileImageUrl}
              alt="상대방 프로필"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-semibold text-sm text-light-text text-center whitespace-nowrap">
            {counterpartNickname} 님
          </div>
        </div>
        {/* 우측 정보 */}
        <div className="flex-1 flex flex-col gap-3">
          {/* 상단 날짜/상태 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-light-text-muted font-medium">
              {new Date(completedAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </span>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full 
              ${
                tradeType === 'EXCHANGE'
                  ? 'text-primary border border-primary/20 bg-primary/10'
                  : 'text-light-status-info border border-light-status-info/20 bg-light-status-info/10'
              }
            `}
            >
              {tradeTypeLabel}
            </span>
          </div>

          {/* 구분선 */}
          <div className="border-t border-light-bg-shade my-1"></div>

          {/* 받은 책/준 책 정보 - 아코디언 */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* 받은 책 */}
            <div
              className={`flex-1 rounded-xl p-3 flex flex-col bg-light-bg transition-all duration-200 ${
                showReceived
                  ? 'border-2 border-primary/40 shadow-md'
                  : 'border border-light-bg-shade shadow-sm'
              }`}
            >
              <button
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition
                  ${
                    showReceived
                      ? 'bg-primary/10 text-primary'
                      : 'bg-light-bg-secondary text-light-text hover:bg-light-bg-shade'
                  }
                `}
                onClick={() => setShowReceived((prev) => !prev)}
                aria-expanded={showReceived}
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium">받은 도서</span>
                  <span className="text-xs bg-light-bg-card text-primary border border-primary/30 rounded-full px-2 py-0.5 ml-2">
                    {receivedBooks.length}권
                  </span>
                </div>
                <span
                  className={`transition-transform duration-200 ${showReceived ? 'rotate-180' : ''}`}
                >
                  {showReceived ? (
                    <ChevronUp size={16} strokeWidth={2} />
                  ) : (
                    <ChevronDown size={16} strokeWidth={2} />
                  )}
                </span>
              </button>

              {showReceived && (
                <div className="mt-2 pt-2 border-t border-light-bg-shade">
                  <ul className="space-y-2 mb-3">
                    {receivedBooks.map((book) => (
                      <li key={book.bookId} className="text-sm text-light-text flex items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        <span className="font-medium">{book.title}</span>
                        <span className="text-xs text-light-text-muted ml-1">({book.author})</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3 flex-wrap p-2 bg-light-bg-secondary rounded-lg justify-start">
                    {receivedBooks.map((book) => (
                      <img
                        key={book.bookId}
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-14 h-20 rounded-md border border-primary-light/30 bg-light-bg-card shadow-sm hover:shadow-md hover:border-primary transition-all duration-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 준 책 */}
            <div
              className={`flex-1 rounded-xl p-3 flex flex-col bg-light-bg transition-all duration-200 ${
                showGiven
                  ? 'border-2 border-light-status-info/40 shadow-md'
                  : 'border border-light-bg-shade shadow-sm'
              }`}
            >
              <button
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition
                  ${
                    showGiven
                      ? 'bg-light-status-info/10 text-light-status-info'
                      : 'bg-light-bg-secondary text-light-text hover:bg-light-bg-shade'
                  }
                `}
                onClick={() => setShowGiven((prev) => !prev)}
                aria-expanded={showGiven}
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium">보낸 도서</span>
                  <span className="text-xs bg-light-bg-card text-light-status-info border border-light-status-info/30 rounded-full px-2 py-0.5 ml-2">
                    {givenBooks.length}권
                  </span>
                </div>
                <span
                  className={`transition-transform duration-200 ${showGiven ? 'rotate-180' : ''}`}
                >
                  {showGiven ? (
                    <ChevronUp size={16} strokeWidth={2} />
                  ) : (
                    <ChevronDown size={16} strokeWidth={2} />
                  )}
                </span>
              </button>

              {showGiven && (
                <div className="mt-2 pt-2 border-t border-light-bg-shade">
                  <ul className="space-y-2 mb-3">
                    {givenBooks.map((book) => (
                      <li key={book.bookId} className="text-sm text-light-text flex items-center">
                        <div className="w-2 h-2 rounded-full bg-light-status-info mr-2"></div>
                        <span className="font-medium">{book.title}</span>
                        <span className="text-xs text-light-text-muted ml-1">({book.author})</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3 flex-wrap p-2 bg-light-bg-secondary rounded-lg justify-start">
                    {givenBooks.map((book) => (
                      <img
                        key={book.bookId}
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-14 h-20 rounded-md border border-light-status-info/30 bg-light-bg-card shadow-sm hover:shadow-md hover:border-light-status-info transition-all duration-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeHistoryCard;
