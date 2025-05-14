import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BookNote } from '@/types/mybooknote/booknote';
import BookNoteCard from '@/components/mybooknote/booknote/BookNoteCard';
import AdjacentBookPreview from '@/components/mybooknote/booknote/AdjacentBookPreview';
import Header from '@/components/common/Header';
import { ChevronDown, PlusCircle } from 'lucide-react';

interface BookNoteSwiperPageProps {
  bookNotes: (BookNote & { libraryId: number })[];
}

const BookNoteSwiperPage: React.FC<BookNoteSwiperPageProps> = ({ bookNotes }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stage, setStage] = useState<'quote' | 'review'>('quote');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'has' | 'none'>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredNotes = bookNotes.filter((book) => {
    const hasReview = !!book.reviewId && book.content.trim() !== '';
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'has') return hasReview;
    if (selectedFilter === 'none') return !hasReview;
    return true;
  });

  const currentBook = filteredNotes[currentIndex];
  if (!currentBook) return <p className="p-4">조건에 맞는 독서 기록이 없습니다.</p>;

  const hasReview = !!currentBook.reviewId && currentBook.content.trim() !== '';

  const handleCardClick = () => {
    if (stage === 'quote') {
      setStage('review');
    } else {
      navigate(`/booknotes/full/${currentBook.bookId}`);
    }
  };

  const goTo = (offset: number) => {
    const newIdx = currentIndex + offset;
    if (newIdx >= 0 && newIdx < filteredNotes.length) {
      setCurrentIndex(newIdx);
      setStage('quote');
    }
  };

  return (
    <div className="min-h-screen bg-light-bg pb-28">
      <Header
        title="독서 기록"
        showBackButton
        showNotification={false}
        onBackClick={() => navigate(-1)}
      />
      <div className="px-4 pt-4">
        <div className="mb-2 flex justify-between items-center">
          <div className="font-light text-light-text-secondary">총 {filteredNotes.length}권</div>
          <div className="relative">
            <button
              className="flex items-center border rounded px-3 py-1 text-sm"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <span>
                {selectedFilter === 'all'
                  ? '전체 보기'
                  : selectedFilter === 'has'
                    ? '기록이 있는 책'
                    : '기록이 없는 책'}
              </span>
              <ChevronDown size={16} className="ml-1" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10 w-32">
                <ul className="py-1">
                  {['all', 'has', 'none'].map((value) => (
                    <li
                      key={value}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm font-light"
                      onClick={() => {
                        setSelectedFilter(value as any);
                        setCurrentIndex(0);
                        setStage('quote');
                        setFilterOpen(false);
                      }}
                    >
                      {value === 'all'
                        ? '전체 보기'
                        : value === 'has'
                          ? '기록이 있는 책'
                          : '기록이 없는 책'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#FFF3F3] border border-[#FF8080] rounded-md px-4 py-3 text-sm text-[#FF4040] mb-3">
          <strong className="block mb-1">📢 책의 여정 보기 시스템</strong>
          내가 좋아하거나, 내던 책들을 다른 사람은 어떻게 읽었을까요?
          <br />
          책의 여정 보기를 통해 다른 사람들의 감성평을 알아보세요.
        </div>
      </div>

      <div
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
        onClick={handleCardClick}
      >
        {filteredNotes[currentIndex - 1] && (
          <AdjacentBookPreview
            book={filteredNotes[currentIndex - 1]}
            direction="left"
            onClick={() => goTo(-1)}
          />
        )}

        <BookNoteCard
          coverUrl={currentBook.coverUrl}
          title={currentBook.title}
          author={currentBook.author}
          quote={currentBook.quoteContent}
          review={currentBook.content}
          stage={hasReview ? stage : 'quote'}
          onMoreClick={() => navigate(`/booknotes/full/${currentBook.bookId}`)}
        />

        {filteredNotes[currentIndex + 1] && (
          <AdjacentBookPreview
            book={filteredNotes[currentIndex + 1]}
            direction="right"
            onClick={() => goTo(1)}
          />
        )}
      </div>

      <div className="fixed bottom-24 right-6">
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
