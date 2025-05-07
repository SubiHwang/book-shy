// src/pages/mylibrary/tabs/AllBooksTab.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LibraryBookshelfRow from '@/components/mylibrary/BookShelf/LibraryBookshelfRow';
import { fetchUserLibrary } from '@/services/mylibrary/libraryApi';
import { useAuth } from '@/contexts/AuthContext';
import type { Library } from '@/types/mylibrary/library';

const AllMyBooksTab: React.FC = () => {
  const [books, setBooks] = useState<Library[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        // 개발 중이므로 기본 사용자 ID 사용 (로그인 없이 테스트 가능)
        const userId = Number(user?.id) || 1; // 숫자로 처리

        // API 호출하여 책 데이터 가져오기
        const libraryBooks = await fetchUserLibrary(userId);
        setBooks(libraryBooks);
        setError(null);
      } catch (err) {
        console.error('서재 목록을 불러오는 중 오류가 발생했습니다:', err);
        setError('책을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [user]);

  // 책 선택 처리 함수 => 책 상세 페이지로 이동
  const handleBookClick = (libraryId: number) => {
    navigate(`/bookshelf/books/${libraryId}`);
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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <svg
          className="w-16 h-16 text-red-400 mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12" y2="16"></line>
        </svg>
        <h3 className="text-lg font-medium text-gray-800 mb-2">오류가 발생했습니다</h3>
        <p className="text-gray-500 text-sm mb-5 max-w-xs">{error}</p>
        <button
          className="bg-primary text-white px-4 py-2 rounded-md"
          onClick={() => window.location.reload()}
        >
          다시 시도
        </button>
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
  const shelves: (Library | null)[][] = [];

  for (let i = 0; i < Math.ceil(books.length / booksPerShelf); i++) {
    const shelfBooks = books.slice(i * booksPerShelf, (i + 1) * booksPerShelf);
    // 각 선반마다 책 3권을 채우기 위해 null 추가
    const filledShelf: (Library | null)[] = [...shelfBooks];
    while (filledShelf.length < booksPerShelf) {
      filledShelf.push(null);
    }
    shelves.push(filledShelf);
  }

  return (
    <div className="all-books-tab">
      <div className="container mx-auto px-4 pb-16 space-y-8">
        {shelves.map((shelfBooks, index) => (
          <div key={`shelf-${index}`}>
            {/* 클릭 이벤트를 LibraryBookshelfRow에 직접 전달 */}
            <LibraryBookshelfRow books={shelfBooks} onBookClick={handleBookClick} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMyBooksTab;
