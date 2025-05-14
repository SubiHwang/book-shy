import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLibraryBooks } from '@/services/mybooknote/booknote/library';
import { fetchBookDetailByBookId } from '@/services/book/search';
import { createNoteWithQuote } from '@/services/mybooknote/booknote/booknotequote';
import BookNoteForm from '@/components/mybooknote/booknote/BookNoteForm';
import Header from '@/components/common/Header';
import BookNoteHeader from '@/components/mybooknote/booknote/BookNoteHeader';
import { useState } from 'react';

const BookNoteCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const libraryIdParam = params.get('libraryId');
  const libraryId = libraryIdParam ? Number(libraryIdParam) : null;

  const { data: libraryBooks = [] } = useQuery({
    queryKey: ['library-books'],
    queryFn: fetchLibraryBooks,
    enabled: libraryId !== null,
  });

  const targetBook = libraryBooks.find((book) => book.libraryId === libraryId);

  const { data: bookDetail, isLoading } = useQuery({
    queryKey: ['book-detail', targetBook?.bookId],
    queryFn: () => fetchBookDetailByBookId(targetBook!.bookId),
    enabled: !!targetBook,
  });

  const [quoteText, setQuoteText] = useState('');
  const [reviewText, setReviewText] = useState('');
  const queryClient = useQueryClient();

  const handleCreate = async () => {
    if (!libraryId) return;

    try {
      await createNoteWithQuote({
        bookId: targetBook!.bookId,
        reviewContent: reviewText,
        quoteContent: quoteText,
      });
      queryClient.invalidateQueries({ queryKey: ['book-note', libraryId] });
      queryClient.invalidateQueries({ queryKey: ['book-quote', libraryId] });
      alert('📚 독서기록 등록이 완료되었습니다.');
      navigate('/booknotes');
    } catch (error) {
      console.error('등록 실패:', error);
      alert('❌ 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!libraryId) return <p className="p-4">잘못된 접근입니다.</p>;
  if (!targetBook) return <p className="p-4">해당 책이 서재에 없습니다.</p>;

  return (
    <div>
      <Header
        title="독서 기록 작성하기"
        onBackClick={() => navigate(-1)}
        showBackButton
        showNotification
      />
      <BookNoteHeader
        title={bookDetail?.title}
        author={bookDetail?.author}
        publisher={bookDetail?.publisher}
        coverImageUrl={bookDetail?.coverImageUrl}
        isLoading={isLoading}
      />
      <BookNoteForm
        quoteText={quoteText}
        reviewText={reviewText}
        setQuoteText={setQuoteText}
        setReviewText={setReviewText}
        onSubmit={handleCreate}
        onCancel={() => navigate(-1)}
        submitLabel="등록하기"
      />
    </div>
  );
};

export default BookNoteCreatePage;
