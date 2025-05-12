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
    <div className="card flex items-center justify-between p-4 mb-4 w-full cursor-pointer">
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
      <div className="flex-grow min-w-0 pr-2">
        <h3 className="text-base font-medium text-gray-800 mb-1 truncate" title={book.title}>
          {book.title}
        </h3>
        <p className="text-xs text-gray-600 mb-1 truncate">{book.author}</p>
        <p className="text-xs text-gray-500 mb-1 truncate">{book.publisher}</p>
        {book.description && (
          <p
            className="text-xs text-gray-500 line-clamp-2 overflow-hidden mb-1"
            title={book.description}
          >
            {book.description}
          </p>
        )}
      </div>

      {/* Add (+) Button */}
      <div className="flex-shrink-0 ml-4">
        <button
          className="p-2 rounded-full bg-light-bg-shade hover:bg-gray-200"
          onClick={(e) => {
            e.stopPropagation(); // 버튼 클릭이 카드 클릭 이벤트를 방해하지 않도록
            onAddBook(book.itemId);
          }}
        >
          <Plus className="w-6 h-6 text-primary" strokeWidth={1} />
        </button>
      </div>
    </div>
  );
};

export default BookSearchItem;
