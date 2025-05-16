// src/pages/mylibrary/tabs/PublicBooksTab.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LibraryBookshelfRow from '@/components/mylibrary/BookShelf/LibraryBookshelfRow';
import { fetchUserPublicLibrary } from '@/services/mylibrary/libraryApi';
import { useAuth } from '@/contexts/AuthContext';
import type { Library } from '@/types/mylibrary/library';
import Loading from '@/components/common/Loading';

const PublicBooksTab: React.FC = () => {
  const [books, setBooks] = useState<Library[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      try {
        // API 호출하여 공개 책 데이터 가져오기
        const publicBooks = await fetchUserPublicLibrary();

        // libraryId 기준으로 오름차순 정렬
        const sortedBooks = [...publicBooks].sort((a, b) => a.libraryId - b.libraryId);

        setBooks(sortedBooks);
        setError(null);
      } catch (err) {
        console.error('공개 서재 목록을 불러오는 중 오류가 발생했습니다:', err);
        setError('공개 책을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, [user]);

  // 책 선택 처리 함수 => 책 상세 페이지로 이동
  const handleBookClick = (libraryId: number) => {
    // 현재는 bookId와 libraryId가 같다고, 가정하거나
    // 또는 books 배열에서 해당 libraryId의 책을 찾아서 bookId를 추출할 수 있음
    const book = books.find((b) => b.libraryId === libraryId);

    // 책을 찾았고, bookId 필드가 있다면 사용
    if (book && book.bookId) {
      // bookId를 세션 스토리지에 저장 (문자열이 아닌 숫자 값 저장)
      sessionStorage.setItem(`bookId_for_${libraryId}`, book.bookId.toString());
    } else {
      // 찾지 못했거나 bookId가 없으면 libraryId 사용
      sessionStorage.setItem(`bookId_for_${libraryId}`, libraryId.toString());
    }

    navigate(`/bookshelf/books/${libraryId}`);
  };

  if (isLoading) {
    return <Loading loadingText="책을 불러오는 중..." />;
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
        <h3 className="text-lg font-medium text-gray-800 mb-2">공개된 책이 없네요!</h3>
        <p className="text-gray-500 text-sm mb-5 max-w-xs">
          다른 사람들과 공유하고 싶은 책을 공개로 설정해보세요.
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
      <div className="container mx-auto px-4 pb-16">
        {/* 도서 수를 표시하는 헤더 */}
        <div className="flex justify-end mt-3 mb-4">
          <div className="text-sm font-medium text-gray-600">
            공개 서재: <span className="text-primary">{books.length}권</span>
          </div>
        </div>

        {/* 책장 컨테이너 */}
        <div className="space-y-8">
          {shelves.map((shelfBooks, index) => (
            <div key={`shelf-${index}`}>
              <LibraryBookshelfRow books={shelfBooks} onBookClick={handleBookClick} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicBooksTab;
