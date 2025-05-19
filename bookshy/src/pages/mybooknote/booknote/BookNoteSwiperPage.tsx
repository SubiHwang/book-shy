import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BookNote } from '@/types/mybooknote/booknote';
import BookNoteCard from '@/components/mybooknote/booknote/BookNoteCard';
import AdjacentBookPreview from '@/components/mybooknote/booknote/AdjacentBookPreview';
import FilterChips from '@/components/common/FilterChips';
import { PlusCircle, BookOpen, CheckCircle, CircleSlash } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';

interface BookNoteSwiperPageProps {
  bookNotes: (BookNote & { libraryId: number })[];
}

type FilterType = 'all' | 'has' | 'none';

const BookNoteSwiperPage: React.FC<BookNoteSwiperPageProps> = ({ bookNotes }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [stage, setStage] = useState<'cover' | 'quote'>('cover');

  const filteredNotes = bookNotes.filter((book) => {
    const hasReview = !!book.reviewId && book.content.trim() !== '';
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'has') return hasReview;
    if (selectedFilter === 'none') return !hasReview;
    return true;
  });

  const total = filteredNotes.length;
  const currentBook = filteredNotes[currentIndex];
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => goTo(1),
    onSwipedRight: () => goTo(-1),
    delta: 50,
    trackTouch: true,
  });

  if (!currentBook) return <p className="p-4">조건에 맞는 독서 기록이 없습니다.</p>;

  const handleCardClick = () => {
    if (stage === 'cover') {
      setStage('quote');
    } else {
      navigate(`/booknotes/full/${currentBook.bookId}`);
    }
  };

  const goTo = (offset: number) => {
    const newIdx = (currentIndex + offset + total) % total;
    setCurrentIndex(newIdx);
    setStage('cover');
  };

  const filterOptions: { label: string; value: FilterType; icon: React.ReactNode }[] = [
    { label: '전체 보기', value: 'all', icon: <BookOpen size={16} className="mr-1" /> },
    { label: '기록 O', value: 'has', icon: <CheckCircle size={16} className="mr-1" /> },
    { label: '기록 X', value: 'none', icon: <CircleSlash size={16} className="mr-1" /> },
  ];

  return (
    <div className="min-h-screen bg-light-bg pb-28">
      <div className="w-full bg-primary-light/20 px-5 sm:px-8 py-3 sm:py-4">
        <div className="flex items-center gap-1 mb-1 sm:mb-2">
          <BookOpen className="text-primary-dark w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1} />
          <h1 className="text-primary-dark font-medium text-sm sm:text-base md:text-lg">
            내 독서 기록 보기 시스템
          </h1>
        </div>
        <p className="text-light-text-secondary font-light text-xs sm:text-sm leading-tight sm:leading-normal">
          내가 남긴 감상과 인용구를 다시 떠올려보세요.
          <span className="hidden sm:inline"> </span>
          <span className="inline sm:hidden">
            <br />
          </span>
          한 줄 한 줄에 담긴 감정과 생각을 되새겨볼 수 있어요.
        </p>
      </div>
      <div className="px-4 pt-4 space-y-4">
        <div className="text-sm text-light-text-secondary">총 {filteredNotes.length}권</div>

        <FilterChips<FilterType>
          options={filterOptions}
          selected={selectedFilter}
          onSelect={(val) => {
            setSelectedFilter(val);
            setCurrentIndex(0);
            setStage('cover');
          }}
        />
      </div>

      {/* 카드 영역 */}
      <div
        {...swipeHandlers}
        className="relative h-[60vh] flex items-center justify-center overflow-hidden mt-4"
        onClick={handleCardClick}
      >
        {/* 왼쪽 카드 */}
        {total > 1 && (
          <div className="absolute left-0 z-10 opacity-90 scale-90">
            <AdjacentBookPreview
              book={filteredNotes[prevIndex]}
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
        {total > 1 && (
          <div className="absolute right-0 z-10 opacity-90 scale-90">
            <AdjacentBookPreview
              book={filteredNotes[nextIndex]}
              direction="right"
              onClick={() => goTo(1)}
            />
          </div>
        )}
      </div>

      {/* 인용구 버튼 */}
      <div className="fixed bottom-24 left-6 z-[50]">
        <button
          onClick={() => navigate('/booknotes/quote-galaxy')}
          className="w-14 h-14 rounded-full bg-cyan-500/20 backdrop-blur-md shadow-xl shadow-cyan-400/40 
               border border-cyan-400 hover:ring-2 hover:ring-cyan-300 hover:ring-offset-2 
               flex justify-center items-center transition duration-300"
        >
          <BookOpen size={28} strokeWidth={2} color="white" />
        </button>
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
