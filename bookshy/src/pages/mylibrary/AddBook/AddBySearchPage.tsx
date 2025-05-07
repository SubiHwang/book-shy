import { useState, FC, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import BookSearchItem from '@/components/mylibrary/BookAdd/BookSearchItem';
import { Book } from '@/types/book';

const AddBySearchPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([]);

  const navigate = useNavigate();

  // 책 검색 함수
  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    setIsSearching(true);

    // 더미 데이터
    setTimeout(() => {
      const dummyBooks: Book[] = [
        {
          bookId: 1,
          title: '총, 균, 쇠',
          author: '제레드 다이아몬드',
          publisher: '김진준',
          translator: '이명식',
          categories: '고전 문학',
          bookImgUrl: '/api/placeholder/100/150',
        },
        {
          bookId: 2,
          title: '총, 균, 쇠 (양장판)',
          author: '제레드 다이아몬드',
          publisher: '김진준',
          translator: '이명식',
          categories: '고전 문학',
          bookImgUrl: '/api/placeholder/100/150',
        },
        {
          bookId: 3,
          title: '사피엔스',
          author: '유발 하라리',
          publisher: '김영사',
          translator: '이명식',
          categories: '고전 문학',
          bookImgUrl: '/api/placeholder/100/150',
        },
        {
          bookId: 4,
          title: '호모 데우스',
          author: '유발 하라리',
          translator: '이명식',
          categories: '고전 문학',
          publisher: '김영사',
          bookImgUrl: '/api/placeholder/100/150',
        },
        {
          bookId: 5,
          title: '21세기를 위한 21가지 제언',
          author: '유발 하라리',
          translator: '이명식',
          categories: '고전 문학',
          publisher: '김영사',
          bookImgUrl: '/api/placeholder/100/150',
        },
      ];

      const filteredBooks = dummyBooks.filter(
        (book) =>
          book.title?.toLowerCase().includes(query.toLowerCase()) ||
          book.author?.toLowerCase().includes(query.toLowerCase()),
      );

      setBooks(filteredBooks);
      setIsSearching(false);
    }, 800);
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
    }
  }, [searchQuery]);

  // 책 추가 핸들러
  const handleAddBook = async (bookId: number) => {
    try {
      const selectedBook = books.find((book) => book.bookId === bookId);
      if (!selectedBook) return;

      // const newBook: Book = {
      //   ...selectedBook,
      // };

      // 나중에 실제로 DB 저장 API 호출 가능
      navigate('/bookshelf');
    } catch (error) {
      console.error('책 추가 중 오류 발생:', error);
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
                  placeholder="책 제목, 저자, 키워드"
                  className="bg-transparent w-full outline-none text-sm text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={16} className="text-gray-400 ml-2" />
              </div>
            </form>
          </div>
        </div>

        {/* 책 목록 */}
        <div className="bg-white p-4 flex-1 flex flex-col gap-4 min-h-[calc(100vh-180px)] pb-16 bg-light-bg">
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
                className="px-10 py-3 bg-light-bg border border-light-text-muted/30 text-light-text-secondary rounded-md hover:bg-light-bg-shade transition-colors"
              >
                직접 등록하기
              </button>
            </div>
          ) : (
            books.map((book) => (
              <BookSearchItem key={book.bookId} book={book} onAddBook={handleAddBook} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBySearchPage;
