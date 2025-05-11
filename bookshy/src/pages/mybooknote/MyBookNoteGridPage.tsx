import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
import TabNavBar from '@/components/common/TabNavBar';
import BookCard from '@/components/booknote/BookCard';
import type { BookNote } from '@/types/mybooknote/booknote';
import { useState } from 'react';

interface BookGridPetalPageProps {
  bookNotes: BookNote[];
}

const MyBookNoteGridPage: React.FC<BookGridPetalPageProps> = ({ bookNotes }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'X'>('ALL');

  const pages = [
    { path: '/booknotes', label: '내 독서 기록 보기' },
    { path: '/booknotes/plan', label: '책의 여정 보기' },
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

        <div className="w-fit mx-auto grid grid-cols-2 gap-12">
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

      {/* 책 추가 플로팅 액션 버튼 */}
      <div className="fixed bottom-28 right-5 md:right-10">
        <button
          className="bg-primary hover:bg-primary-dark text-light-text-inverted rounded-full p-3 shadow-lg transition-colors"
          onClick={() => navigate('/booknotes/select')}
        >
          <img src="/icons/camera-upload.svg" alt="카메라 업로드" className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
};

export default MyBookNoteGridPage;
