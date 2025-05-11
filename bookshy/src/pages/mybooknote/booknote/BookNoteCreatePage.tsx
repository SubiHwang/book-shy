import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchLibraryBooks } from '@/services/mybooknote/library';
import { fetchBookDetailByBookId } from '@/services/book/search';
import { createNoteWithQuote } from '@/services/mybooknote/booknotequote';
import BookNoteForm from '@/components/mybooknote/booknote/BookNoteForm';
import type { LibraryBook } from '@/types/mybooknote/library';
import { useState } from 'react';

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

  const { data: bookDetail } = useQuery({
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
    <div className="min-h-screen bg-[#f9f4ec] px-4 py-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-gray-600">
        {'< 뒤로가기'}
      </button>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={bookDetail?.coverImageUrl || '/placeholder.jpg'}
          alt={bookDetail?.title}
          className="w-20 h-28 rounded-md object-cover"
        />
        <div>
          <h1 className="font-bold text-lg">{bookDetail?.title}</h1>
          {bookDetail?.author && (
            <p className="text-sm text-gray-600">작가 : {bookDetail.author}</p>
          )}
          {bookDetail?.publisher && (
            <p className="text-sm text-gray-600">출판사 : {bookDetail.publisher}</p>
          )}
        </div>
      </div>

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
