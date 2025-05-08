import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBookNotes } from '@/services/mybooknote/booknote';
import type { BookNote } from '@/types/mybooknote/booknote';
import { IoIosArrowBack } from 'react-icons/io';
import { HiBell } from 'react-icons/hi';

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
    <div className="min-h-screen bg-[#f9f4ec] px-4 pb-28">
      {/* 헤더 */}
      <div className="flex justify-between items-center py-4">
        <button onClick={() => navigate(-1)}>
          <IoIosArrowBack size={24} />
        </button>
        <h1 className="text-lg font-semibold">독서 기록</h1>
        <HiBell size={20} className="text-gray-700" />
      </div>

      {/* 책 정보 */}
      <div className="flex items-start gap-4 bg-[#f9f4ec] mb-4">
        <div className="relative">
          <img
            src={book.coverUrl || '/placeholder.jpg'}
            alt={book.title}
            className="w-24 h-32 rounded-md object-cover shadow"
          />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-14px] bg-[#5a524d] text-white text-xs px-2 py-0.5 rounded-full">
            독서 완료
          </div>
        </div>
        <div className="mt-1">
          <h2 className="font-bold text-xl mb-1">{book.title}</h2>
          {book.author && <p className="text-sm text-gray-700">작가 : {book.author}</p>}
          {book.publisher && <p className="text-sm text-gray-700">출판사 : {book.publisher}</p>}
        </div>
      </div>

      {/* 수정하기 버튼 */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate(`/booknotes/edit/${book.bookId}`)}
          className="text-sm px-4 py-1 bg-gray-200 rounded-full text-gray-700 shadow"
        >
          수정하기
        </button>
      </div>

      {/* 인용구 섹션 */}
      <section className="mb-6">
        <h3 className="text-red-500 text-sm font-semibold mb-1">✍️ 인용구</h3>
        <p className="bg-white rounded-lg p-3 text-sm leading-relaxed shadow">
          {book.quoteContent || '등록된 인용구가 없습니다.'}
        </p>
      </section>

      {/* 감상기록 섹션 */}
      <section>
        <h3 className="text-red-500 text-sm font-semibold mb-1">💬 감상 기록</h3>
        <p className="bg-white rounded-lg p-3 text-sm leading-relaxed shadow">
          {book.content || '작성된 독후감이 없습니다.'}
        </p>
      </section>
    </div>
  );
};

export default BookNoteFullPage;
