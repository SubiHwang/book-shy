import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BookNote } from '@/types/mybooknote/booknote';
import BookNoteCard from '@/components/mybooknote/booknote/BookNoteCard';
import AdjacentBookPreview from '@/components/mybooknote/booknote/AdjacentBookPreview';
import { PlusCircle } from 'lucide-react';

interface BookNoteSwiperPageProps {
  bookNotes: (BookNote & { libraryId: number })[];
}

const BookNoteSwiperPage: React.FC<BookNoteSwiperPageProps> = ({ bookNotes }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'has' | 'none'>('all');
  const [stage, setStage] = useState<'cover' | 'quote'>('cover');

  const filteredNotes = bookNotes.filter((book) => {
    const hasReview = !!book.reviewId && book.content.trim() !== '';
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'has') return hasReview;
    if (selectedFilter === 'none') return !hasReview;
    return true;
  });

  const currentBook = filteredNotes[currentIndex];
  if (!currentBook) return <p className="p-4">조건에 맞는 독서 기록이 없습니다.</p>;

  const handleCardClick = () => {
    if (stage === 'cover') {
      setStage('quote');
    } else {
      navigate(`/booknotes/full/${currentBook.bookId}`);
    }
  };

  const goTo = (offset: number) => {
    const newIdx = currentIndex + offset;
    if (newIdx >= 0 && newIdx < filteredNotes.length) {
      setCurrentIndex(newIdx);
      setStage('cover');
    }
  };

  return (
    <div className="min-h-screen bg-light-bg pb-28">
      <div className="px-4 pt-4 space-y-4">
        <div className="text-sm text-light-text-secondary">총 {filteredNotes.length}권</div>

        {/* ✅ 칩 형식 필터 버튼 */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {[
            { label: '전체 보기', value: 'all' },
            { label: '기록이 있는 책', value: 'has' },
            { label: '기록이 없는 책', value: 'none' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setSelectedFilter(filter.value as typeof selectedFilter);
                setCurrentIndex(0);
                setStage('cover');
              }}
              className={`px-4 py-1.5 rounded-full border text-sm whitespace-nowrap transition
                ${
                  selectedFilter === filter.value
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-600 border-gray-300'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="bg-[#FFF3F3] border border-[#FF8080] rounded-md px-5 py-3">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[#FF4040]">📢</span>
            <h1 className="text-[#FF4040] font-medium text-sm">내 독서 기록 보기 시스템</h1>
          </div>
          <p className="text-[gray] text-xs sm:text-sm leading-relaxed">
            내가 남긴 감상과 인용구를 다시 떠올려보세요. <br />한 줄 한 줄에 담긴 감정과 생각을
            되새겨볼 수 있어요.
          </p>
        </div>
      </div>

      {/* 카드 영역 */}
      <div
        className="relative h-[60vh] flex items-center justify-center overflow-hidden mt-4"
        onClick={handleCardClick}
      >
        {/* 왼쪽 카드 */}
        {filteredNotes[currentIndex - 1] && (
          <div className="absolute left-0 z-10 opacity-90 scale-90">
            <AdjacentBookPreview
              book={filteredNotes[currentIndex - 1]}
              direction="left"
              onClick={() => goTo(-1)}
            />
          </div>
        )}

        {/* 현재 카드 */}
        <div className="z-20">
          <BookNoteCard
            coverUrl={currentBook.coverUrl}
            title={currentBook.title}
            author={currentBook.author}
            quote={currentBook.quoteContent}
            flipped={stage === 'quote'}
            onMoreClick={() => navigate(`/booknotes/full/${currentBook.bookId}`)}
          />
        </div>

        {/* 오른쪽 카드 */}
        {filteredNotes[currentIndex + 1] && (
          <div className="absolute right-0 z-10 opacity-90 scale-90">
            <AdjacentBookPreview
              book={filteredNotes[currentIndex + 1]}
              direction="right"
              onClick={() => goTo(1)}
            />
          </div>
        )}
      </div>

      {/* 등록 버튼 */}
      <div className="fixed bottom-24 right-6 z-50">
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

export default BookNoteSwiperPage;
