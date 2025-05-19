import { useNavigate } from 'react-router-dom';
import BookCard from '@/components/mybooknote/booknote/BookCard';
import type { BookNote } from '@/types/mybooknote/booknote';
import { useState } from 'react';
import { PlusCircle, ChevronDown } from 'lucide-react';

interface BookGridPetalPageProps {
  bookNotes: BookNote[];
}

const MyBookNoteGridPage: React.FC<BookGridPetalPageProps> = ({ bookNotes }) => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const filterOptions = [
    { value: 'all', label: '전체 보기' },
    { value: 'has', label: '기록이 있는 책' },
    { value: 'none', label: '기록이 없는 책' },
  ];

  const filteredNotes = bookNotes.filter((book) => {
    const hasReview =
      book.reviewId !== undefined && book.reviewId !== null && book.content.trim() !== '';

    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'has') return hasReview;
    if (selectedFilter === 'none') return !hasReview;
    return true;
  });

  return (
    <div className="bg-light-bg min-h-screen pb-28">
      <div className="px-4 pt-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="font-light text-light-text-secondary">총 {filteredNotes.length} 권</div>
            <div className="relative">
              <button
                className="flex items-center border rounded px-3 py-1 text-sm"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <span>
                  {filterOptions.find((option) => option.value === selectedFilter)?.label}
                </span>
                <ChevronDown size={16} className="ml-1" />
              </button>

              {filterOpen && (
                <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10 w-32">
                  <ul className="py-1">
                    {filterOptions.map((option) => (
                      <li
                        key={option.value}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm font-light"
                        onClick={() => {
                          setSelectedFilter(option.value);
                          setFilterOpen(false);
                        }}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
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
      <div className="fixed bottom-32 right-6">
        <button
          onClick={() => navigate('/booknotes/select')}
          className="w-14 h-14 rounded-xl bg-primary text-white flex justify-center items-center shadow-lg"
        >
          <PlusCircle size={32} strokeWidth={1} />
        </button>
      </div>
    </div>
  );
};

export default MyBookNoteGridPage;
