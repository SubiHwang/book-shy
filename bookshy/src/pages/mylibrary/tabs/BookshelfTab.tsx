// src/pages/mylibrary/tabs/BookshelfTab.tsx (새로 만듦)
import React, { useState, useEffect } from 'react';
import BookshelfRow from '@/components/common/BookshelfRow'; // 이미 존재하는 공통 컴포넌트
import { BookType } from '@/types/mylibrary/models';
import { sampleBooks } from '@/data/sampleBooks';

interface BookshelfTabProps {
  filterPublic?: boolean;
}

const BookshelfTab: React.FC<BookshelfTabProps> = ({ filterPublic = false }) => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 데이터 로딩 시뮬레이션
    setIsLoading(true);
    setTimeout(() => {
      const filteredBooks = filterPublic
        ? sampleBooks.filter((book) => book.isPublic)
        : sampleBooks;
      setBooks(filteredBooks);
      setIsLoading(false);
    }, 300);
  }, [filterPublic]);

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
  const shelves = [];

  for (let i = 0; i < Math.ceil(books.length / booksPerShelf); i++) {
    const shelfBooks = books.slice(i * booksPerShelf, (i + 1) * booksPerShelf);
    shelves.push(shelfBooks);
  }

  return (
    <div className="container mx-auto px-4 pb-16 space-y-8">
      {shelves.map((shelfBooks, index) => {
        // BookType을 BookshelfRow 컴포넌트에 필요한 형식으로 변환
        const convertedBooks = shelfBooks.map((book) => ({
          bookId: parseInt(book.id),
          title: book.title,
          author: book.author,
          publisher: book.publisher || '',
          bookImgUrl: book.coverUrl,
        }));

        return <BookshelfRow key={`shelf-${index}`} books={convertedBooks} />;
      })}
    </div>
  );
};

export default BookshelfTab;
