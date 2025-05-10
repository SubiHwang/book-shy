import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchUnwrittenBooks } from '@/services/mybooknote/library';
import type { UnwrittenLibraryBook } from '@/types/mybooknote/library';

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
          <div
            key={book.bookId}
            className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between"
          >
            <div className="flex gap-3">
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-16 h-24 object-cover rounded"
              />
              <div>
                <h2 className="font-bold text-lg">{book.title}</h2>
                <p className="text-sm text-gray-600">작가: {book.author}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{book.description}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/booknotes/create?bookId=${book.bookId}`)}
              className="p-2"
            >
              <img src="/icons/plus-circle.svg" alt="추가" className="w-8 h-8" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookNoteSelectPage;
