import BookChip from './BookChip';
import type { Library } from '@/types/mylibrary/library';

interface Props {
  selectedBooks: string[];
  toggleBook: (title: string) => void;
  showMyLibrary: boolean;
  setShowMyLibrary: (v: boolean) => void;
  myLibraryBooks: Library[];
  onViewDetail: (book: Library) => void;
}

const BookSelector = ({
  selectedBooks,
  toggleBook,
  showMyLibrary,
  setShowMyLibrary,
  myLibraryBooks,
  onViewDetail,
}: Props) => {
  const defaultBooks: Library[] = [
    {
      libraryId: -1,
      bookId: -1,
      aladinItemId: -1,
      public: false,
      title: '장발장',
      author: '빅토르 위고',
      isbn13: '9788956605950',
      coverImageUrl: 'https://image.aladin.co.kr/product/11455/87/coversum/k922531000_1.jpg',
    },
    {
      libraryId: -2,
      bookId: -2,
      aladinItemId: -2,
      public: false,
      title: '이기적 유전자',
      author: '리처드 도킨스',
      isbn13: '9788926799794',
      coverImageUrl: 'https://image.aladin.co.kr/product/6609/25/coversum/8926799794_1.jpg',
    },
  ];

  return (
    <div className="bg-[#FFFEEC] mt-6 rounded-lg p-4">
      <p className="text-primary font-semibold mb-2">내 책을 선택해주세요</p>
      <p className="text-xs text-light-text-muted mb-4">교환에 사용한 책을 선택해주세요.</p>

      {/* 기본 2권 */}
      <div className="flex gap-4 justify-center mb-4">
        {defaultBooks.map((book) => (
          <BookChip
            key={book.title}
            book={book}
            selected={selectedBooks.includes(book.title)}
            onToggle={toggleBook}
            onViewDetail={onViewDetail}
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
                onViewDetail={onViewDetail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSelector;
