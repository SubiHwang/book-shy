import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchBookDetailByBookId } from '@/services/book/search';
import { createNoteWithQuote } from '@/services/mybooknote/booknote/booknotequote';
import BookNoteForm from '@/components/mybooknote/booknote/BookNoteForm';
import Header from '@/components/common/Header';
import BookNoteHeader from '@/components/mybooknote/booknote/BookNoteHeader';
import { useState } from 'react';
import { toast } from 'react-toastify';

const BookNoteCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const bookIdParam = params.get('bookId');
  const bookId = bookIdParam ? Number(bookIdParam) : null;

  const { data: bookDetail, isLoading } = useQuery({
    queryKey: ['book-detail', bookId],
    queryFn: () => fetchBookDetailByBookId(bookId!),
    enabled: bookId !== null,
  });

  const [quoteText, setQuoteText] = useState('');
  const [reviewText, setReviewText] = useState('');
  const queryClient = useQueryClient();

  const handleCreate = async () => {
    if (!bookId) return;

    try {
      await createNoteWithQuote({
        bookId: bookId,
        reviewContent: reviewText,
        quoteContent: quoteText,
      });

      queryClient.invalidateQueries({ queryKey: ['my-booknotes'] });
      queryClient.invalidateQueries({ queryKey: ['my-bookquotes'] });
      queryClient.invalidateQueries({ queryKey: ['book-note', bookId] });
      queryClient.invalidateQueries({ queryKey: ['book-quote', bookId] });

      toast.success('독서기록 등록이 완료되었습니다.');
      navigate('/booknotes');
    } catch (error) {
      console.error('등록 실패:', error);
    }
  };

  if (!bookId) return <p className="p-4">잘못된 접근입니다.</p>;

  return (
    <div className="pb-32">
      {' '}
      {/* 👈 하단 탭바만큼 여백 확보 */}
      <Header
        title="독서 기록 작성하기"
        onBackClick={() => navigate('/booknotes')}
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
