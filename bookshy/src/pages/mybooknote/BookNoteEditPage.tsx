import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchBookNote, updateBookNote } from '@/services/mybooknote/booknote';
import { fetchBookQuote, updateBookQuote } from '@/services/mybooknote/bookquote';
import BookNoteForm from '@/components/booknote/BookNoteForm';
import BookNoteHeaderCard from '@/components/booknote/BookNoteHeaderCard';
import BookNoteLayout from '@/components/booknote/BookNoteLayout';

const BookNoteEditPage: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const numericBookId = bookId ? Number(bookId) : null;

  const { data: book, isLoading: loadingNote } = useQuery({
    queryKey: ['book-note', numericBookId],
    queryFn: () => fetchBookNote(numericBookId as number),
    enabled: typeof numericBookId === 'number',
  });

  const { data: quote, isLoading: loadingQuote } = useQuery({
    queryKey: ['book-quote', numericBookId],
    queryFn: () => fetchBookQuote(numericBookId as number),
    enabled: typeof numericBookId === 'number',
  });

  const [quoteText, setQuoteText] = useState('');
  const [reviewText, setReviewText] = useState('');

  // 초기화
  useState(() => {
    if (quote?.content) setQuoteText(quote.content);
    if (book?.content) setReviewText(book.content);
  });

  const handleSave = async () => {
    if (!book || !book.reviewId || !quote || !quote.quoteId) return;
    await updateBookQuote(quote.quoteId, quoteText);
    await updateBookNote(book.reviewId, reviewText);
    navigate(`/booknotes/detail/${bookId}`);
  };

  if (!bookId || loadingNote || loadingQuote) return <p className="p-4">불러오는 중...</p>;
  if (!book) return <p className="p-4">책 정보를 찾을 수 없습니다.</p>;

  return (
    <BookNoteLayout
      header={
        <>
          <button onClick={() => navigate(-1)} className="mb-4 text-sm text-gray-600">
            {'< 뒤로가기'}
          </button>
          <BookNoteHeaderCard
            title={book.title}
            author={book.author}
            publisher={book.publisher}
            coverUrl={book.coverUrl}
            badgeText="독서 완료"
          />
        </>
      }
    >
      <BookNoteForm
        quoteText={quoteText}
        reviewText={reviewText}
        setQuoteText={setQuoteText}
        setReviewText={setReviewText}
        onSubmit={handleSave}
        submitLabel="수정하기"
      />
    </BookNoteLayout>
  );
};

export default BookNoteEditPage;
