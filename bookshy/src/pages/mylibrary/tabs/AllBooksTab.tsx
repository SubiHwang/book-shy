import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '@/types/book/book';
import { sampleBooks } from '@/data/sampleBooks';
import BookshelfRow from '@/components/common/BookshelfRow';

const AllMyBooksTab: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 데이터 로딩 시뮬레이션
    setIsLoading(true);
    setTimeout(() => {
      // sampleBooks에서 Book 타입으로 변환
      const convertedBooks: Book[] = sampleBooks.map((book) => ({
        bookId: parseInt(book.id),
        title: book.title,
        author: book.author,
        publisher: book.publisher || '',
        bookImgUrl: book.coverUrl,
      }));

      setBooks(convertedBooks);
      setIsLoading(false);
    }, 300);
  }, []);

  // 책 선택 처리 함수 => 책 상세 페이지로 이동
  // 나중에 bookshelfrow에다가 넣어야 할 것 같음..
  const handleBookClick = (bookId: number) => {
    navigate(`/bookshelf/books/${bookId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 text-sm">책을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <svg
          className="w-16 h-16 text-gray-300 mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-800 mb-2">아직 등록된 책이 0권이네요!</h3>
        <p className="text-gray-500 text-sm mb-5 max-w-xs">
          첫 번째 책을 추가하고 독서 여정을 시작해보세요.
        </p>
      </div>
    );
  }

  // 책을 3권씩 선반에 나누기
  const booksPerShelf = 3;
  const shelves: (Book | null)[][] = [];

  for (let i = 0; i < Math.ceil(books.length / booksPerShelf); i++) {
    const shelfBooks = books.slice(i * booksPerShelf, (i + 1) * booksPerShelf);
    // 각 선반마다 책 3권을 채우기 위해 null 추가
    const filledShelf: (Book | null)[] = [...shelfBooks];
    while (filledShelf.length < booksPerShelf) {
      filledShelf.push(null);
    }
    shelves.push(filledShelf);
  }

  return (
    <div className="all-books-tab">
      <div className="container mx-auto px-4 pb-16 space-y-8">
        {shelves.map((shelfBooks, index) => (
          <div key={`shelf-${index}`} className="relative">
            <BookshelfRow books={shelfBooks} />

            {/* 클릭 영역 오버레이 */}
            <div className="absolute top-0 left-0 right-0 flex justify-center items-start z-10">
              {shelfBooks.map((book, bookIndex) => (
                <div
                  key={`book-overlay-${bookIndex}`}
                  className={`mx-2 w-24 h-40 ${book ? 'cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors rounded' : ''}`}
                  onClick={() => book && handleBookClick(book.bookId)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMyBooksTab;
