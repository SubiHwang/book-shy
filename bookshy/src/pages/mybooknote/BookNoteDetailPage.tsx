import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBookNoteList } from '@/services/mybooknote/booknote';
import { fetchBookQuote } from '@/services/mybooknote/bookquote';
import type { BookNote } from '@/types/mybooknote/booknote';
import type { BookQuote } from '@/types/mybooknote/bookquote';

const BookNoteDetailPage: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [stage, setStage] = useState<'quote' | 'review'>('quote');

  const numericBookId = bookId ? Number(bookId) : null;

  const { data: bookNotes = [], isLoading: loadingNotes } = useQuery<BookNote[]>({
    queryKey: ['my-booknotes'],
    queryFn: fetchBookNoteList,
  });

  const { data: bookQuote, isLoading: loadingQuote } = useQuery<BookQuote>({
    queryKey: ['book-quote', numericBookId],
    queryFn: () => fetchBookQuote(numericBookId as number),
    enabled: typeof numericBookId === 'number',
  });

  if (loadingNotes || loadingQuote) return <p className="p-4">불러오는 중...</p>;
  if (!numericBookId) return <p className="p-4">잘못된 접근입니다.</p>;

  const currentIndex = bookNotes.findIndex((b) => b.bookId === numericBookId);
  const currentBook = bookNotes[currentIndex];

  const goTo = (offset: number) => {
    const newIdx = currentIndex + offset;
    if (bookNotes[newIdx]) {
      navigate(`/booknotes/detail/${bookNotes[newIdx].bookId}`);
      setStage('quote');
    }
  };

  const handleClick = () => {
    if (stage === 'quote') {
      setStage('review');
    } else {
      navigate(`/booknotes/full/${bookId}`);
    }
  };

  if (!currentBook) return <p className="p-4">책 정보를 찾을 수 없습니다.</p>;

  return (
    <div
      className="relative h-screen flex items-center justify-center bg-white overflow-hidden"
      onClick={handleClick}
    >
      {/* 왼쪽 책 */}
      {bookNotes[currentIndex - 1] && (
        <div className="absolute left-0 top-1/2 w-[280px] h-[420px] -translate-y-1/2 scale-75 opacity-40 overflow-hidden rounded-2xl">
          <img
            src={bookNotes[currentIndex - 1].coverUrl || '/placeholder.jpg'}
            alt=""
            className="w-full h-full object-cover"
            onClick={(e) => {
              e.stopPropagation();
              goTo(-1);
            }}
          />
        </div>
      )}

      {/* 중앙 카드 */}
      <div className="w-[280px] h-[420px] rounded-2xl shadow-xl relative overflow-hidden z-10">
        <img
          src={currentBook.coverUrl || '/placeholder.jpg'}
          alt={currentBook.title}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />

        {/* 인용구 화면 */}
        <div
          className={`absolute inset-0 z-20 w-full h-full flex flex-col justify-center items-center px-6 text-white text-center transition-opacity duration-300 ${
            stage === 'quote' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <p className="text-xs mb-1">{currentBook.author}</p>
          <h2 className="font-semibold text-sm mb-2">{currentBook.title} 중에서</h2>
          <p className="text-sm leading-tight">
            {bookQuote?.content || '등록된 인용구가 없습니다.'}
          </p>
        </div>

        {/* 독후감 화면 */}
        <div
          className={`absolute inset-0 z-20 w-full h-full flex flex-col justify-center items-center px-6 text-white text-center transition-opacity duration-300 ${
            stage === 'review' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <h2 className="font-bold text-lg mb-2">{currentBook.title}</h2>
          <p className="text-sm line-clamp-6">{currentBook.content}</p>
          <p className="text-right text-xs text-white/80 mt-4 w-full">더 보기 →</p>
        </div>
      </div>

      {/* 오른쪽 책 */}
      {bookNotes[currentIndex + 1] && (
        <div className="absolute right-0 top-1/2 w-[280px] h-[420px] -translate-y-1/2 scale-75 opacity-40 overflow-hidden rounded-2xl">
          <img
            src={bookNotes[currentIndex + 1].coverUrl || '/placeholder.jpg'}
            alt=""
            className="w-full h-full object-cover"
            onClick={(e) => {
              e.stopPropagation();
              goTo(1);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default BookNoteDetailPage;
