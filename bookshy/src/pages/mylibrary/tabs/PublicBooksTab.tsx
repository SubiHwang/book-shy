// src/pages/mylibrary/tabs/PublicMyBooksTab.tsx
import React, { useState, useEffect } from 'react';
import BookShelf from '@/components/mylibrary/BookShelf';
import { BookType } from '@/types/mylibrary/models';
import { sampleBooks } from '@/data/sampleBooks'; // 샘플 데이터

const PublicMyBooksTab: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 데이터 로딩 시뮬레이션
    setIsLoading(true);
    setTimeout(() => {
      // 공개된 책만 필터링
      const publicBooks = sampleBooks.filter((book) => book.isPublic);
      setBooks(publicBooks);
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <div className="public-books-tab">
      <BookShelf books={books} isLoading={isLoading} />
    </div>
  );
};

export default PublicMyBooksTab;
