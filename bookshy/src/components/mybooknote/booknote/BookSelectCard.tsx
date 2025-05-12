// @/components/booknote/BookSelectCard.tsx
import { useNavigate } from 'react-router-dom';
import type { UnwrittenLibraryBook } from '@/types/mybooknote/booknote/library';

interface BookSelectCardProps {
  book: UnwrittenLibraryBook;
}

const BookSelectCard: React.FC<BookSelectCardProps> = ({ book }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex gap-3">
        <img src={book.coverImageUrl} alt={book.title} className="w-16 h-24 object-cover rounded" />
        <div>
          <h2 className="font-bold text-lg">{book.title}</h2>
          <p className="text-sm text-gray-600">작가: {book.author}</p>
          <p className="text-sm text-gray-500 line-clamp-2">{book.description}</p>
        </div>
      </div>
      <button onClick={() => navigate(`/booknotes/create?bookId=${book.bookId}`)} className="p-2">
        <img src="/icons/plus-circle.svg" alt="추가" className="w-8 h-8" />
      </button>
    </div>
  );
};

export default BookSelectCard;
