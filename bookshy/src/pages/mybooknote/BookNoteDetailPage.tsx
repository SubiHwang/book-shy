import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBookNotes } from '@/services/mybooknote/booknote';
import { fetchBookQuotes } from '@/services/mybooknote/bookquote';
import type { BookNote } from '@/types/mybooknote/booknote';
import type { BookQuote } from '@/types/mybooknote/bookquote';

const BookNoteDetailPage: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const userId = 1;

  // 📘 currentStage: 'quote' → 'review' → 'full'
  const [stage, setStage] = useState<'quote' | 'review'>('quote');

  const { data: bookNotes = [], isLoading: loadingNotes } = useQuery<BookNote[]>({
    queryKey: ['my-booknotes', userId],
    queryFn: () => fetchBookNotes(userId),
  });

  const { data: bookQuotes = [], isLoading: loadingQuotes } = useQuery<BookQuote[]>({
    queryKey: ['my-bookquotes'],
    queryFn: fetchBookQuotes,
  });

  if (loadingNotes || loadingQuotes) return <p className="p-4">불러오는 중...</p>;

  const currentIndex = bookNotes.findIndex((b) => b.bookId === Number(bookId));
  const currentBook = bookNotes[currentIndex];
  const currentQuote = bookQuotes.find((q) => q.bookId === Number(bookId));

  const goTo = (offset: number) => {
    const newIdx = currentIndex + offset;
    if (bookNotes[newIdx]) {
      navigate(`/booknotes/detail/${bookNotes[newIdx].bookId}`);
      setStage('quote'); // 다시 quote로 초기화
    }
  };

  const handleClick = () => {
    if (stage === 'quote') {
      setStage('review');
    } else {
      navigate(`/booknotes/full/${bookId}`);
    }
  };

  if (!currentBook) return <p>책 정보를 찾을 수 없습니다.</p>;

  return (
    <div
      className="relative h-screen flex items-center justify-center bg-white"
      onClick={handleClick}
    >
      {/* 왼쪽 이전 책 커버 */}
      {bookNotes[currentIndex - 1] && (
        <img
          src={bookNotes[currentIndex - 1].coverUrl}
          alt=""
          className="absolute left-2 top-1/2 w-12 h-20 object-cover opacity-50 -translate-y-1/2"
          onClick={(e) => {
            e.stopPropagation();
            goTo(-1);
          }}
        />
      )}

      {/* 중앙 카드 */}
      <div className="w-[280px] h-[420px] rounded-2xl shadow-xl relative overflow-hidden">
        {/* 배경 이미지 */}
        <img
          src={currentBook.coverUrl || '/placeholder.jpg'}
          alt={currentBook.title}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* 흐림처리된 반투명 배경 */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />

        {/* 인용구 뷰 */}
        <div
          className={`absolute inset-0 z-20 w-full h-full flex flex-col justify-center items-center px-6 text-white text-center transition-opacity duration-300 ${
            stage === 'quote' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <p className="text-xs mb-1">{currentBook.author}</p>
          <h2 className="font-semibold text-sm mb-2">{currentBook.title} 중에서</h2>
          <p className="text-sm leading-tight">
            {currentQuote?.content || '등록된 인용구가 없습니다.'}
          </p>
        </div>

        {/* 독후감 뷰 */}
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

      {/* 오른쪽 다음 책 커버 */}
      {bookNotes[currentIndex + 1] && (
        <img
          src={bookNotes[currentIndex + 1].coverUrl}
          alt=""
          className="absolute right-2 top-1/2 w-12 h-20 object-cover opacity-50 -translate-y-1/2"
          onClick={(e) => {
            e.stopPropagation();
            goTo(1);
          }}
        />
      )}
    </div>
  );
};

export default BookNoteDetailPage;
