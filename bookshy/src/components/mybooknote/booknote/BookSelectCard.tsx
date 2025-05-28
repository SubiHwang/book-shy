import type { BookSearchItem } from '@/types/mylibrary/bookSearch';
import { Plus } from 'lucide-react';

interface SearchResultCardProps {
  book: BookSearchItem;
  onSelect?: () => void; // 등록 버튼 클릭 시 실행할 콜백
}

const BookSelectCard: React.FC<SearchResultCardProps> = ({ book, onSelect }) => (
  <div className="flex items-center p-4 bg-white rounded-xl shadow-md">
    <img
      src={book.coverImageUrl}
      alt={book.title}
      className="w-20 h-28 object-cover rounded-md mr-4"
    />
    <div className="flex-1">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">{book.title}</h2>
      <p className="text-sm text-gray-600">작가: {book.author}</p>
      <p className="text-sm text-gray-500 mb-1">{book.publisher}</p>
      <p className="text-sm text-gray-500 line-clamp-2">{book.description}</p>
    </div>
    <button
      onClick={onSelect}
      className="w-10 h-10 rounded-full bg-[#faf7f2] text-gray-600 flex items-center justify-center shadow"
    >
      <Plus size={20} strokeWidth={2} />
    </button>
  </div>
);

export default BookSelectCard;
