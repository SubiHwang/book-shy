import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { fetchBookNote } from '@/services/mybooknote/booknote/booknote';
import { fetchBookQuote } from '@/services/mybooknote/booknote/bookquote';
import { updateNoteWithQuote } from '@/services/mybooknote/booknote/booknotequote';
import BookNoteForm from '@/components/mybooknote/booknote/BookNoteForm';
import BookNoteHeaderCard from '@/components/mybooknote/booknote/BookNoteHeaderCard';
import BookNoteLayout from '@/components/mybooknote/booknote/BookNoteLayout';

const BookNoteEditPage: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  // ✅ 데이터 초기화 (quote, book이 불러와진 뒤에만)
  useEffect(() => {
    if (quote?.content !== undefined) setQuoteText(quote.content);
    if (book?.content !== undefined) setReviewText(book.content);
  }, [quote, book]);

  const handleSave = async () => {
    if (!book?.reviewId || !quote?.quoteId) return;

    try {
      await updateNoteWithQuote({
        reviewId: book.reviewId,
        quoteId: quote.quoteId,
        reviewContent: reviewText,
        quoteContent: quoteText,
      });

      // ✅ 수정 후 쿼리 무효화 (React Query 캐시 새로고침)
      queryClient.invalidateQueries({ queryKey: ['book-note'] });
      queryClient.invalidateQueries({ queryKey: ['book-quote'] });

      alert('독서 기록을 수정하였습니다.');
      navigate(`/booknotes/detail/${bookId}`);
    } catch (error) {
      console.error('수정 실패:', error);
      alert('독서 기록 수정에 실패하였습니다.');
    }
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
