import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBookNoteList } from '@/services/mybooknote/booknote';
import { fetchBookQuote } from '@/services/mybooknote/bookquote';
import type { BookNote } from '@/types/mybooknote/booknote';
import type { BookQuote } from '@/types/mybooknote/bookquote';
import BookNoteCard from '@/components/mybooknote/booknote/BookNoteCard';
import AdjacentBookPreview from '@/components/mybooknote/booknote/AdjacentBookPreview';

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
  if (!currentBook) return <p className="p-4">책 정보를 찾을 수 없습니다.</p>;

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

  return (
    <div
      className="relative h-screen flex items-center justify-center bg-white overflow-hidden"
      onClick={handleClick}
    >
      {/* 왼쪽 책 */}
      {bookNotes[currentIndex - 1] && (
        <AdjacentBookPreview
          book={bookNotes[currentIndex - 1]}
          direction="left"
          onClick={() => goTo(-1)}
        />
      )}

      {/* 중앙 카드 */}
      <BookNoteCard
        coverUrl={currentBook.coverUrl}
        title={currentBook.title}
        author={currentBook.author}
        quote={bookQuote?.content}
        review={currentBook.content}
        stage={stage}
        onMoreClick={() => navigate(`/booknotes/full/${bookId}`)}
      />

      {/* 오른쪽 책 */}
      {bookNotes[currentIndex + 1] && (
        <AdjacentBookPreview
          book={bookNotes[currentIndex + 1]}
          direction="right"
          onClick={() => goTo(1)}
        />
      )}
    </div>
  );
};

export default BookNoteDetailPage;
