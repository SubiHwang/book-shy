import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchUnwrittenBooks } from '@/services/mybooknote/library';
import type { UnwrittenLibraryBook } from '@/types/mybooknote/library';
import BookSelectCard from '@/components/mybooknote/booknote/BookSelectCard';

const BookNoteSelectPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: books = [] } = useQuery<UnwrittenLibraryBook[]>({
    queryKey: ['unwritten-books'],
    queryFn: fetchUnwrittenBooks,
  });

  return (
    <div className="min-h-screen bg-[#fffaf7] pb-20">
      <div className="bg-[#f4b9c3] px-4 py-6 text-white">
        <button onClick={() => navigate(-1)} className="text-lg mb-2">
          {'<'} 뒤로가기
        </button>
        <h1 className="text-xl font-bold">읽었던 책을 검색 하세요.</h1>
        <input
          type="text"
          placeholder="구병모"
          className="mt-4 w-full px-4 py-2 rounded-md text-black"
        />
      </div>

      <div className="px-4 mt-4 space-y-4">
        {books.map((book) => (
          <BookSelectCard key={book.bookId} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookNoteSelectPage;
