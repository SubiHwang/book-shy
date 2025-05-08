import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBookNotes, createBookNote } from '@/services/mybooknote/booknote';
import { fetchBookQuotes, createBookQuote } from '@/services/mybooknote/bookquote';
import type { BookNote } from '@/types/mybooknote/booknote';
import type { BookQuote } from '@/types/mybooknote/bookquote';

const BookNoteCreatePage: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const userId = 1;

  const { data: notes = [] } = useQuery<BookNote[], Error>({
    queryKey: ['my-booknotes', userId],
    queryFn: () => fetchBookNotes(userId),
  });

  const { data: quotes = [] } = useQuery<BookQuote[], Error>({
    queryKey: ['my-bookquotes'],
    queryFn: fetchBookQuotes,
  });

  const book = notes.find((b) => b.bookId === Number(bookId));
  const quote = quotes.find((q) => q.bookId === Number(bookId));

  const [quoteText, setQuoteText] = useState(quote?.content ?? '');
  const [reviewText, setReviewText] = useState(book?.content ?? '');

  const handleSave = async () => {
    if (!bookId) return;
    await createBookQuote(Number(bookId), quoteText);
    await createBookNote(Number(bookId), reviewText, userId);
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

      <section className="mb-6">
        <h2 className="text-red-500 text-sm font-semibold mb-1">✍️ 인용구</h2>
        <textarea
          value={quoteText}
          onChange={(e) => setQuoteText(e.target.value)}
          rows={3}
          maxLength={1000}
          className="w-full p-3 text-sm rounded-lg shadow bg-white"
        />
        <p className="text-xs text-right mt-1">{quoteText.length}/1000</p>
      </section>

      <section className="mb-6">
        <h2 className="text-red-500 text-sm font-semibold mb-1">💬 감상 기록</h2>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={6}
          maxLength={3000}
          className="w-full p-3 text-sm rounded-lg shadow bg-white"
        />
        <p className="text-xs text-right mt-1">{reviewText.length}/3000</p>
      </section>

      <button
        onClick={handleSave}
        className="w-full py-3 text-white bg-pink-500 rounded-lg text-sm font-semibold shadow"
      >
        수정하기
      </button>
    </div>
  );
};

export default BookNoteCreatePage;
