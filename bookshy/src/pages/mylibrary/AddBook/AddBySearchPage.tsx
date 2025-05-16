import { useState, FC, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BookSearchItem from '@/components/mylibrary/BookAdd/BookSearchItem';
import { searchBooksByKeyword, addBookFromSearch } from '@/services/mylibrary/bookSearchService';
import type { BookSearchItem as BookItemType } from '@/types/mylibrary/bookSearch';
import Loading from '@/components/common/Loading';
import { toast } from 'react-toastify';
import SearchBar from '@/components/common/SearchBar';

const AddBySearchPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // URL에서 searchQuery 파라미터 가져오기
  const urlSearchParams = new URLSearchParams(location.search);
  const queryParam = urlSearchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [books, setBooks] = useState<BookItemType[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(!!queryParam); // URL에 쿼리가 있으면 검색된 상태로 시작

  // URL에 검색어가 있을 경우, 페이지 로드 시 자동으로 검색 실행
  useEffect(() => {
    if (queryParam) {
      searchBooks(queryParam);
    }
  }, [queryParam]);

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
      setHasSearched(true);

      console.log(`검색 결과: ${response.total}개의 책 중 ${response.books.length}개 표시`);
    } catch (err) {
      console.error('책 검색 중 오류 발생:', err);
      setError('책 검색에 실패했습니다. 다시 시도해주세요.');
      toast.error('책 검색에 실패했습니다. 다시 시도해주세요.');
      setBooks([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색어 변경 핸들러 - 수정됨
  const handleSearchChange = (value: string): void => {
    setSearchQuery(value);
  };

  // 검색 실행 함수 - URL 업데이트 추가
  const executeSearch = () => {
    if (searchQuery.trim()) {
      // 검색어를 URL에 반영
      navigate(`/bookshelf/add/search?q=${encodeURIComponent(searchQuery.trim())}`, {
        replace: true,
      });
      searchBooks(searchQuery.trim());
    }
  };

  // 책 추가 핸들러
  const handleAddBook = async (itemId: number) => {
    if (isAdding) return;

    try {
      setIsAdding(true);

      const selectedBook = books.find((book) => book.itemId === itemId);
      if (!selectedBook) {
        console.error('선택한 책을 찾을 수 없습니다.');
        toast.error('선택한 책을 찾을 수 없습니다.');
        return;
      }
      console.log('선택한 책:', selectedBook);

      // 검색 결과 책 등록 API 호출
      const registeredBook = await addBookFromSearch(itemId);

      console.log('책 등록 성공:', registeredBook);

      // 상태 업데이트 - 추가된 책의 inLibrary와 libraryId 업데이트
      setBooks((prev) =>
        prev.map((book) =>
          book.itemId === itemId
            ? {
                ...book,
                inLibrary: true,
                libraryId: registeredBook.libraryId,
              }
            : book,
        ),
      );

      // 성공 알림
      toast.success('책이 성공적으로 등록되었습니다!');
    } catch (error) {
      console.error('책 추가 중 오류 발생:', error);
      toast.error('책 추가에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsAdding(false);
    }
  };

  // 책 상세 페이지로 이동 핸들러
  const handleBookItemClick = (itemId: number) => {
    const book = books.find((book) => book.itemId === itemId);

    if (book) {
      // 클릭한 책의 정보(inLibrary 포함)를 state로 전달
      navigate(`/bookshelf/add/searchdetail/${itemId}`, {
        state: {
          inLibrary: book.inLibrary,
          libraryId: book.libraryId,
        },
      });
    } else {
      navigate(`/bookshelf/add/searchdetail/${itemId}`);
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
    <div className="min-h-screen bg-light-bg overflow-auto">
      {/* 헤더 */}
      <div className="bg-primary-light px-4 py-3 pb-4 sticky top-0 z-10">
        <div>
          <button onClick={handleGoBack} className="mr-4 p-1 text-white" aria-label="Go back">
            <ArrowLeft size={24} />
          </button>
        </div>
        <p className="text-xl font-light text-white text-center mb-3">등록할 책을 검색하세요.</p>
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onSearch={executeSearch}
          placeholder="등록할 책을 선택하세요(책 제목, 저자, 출판사)"
        />
      </div>

      {/* 검색 결과 */}
      <div>
        {/* 검색 결과 헤더 */}
        {hasSearched && !error && !isSearching && (
          <div className="flex flex-col text-light-text px-8 py-4">
            <div className="flex gap-2 justify-between items-center mb-1">
              <p className="text-lg font-medium">
                <span className="font-semibold text-primary-dark">{searchQuery}</span> 의 검색 결과
              </p>
              <p className="font-light">검색 결과 수: {totalResults}</p>
            </div>
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

        {/* 로딩, 검색 결과 없음, 초기 상태, 책 목록 표시 */}
        <div className="px-4">
          {isSearching ? (
            <div className="flex justify-center items-center py-10">
              <Loading loadingText={'도서 검색 중...'} />
            </div>
          ) : hasSearched && books.length === 0 && !error ? (
            <div className="flex flex-col items-center mt-16 justify-center min-h-[40vh]">
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
          ) : !hasSearched ? (
            <div className="flex flex-col items-center justify-center mt-32 min-h-[50vh]">
              <p className="text-light-text-secondary text-center text-lg mb-2">
                책 제목, 저자 또는 출판사를 검색해보세요
              </p>
              <p className="text-light-text-muted text-center">
                검색어를 입력하고 검색 버튼을 클릭하세요
              </p>
            </div>
          ) : (
            // 책 목록
            <div className="flex flex-col pb-20">
              {books.map((book) => (
                <BookSearchItem
                  key={book.itemId}
                  book={book}
                  onAddBook={handleAddBook}
                  onItemClick={handleBookItemClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* 로딩 오버레이 */}
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
  );
};

export default AddBySearchPage;
