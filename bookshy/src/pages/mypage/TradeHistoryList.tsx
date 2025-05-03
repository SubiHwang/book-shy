import { FC } from 'react';

interface TradeHistoryItem {
  id: number;
  date: string; // 'YYYY.MM.DD'
  userName: string;
  userProfileUrl: string;
  givenBookTitle: string;
  givenBookCoverUrl: string;
  receivedBookTitle: string;
  receivedBookCoverUrl: string;
  status: '거래 완료';
}

const dummyData: Record<string, TradeHistoryItem[]> = {
  '2025.07': [
    {
      id: 1,
      date: '2025/07/17',
      userName: '루시',
      userProfileUrl: '/images/lucy.jpg',
      givenBookTitle: '이기적 유전자',
      givenBookCoverUrl: '/images/selfish-gene.jpg',
      receivedBookTitle: '정의란 무엇인가',
      receivedBookCoverUrl: '/images/justice.jpg',
      status: '거래 완료',
    },
    {
      id: 2,
      date: '2025/07/17',
      userName: '루시',
      userProfileUrl: '/images/lucy.jpg',
      givenBookTitle: '이기적 유전자',
      givenBookCoverUrl: '/images/selfish-gene.jpg',
      receivedBookTitle: '정의란 무엇인가',
      receivedBookCoverUrl: '/images/justice.jpg',
      status: '거래 완료',
    },
  ],
  '2025.06': [
    {
      id: 3,
      date: '2025/06/17',
      userName: '루시',
      userProfileUrl: '/images/lucy.jpg',
      givenBookTitle: '이기적 유전자',
      givenBookCoverUrl: '/images/selfish-gene.jpg',
      receivedBookTitle: '정의란 무엇인가',
      receivedBookCoverUrl: '/images/justice.jpg',
      status: '거래 완료',
    },
  ],
};

const TradeHistoryList: FC = () => {
  return (
    <div className="px-4 mt-4 pb-32 space-y-6">
      {Object.entries(dummyData).map(([month, trades]) => (
        <div key={month} className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">{month}</h2>
          {trades.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{item.date}</span>
                <span className="bg-gray-100 text-pink-500 px-2 py-0.5 rounded-full font-medium text-[11px]">
                  {item.status}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={item.userProfileUrl}
                  alt="상대방 프로필"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-sm font-medium">{item.userName} 님</div>
              </div>

              <div className="flex flex-col text-sm">
                <p>
                  📗 <b>받은 책:</b> {item.receivedBookTitle}
                </p>
                <p>
                  📕 <b>준 책:</b> {item.givenBookTitle}
                </p>
              </div>

              <div className="flex gap-2 mt-2">
                <img
                  src={item.receivedBookCoverUrl}
                  alt="받은 책"
                  className="w-14 h-20 rounded shadow object-cover"
                />
                <img
                  src={item.givenBookCoverUrl}
                  alt="준 책"
                  className="w-14 h-20 rounded shadow object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TradeHistoryList;
