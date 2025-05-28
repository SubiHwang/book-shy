import BookChip from './BookChip';
import type { Library } from '@/types/mylibrary/library';

interface Props {
  selectedBooks: string[];
  toggleBook: (title: string) => void;
  showMyLibrary: boolean;
  setShowMyLibrary: (v: boolean) => void;
  myLibraryBooks: Library[];
  defaultBooks: Library[];
}

const BookSelector = ({
  selectedBooks,
  toggleBook,
  showMyLibrary,
  setShowMyLibrary,
  myLibraryBooks,
  defaultBooks,
}: Props) => {
  return (
    <div className="bg-[#FFFEEC] mt-6 rounded-lg p-4">
      <p className="text-primary font-semibold mb-2">내 책을 선택해주세요</p>
      <p className="text-xs text-light-text-muted mb-4">교환에 사용한 책을 선택해주세요.</p>

      {/* 매칭 당시 도서들 */}
      <div className="flex gap-4 justify-center mb-4 flex-wrap">
        {defaultBooks.map((book) => (
          <BookChip
            key={book.title}
            book={book}
            selected={selectedBooks.includes(book.title)}
            onToggle={toggleBook}
          />
        ))}
      </div>

      {/* 매칭 외 서재 */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">매칭 외의 책도 교환하셨나요?</p>
          <button
            onClick={() => setShowMyLibrary(!showMyLibrary)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors
              ${
                showMyLibrary
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
          >
            {showMyLibrary ? '숨기기 ▲' : '펼치기 ▼'}
          </button>
        </div>

        {showMyLibrary && (
          <div className="mt-3 flex flex-wrap gap-3">
            {myLibraryBooks.map((book) => (
              <BookChip
                key={book.libraryId}
                book={book}
                selected={selectedBooks.includes(book.title)}
                onToggle={toggleBook}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSelector;
