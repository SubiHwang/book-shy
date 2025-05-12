import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLibraryBooks } from '@/services/mybooknote/booknote/library';
import { fetchBookDetailByBookId } from '@/services/book/search';
import { createNoteWithQuote } from '@/services/mybooknote/booknote/booknotequote';
import BookNoteForm from '@/components/mybooknote/booknote/BookNoteForm';
import type { LibraryBook } from '@/types/mybooknote/booknote/library';
import { useState } from 'react';
import Header from '@/components/common/Header';
import BookNoteHeader from '@/components/mybooknote/booknote/BookNoteHeader';

const BookNoteCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const bookIdParam = params.get('bookId');
  const bookId = bookIdParam ? Number(bookIdParam) : null;

  const { data: libraryBooks = [] } = useQuery<LibraryBook[], Error>({
    queryKey: ['library-books'],
    queryFn: () => fetchLibraryBooks(),
    enabled: bookId !== null,
  });

  // 🔄 수정: bookId 기준으로 서재 도서 찾기
  const targetBook =
    bookId !== null ? libraryBooks.find((book) => book.bookId === bookId) : undefined;

  const { data: bookDetail, isLoading } = useQuery({
    queryKey: ['book-detail', bookId],
    queryFn: () => fetchBookDetailByBookId(bookId as number),
    enabled: typeof bookId === 'number',
  });

  const [quoteText, setQuoteText] = useState('');
  const [reviewText, setReviewText] = useState('');
  const queryClient = useQueryClient();

  const handleCreate = async () => {
    if (!bookId) return;

    try {
      await createNoteWithQuote({
        bookId,
        reviewContent: reviewText,
        quoteContent: quoteText,
      });

      // 📦 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['my-booknotes'] });

      alert('📚 독서기록 등록이 완료되었습니다.');
      navigate('/mybooknote');
    } catch (error) {
      console.error('등록 실패:', error);
      alert('❌ 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!bookId) return <p className="p-4">잘못된 접근입니다.</p>;
  if (!targetBook) return <p className="p-4">해당 책이 서재에 없습니다.</p>;

  return (
    <div>
      <Header
        title="독서 기록 작성하기"
        onBackClick={() => navigate(-1)}
        showBackButton={true}
        showNotification={true}
      />

      <BookNoteHeader title={bookDetail?.title} author={bookDetail?.author} publisher={bookDetail?.publisher} coverImageUrl={bookDetail?.coverImageUrl} isLoading={isLoading} />

      <BookNoteForm
        quoteText={quoteText}
        reviewText={reviewText}
        setQuoteText={setQuoteText}
        setReviewText={setReviewText}
        onSubmit={handleCreate}
        submitLabel="등록하기"
      />
    </div>
  );
};

export default BookNoteCreatePage;
