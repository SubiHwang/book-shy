import { useState, FC, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import BookSearchItem from '@/components/mylibrary/BookSearchItem';
import { BookType } from '@/types/mylibrary/models';

// API로 검색된 책 타입
interface SearchedBook {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  hasBadge: boolean;
  badge: string;
}

const BookSearchPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [books, setBooks] = useState<SearchedBook[]>([]);

  const navigate = useNavigate();

  // 책 검색 함수
  const searchBooks = async (query: string) => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    setIsSearching(true);

    // 실제로는 여기서 API 호출
    // 임시 데이터로 대체 (실제로는 API 응답 구조에 맞게 수정)
    setTimeout(() => {
      // 더미 데이터 - 검색어를 포함하는 책만 필터링하여 보여줌
      const dummyBooks: SearchedBook[] = [
        {
          id: 1,
          title: '총, 균, 쇠',
          author: '저자: 제레드 다이아몬드 | 출판사: 김진준',
          coverUrl: '/api/placeholder/100/150',
          hasBadge: true,
          badge: '베스트셀러',
        },
        {
          id: 2,
          title: '총, 균, 쇠 (양장판)',
          author: '저자: 제레드 다이아몬드 | 출판사: 김진준',
          coverUrl: '/api/placeholder/100/150',
          hasBadge: false,
          badge: '',
        },
        {
          id: 3,
          title: '사피엔스',
          author: '저자: 유발 하라리 | 출판사: 김영사',
          coverUrl: '/api/placeholder/100/150',
          hasBadge: true,
          badge: '인기',
        },
        {
          id: 4,
          title: '호모 데우스',
          author: '저자: 유발 하라리 | 출판사: 김영사',
          coverUrl: '/api/placeholder/100/150',
          hasBadge: false,
          badge: '',
        },
        {
          id: 5,
          title: '21세기를 위한 21가지 제언',
          author: '저자: 유발 하라리 | 출판사: 김영사',
          coverUrl: '/api/placeholder/100/150',
          hasBadge: false,
          badge: '',
        },
      ];

      // 검색어가 제목 또는 저자에 포함된 책만 필터링
      const filteredBooks = dummyBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()),
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
      const selectedBook = books.find((book) => book.id === bookId);
      if (!selectedBook) return;

      const newBook: BookType = {
        id: String(selectedBook.id),
        title: selectedBook.title,
        author: selectedBook.author.split('|')[0].trim(),
        coverUrl: selectedBook.coverUrl,
        isPublic: true,
        addedAt: new Date(),
      };

      navigate('/bookshelf');
    } catch (error) {
      console.error('책 추가 중 오류 발생:', error);
    }
  };

  // 직접 등록 페이지로 이동 핸들러
  const handleSelfRegister = () => {
    navigate('/bookshelf/self-book-entry');
  };

  const handleGoBack = (): void => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-light-bg">
      {/* 메인 콘텐츠 영역 */}
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
              <BookSearchItem key={book.id} book={book} onAddBook={handleAddBook} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSearchPage;
