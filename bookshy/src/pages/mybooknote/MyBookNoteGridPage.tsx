import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import TabNavBar from '@/components/common/TabNavBar';
import BookCard from '@/components/booknote/BookCard';
import type { BookNote } from '@/types/mybooknote/booknote';
import { useState } from 'react';

interface BookGridPetalPageProps {
  bookNotes: BookNote[];
}

const MyBookGridPetalPage: React.FC<BookGridPetalPageProps> = ({ bookNotes }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'X'>('ALL');

  const pages = [
    { path: '/booknote', label: '내 독서 기록 보기' },
    { path: '/booknote/plan', label: '책의 여정 보기' },
  ];

  const filteredNotes = bookNotes.filter((book) => {
    const matchFilter = filter === 'ALL' || book.reviewId;
    return matchFilter;
  });

  return (
    <div className="bg-light-bg min-h-screen pb-28">
      <Header title="독서 기록" onBackClick={() => navigate(-1)} showBackButton showNotification />
      <TabNavBar pages={pages} />

      <div className="px-4 pt-4">
        <p className="text-sm text-gray-500 mb-2">나의 독서 기록을 모아보세요.</p>

        <div className="flex gap-2 mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'ALL' | 'X')}
            className="text-sm border rounded-md px-2 py-1"
          >
            <option value="X">X 책</option>
            <option value="ALL">기록있는 책</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredNotes.map((book) => (
            <BookCard
              key={book.bookId}
              bookId={book.bookId}
              title={book.title}
              coverUrl={book.coverUrl || '/placeholder.jpg'}
            />
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <p className="text-sm text-center text-gray-400 mt-12">
            조건에 맞는 독서 기록이 없습니다.
          </p>
        )}
      </div>

      <button
        onClick={() => navigate('/booknotes/create')}
        className="fixed bottom-20 right-6 w-12 h-12 bg-pink-500 text-white rounded-full shadow-lg text-2xl"
      >
        +
      </button>
    </div>
  );
};

export default MyBookGridPetalPage;
