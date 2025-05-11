import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBookNoteList, updateBookNote } from '@/services/mybooknote/booknote';
import { fetchBookQuoteList, updateBookQuote } from '@/services/mybooknote/bookquote';
import type { BookNote } from '@/types/mybooknote/booknote';
import type { BookQuote } from '@/types/mybooknote/bookquote';
import BookNoteForm from '@/components/booknote/BookNoteForm';

const BookNoteEditPage: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const { data: notes = [] } = useQuery<BookNote[], Error>({
    queryKey: ['my-booknotes'],
    queryFn: () => fetchBookNoteList(),
  });

  const { data: quotes = [] } = useQuery<BookQuote[], Error>({
    queryKey: ['my-bookquotes'],
    queryFn: fetchBookQuoteList,
  });

  const book = notes.find((b) => b.bookId === Number(bookId));
  const quote = quotes.find((q) => q.bookId === Number(bookId));

  const [quoteText, setQuoteText] = useState(quote?.content ?? '');
  const [reviewText, setReviewText] = useState(book?.content ?? '');

  const handleSave = async () => {
    if (!bookId || !book?.reviewId || !quote?.quoteId) return;
    await updateBookQuote(quote.quoteId, quoteText);
    await updateBookNote(book.reviewId, reviewText);
    navigate(`/booknotes/detail/${bookId}`);
  };

  return (
    <div className="min-h-screen bg-[#f9f4ec] px-4 py-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-gray-600">
        {'< 뒤로가기'}
      </button>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={book?.coverUrl || '/placeholder.jpg'}
          alt={book?.title}
          className="w-20 h-28 rounded-md object-cover"
        />
        <div>
          <h1 className="font-bold text-lg">{book?.title}</h1>
          {book?.author && <p className="text-sm text-gray-600">작가 : {book.author}</p>}
          {book?.publisher && <p className="text-sm text-gray-600">출판사 : {book.publisher}</p>}
        </div>
      </div>

      <BookNoteForm
        quoteText={quoteText}
        reviewText={reviewText}
        setQuoteText={setQuoteText}
        setReviewText={setReviewText}
        onSubmit={handleSave}
        submitLabel="수정하기"
      />
    </div>
  );
};

export default BookNoteEditPage;
