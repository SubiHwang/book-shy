// src/pages/mylibrary/tabs/AllMyBooksTab.tsx
import React, { useState, useEffect } from 'react';
import BookShelf from '@/components/mylibrary/BookShelf';
import { BookType } from '@/types/mylibrary/models';
import { sampleBooks } from '@/data/sampleBooks';

const AllMyBooksTab: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 데이터 로딩 시뮬레이션
    setIsLoading(true);
    setTimeout(() => {
      setBooks(sampleBooks);
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <div className="all-books-tab">
      <BookShelf books={books} isLoading={isLoading} />
    </div>
  );
};

export default AllMyBooksTab;
