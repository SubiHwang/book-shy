import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBookNotes } from '@/services/mybooknote/booknote';
import type { BookNote } from '@/types/mybooknote/booknote';

const BookNoteFullPage: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const userId = 1;

  const { data: bookNotes = [], isLoading } = useQuery<BookNote[], Error>({
    queryKey: ['my-booknotes', userId],
    queryFn: () => fetchBookNotes(userId),
  });

  const book = bookNotes.find((b) => b.bookId === Number(bookId));

  if (isLoading) return <p className="p-4">불러오는 중...</p>;
  if (!book) return <p className="p-4">책 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="min-h-screen bg-[#f9f4ec] px-4 py-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-gray-600">
        {'< 뒤로가기'}
      </button>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={book.coverUrl || '/placeholder.jpg'}
          alt={book.title}
          className="w-20 h-28 rounded-md object-cover"
        />
        <div>
          <h1 className="font-bold text-lg">{book.title}</h1>
          {book.author && <p className="text-sm text-gray-600">작가 : {book.author}</p>}
          {book.publisher && <p className="text-sm text-gray-600">출판사 : {book.publisher}</p>}
        </div>
      </div>

      <button
        onClick={() => navigate(`/booknotes/edit/${book.bookId}`)}
        className="px-4 py-2 text-sm bg-gray-200 rounded-full mb-6"
      >
        수정하기
      </button>

      <section className="mb-6">
        <h2 className="text-red-500 text-sm font-semibold mb-1">✍️ 인용구</h2>
        <p className="bg-white rounded-lg p-3 text-sm leading-relaxed shadow-sm">
          {book.quoteContent || '등록된 인용구가 없습니다.'}
        </p>
      </section>

      <section>
        <h2 className="text-red-500 text-sm font-semibold mb-1">💬 감상 기록</h2>
        <p className="bg-white rounded-lg p-3 text-sm leading-relaxed shadow-sm">
          {book.content || '작성된 독후감이 없습니다.'}
        </p>
      </section>
    </div>
  );
};

export default BookNoteFullPage;
