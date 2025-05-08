// src/components/mylibrary/BookAdd/BookSearchItem.tsx
import { FC } from 'react';
import { Plus } from 'lucide-react';
import type { BookSearchItem } from '@/types/mylibrary/bookSearch';

interface BookSearchItemProps {
  book: BookSearchItem;
  onAddBook: (itemId: number) => void;
}

const BookSearchItem: FC<BookSearchItemProps> = ({ book, onAddBook }) => {
  return (
    <div className="card flex items-center justify-between p-4 mb-4 w-full">
      {/* Book Image */}
      <div className="flex-shrink-0 w-24 h-32 mr-4">
        <img
          src={book.coverImageUrl}
          alt={book.title}
          className="w-full h-full object-cover rounded-md shadow-sm"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-book.jpg'; // 이미지 로드 실패 시 대체 이미지
          }}
        />
      </div>

      {/* Book Info */}
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-light-text mb-1 truncate">{book.title}</h3>
        <p className="text-sm font-light text-light-text-muted mb-1">저자: {book.author}</p>
        <p className="text-sm font-light text-light-text-muted mb-1">출판사: {book.publisher}</p>
        {book.description && (
          <p className="text-xs text-light-text-muted line-clamp-2">{book.description}</p>
        )}
      </div>

      {/* Add (+) Button */}
      <div className="flex-shrink-0 ml-4">
        <button
          className="p-2 rounded-full bg-light-bg-shade"
          onClick={() => onAddBook(book.itemId)}
        >
          <Plus className="w-6 h-6 text-primary" strokeWidth={1} />
        </button>
      </div>
    </div>
  );
};

export default BookSearchItem;
