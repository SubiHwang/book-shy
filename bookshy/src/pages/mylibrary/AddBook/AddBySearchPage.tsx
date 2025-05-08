// src/pages/mylibrary/AddBook/AddBySearchPage.tsx
import { useState, FC, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import BookSearchItem from '@/components/mylibrary/BookAdd/BookSearchItem';
import { searchBooksByKeyword, addBookFromSearch } from '@/services/mylibrary/bookSearchService';
import type { BookSearchItem as BookItemType } from '@/types/mylibrary/bookSearch';
import { useAuth } from '@/contexts/AuthContext';

const AddBySearchPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [books, setBooks] = useState<BookItemType[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addingItemId, setAddingItemId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  // 책 검색 함수
  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      setBooks([]);
      setTotalResults(0);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // API 호출하여 책 검색
      const response = await searchBooksByKeyword(query);

      setBooks(response.books);
      setTotalResults(response.total);

      console.log(`검색 결과: ${response.total}개의 책 중 ${response.books.length}개 표시`);
    } catch (err) {
      console.error('책 검색 중 오류 발생:', err);
      setError('책 검색에 실패했습니다. 다시 시도해주세요.');
      setBooks([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색 폼 제출 핸들러
  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    searchBooks(searchQuery);
  };

  // 검색어 변경시 자동 검색
  useEffect(() => {
    if (searchQuery.trim()) {
      const debounceTimer = setTimeout(() => {
        searchBooks(searchQuery);
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setBooks([]);
      setTotalResults(0);
    }
  }, [searchQuery]);

  // 책 추가 핸들러
  const handleAddBook = async (itemId: number) => {
    // 이미 추가 중이면 중복 요청 방지
    if (isAdding) return;

    try {
      setIsAdding(true);
      setAddingItemId(itemId);

      const selectedBook = books.find((book) => book.itemId === itemId);
      if (!selectedBook) {
        console.error('선택한 책을 찾을 수 없습니다.');
        return;
      }

      console.log('선택한 책:', selectedBook);

      // 개발 중이므로 기본 사용자 ID 사용 (로그인 없이 테스트 가능)
      const userId = Number(user?.id) || 1;

      // 검색 결과 책 등록 API 호출
      const registeredBook = await addBookFromSearch(userId, itemId);

      console.log('책 등록 성공:', registeredBook);

      // 성공 알림 및 서재 페이지로 이동
      alert('책이 성공적으로 등록되었습니다!');
      navigate('/bookshelf');
    } catch (error) {
      console.error('책 추가 중 오류 발생:', error);
      alert('책 추가에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsAdding(false);
      setAddingItemId(null);
    }
  };

  // 직접 등록 페이지로 이동
  const handleSelfRegister = () => {
    navigate('/bookshelf/add/self');
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-light-bg">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        {/* 헤더 */}
        <div className="bg-primary-light p-4 text-white">
          <div className="relative flex flex-col items-center mb-1">
            <button onClick={handleGoBack} className="absolute left-0 top-1">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-medium">등록할 책을 검색하세요</h1>
            <p className="text-sm text-white/90">+ 버튼을 눌러 등록을 완료하세요.</p>
          </div>

          {/* 검색바 */}
          <div className="px-4 py-2 mt-2">
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-white rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="책 제목을 입력해주세요"
                  className="bg-transparent w-full outline-none text-sm text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="ml-2">
                  <Search size={16} className="text-gray-400" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 검색 결과 정보 */}
        {searchQuery.trim() && !isSearching && !error && (
          <div className="bg-white p-3 border-b border-gray-200">
            <p className="text-sm text-gray-600">
              '{searchQuery}' 검색 결과: {totalResults}개
            </p>
          </div>
        )}

        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-50 p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => searchBooks(searchQuery)}
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-md"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 책 목록 */}
        <div className="bg-light-bg p-4 flex-1 flex flex-col gap-4 min-h-[calc(100vh-180px)] pb-20">
          {isSearching ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-300"></div>
            </div>
          ) : books.length === 0 ? (
            <div className="flex flex-col items-center mt-32 justify-center h-full py-10">
              <p className="text-light-text-secondary text-center text-lg mb-2">
                찾는 책이 없으신가요?
              </p>
              <p className="text-light-text-muted text-center mb-8">직접 등록 해보세요!</p>
              <button
                onClick={handleSelfRegister}
                className="px-10 py-3 bg-white border border-light-text-muted/30 text-light-text-secondary rounded-md hover:bg-light-bg-shade transition-colors"
              >
                직접 등록하기
              </button>
            </div>
          ) : (
            books.map((book) => (
              <BookSearchItem key={book.itemId} book={book} onAddBook={handleAddBook} />
            ))
          )}

          {/* 로딩 중일 때 보여줄 오버레이 */}
          {isAdding && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light mx-auto mb-4"></div>
                <p>책을 등록하는 중입니다...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBySearchPage;
