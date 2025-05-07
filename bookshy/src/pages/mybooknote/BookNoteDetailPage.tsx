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
  const [showReview, setShowReview] = useState(false);
  const userId = 1;

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
      setShowReview(false);
    }
  };

  if (!currentBook) return <p>책 정보를 찾을 수 없습니다.</p>;

  return (
    <div
      className="relative h-screen flex items-center justify-center bg-white"
      onClick={() => setShowReview((prev) => !prev)}
    >
      {/* 좌측 책 */}
      {bookNotes[currentIndex - 1] && (
        <img
          src={bookNotes[currentIndex - 1].coverUrl}
          alt=""
          className="absolute left-2 top-1/2 w-12 h-20 object-cover opacity-50"
          onClick={(e) => {
            e.stopPropagation();
            goTo(-1);
          }}
        />
      )}

      {/* 중앙 카드 */}
      <div className="w-[280px] h-[420px] rounded-2xl shadow-xl bg-white/80 backdrop-blur p-6 text-center">
        {showReview ? (
          <>
            <h2 className="font-bold text-lg mb-2">{currentBook.title}</h2>
            <p className="text-sm text-gray-800">{currentBook.content}</p>
            <p className="text-right text-sm text-blue-600 mt-4">더 보기 →</p>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-600 mb-1">{currentBook.author}</p>
            <h2 className="font-bold text-lg mb-3">{currentBook.title} 중에서</h2>
            <p className="text-base font-medium text-gray-700">
              {currentQuote?.content || '등록된 인용구가 없습니다.'}
            </p>
          </>
        )}
      </div>

      {/* 우측 책 */}
      {bookNotes[currentIndex + 1] && (
        <img
          src={bookNotes[currentIndex + 1].coverUrl}
          alt=""
          className="absolute right-2 top-1/2 w-12 h-20 object-cover opacity-50"
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
