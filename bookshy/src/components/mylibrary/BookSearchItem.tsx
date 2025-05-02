import { FC } from 'react';
import { Plus } from 'lucide-react';

interface Book {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  hasBadge: boolean;
  badge: string;
}

interface BookSearchItemProps {
  book: Book;
  onAddBook: (id: number) => void;
}

const BookSearchItem: FC<BookSearchItemProps> = ({ book, onAddBook }) => {
  return (
    <div className="bg-white rounded-lg shadow p-3 flex items-center">
      <div className="relative mr-4">
        <img src={book.coverUrl} alt={book.title} className="w-16 h-24 object-cover rounded-md" />
        {book.hasBadge && (
          <div className="absolute top-0 left-0 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded-sm">
            {book.badge}
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-sm">{book.title}</h3>
        <p className="text-gray-400 text-xs mt-1">{book.author}</p>
      </div>
      <button
        className="p-1 rounded-full border border-gray-200"
        onClick={() => onAddBook(book.id)}
      >
        <Plus size={16} className="text-gray-400" />
      </button>
    </div>
  );
};

export default BookSearchItem;
