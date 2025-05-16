// src/components/mylibrary/BookAdd/BookSearchItem.tsx
import { FC } from 'react';
import { Plus, Check } from 'lucide-react';
import type { BookSearchItem } from '@/types/mylibrary/bookSearch';

interface BookSearchItemProps {
  book: BookSearchItem;
  onAddBook: (itemId: number) => void;
  onItemClick?: (itemId: number) => void;
}

const BookSearchItem: FC<BookSearchItemProps> = ({ book, onAddBook, onItemClick }) => {
  // 아이템 클릭 핸들러
  const handleItemClick = () => {
    if (onItemClick && book.itemId) {
      onItemClick(book.itemId);
    }
  };

  // 추가 버튼 클릭 핸들러
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // 이미 서재에 있으면 아무 동작도 하지 않음
    if (book.inLibrary) return;

    // 서재에 추가
    onAddBook(book.itemId);
  };

  return (
    <div
      // 서재에 추가된 책은 배경색을 회색으로 변경
      className={`card flex items-center justify-between p-4 mb-4 w-full cursor-pointer ${
        book.inLibrary ? 'bg-gray-200' : ''
      }`}
      onClick={handleItemClick}
    >
      {/* Book Image */}
      <div className="flex-shrink-0 w-24 h-32 mr-4">
        <img
          src={book.coverImageUrl}
          alt={book.title}
          className="w-full h-full object-cover rounded-md shadow-sm"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-book.jpg';
          }}
        />
      </div>

      {/* Book Info */}
      <div className="flex-grow min-w-0 pr-2">
        <h3 className="text-base font-medium text-light-text mb-1 truncate" title={book.title}>
          {book.title}
        </h3>
        <p className="text-xs text-light-text-secondary mb-1 truncate">{book.author}</p>
        <p className="text-xs text-light-text-muted mb-1 truncate">{book.publisher}</p>
        {book.description && (
          <p
            className="text-xs text-gray-500 line-clamp-2 overflow-hidden mb-1"
            title={book.description}
          >
            {book.description}
          </p>
        )}
      </div>

      <div className="flex-shrink-0 ml-4">
        {book.inLibrary ? (
          // 이미 서재에 있으면 체크 아이콘만 표시 (클릭 불가)
          <div
            className="p-2 rounded-full bg-gray-200 bg-opacity-70 shadow-sm"
            title="내 서재에 담긴 책"
          >
            <Check className="w-6 h-6 text-gray-600" strokeWidth={2} />
          </div>
        ) : (
          // 서재에 없으면 추가 버튼 표시
          <button
            className="p-2 rounded-full bg-light-bg-shade hover:bg-gray-200 transition"
            onClick={handleAddClick}
            title="서재에 추가"
          >
            <Plus className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
};

export default BookSearchItem;
