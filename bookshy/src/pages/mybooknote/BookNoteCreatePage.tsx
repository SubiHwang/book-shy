import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchLibraryBooks } from '@/services/mybooknote/library';
import { fetchBookDetailByItemId } from '@/services/book/search';
import { createBookNote } from '@/services/mybooknote/booknote';
import { createBookQuote } from '@/services/mybooknote/bookquote';
import BookNoteForm from '@/components/booknote/BookNoteForm';
import type { LibraryBook } from '@/types/mybooknote/library';
import { useState } from 'react';

const BookNoteCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const userId = 1;
  const [params] = useSearchParams();

  const bookIdParam = params.get('bookId');
  const libraryId = bookIdParam ? Number(bookIdParam) : null;

  const { data: libraryBooks = [] } = useQuery<LibraryBook[], Error>({
    queryKey: ['library-books'],
    queryFn: () => fetchLibraryBooks(userId),
    enabled: !!libraryId, // ✅ libraryId 있을 때만 실행
  });

  const targetBook = libraryId
    ? libraryBooks.find((book) => book.libraryId === libraryId)
    : undefined;

  const itemId = targetBook?.aladinItemId;

  const { data: bookDetail } = useQuery({
    queryKey: ['book-detail', targetBook?.aladinItemId],
    queryFn: () => fetchBookDetailByItemId(itemId as number),
    enabled: !!targetBook?.aladinItemId,
  });

  const [quoteText, setQuoteText] = useState('');
  const [reviewText, setReviewText] = useState('');

  const handleCreate = async () => {
    if (!targetBook) return;
    await createBookQuote(targetBook.libraryId, quoteText);
    await createBookNote(targetBook.libraryId, reviewText, userId);
    navigate('/booknote');
  };

  // ❗조건에 따라 렌더링만 분기
  if (!libraryId) return <p className="p-4">잘못된 접근입니다.</p>;
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
