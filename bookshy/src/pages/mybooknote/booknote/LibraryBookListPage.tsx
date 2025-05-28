import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchLibraryBooks } from '@/services/mybooknote/booknote/library';
import type { LibraryBook } from '@/types/mybooknote/booknote/library';
import Header from '@/components/common/Header';
import { useState, useMemo } from 'react';
import Loading from '@/components/common/Loading';
import SearchFilterBar from '@/components/common/SearchFilterBar';

const LibraryBookListPage = () => {
  const navigate = useNavigate();
  const { data = [], isLoading } = useQuery<LibraryBook[]>({
    queryKey: ['library-books'],
    queryFn: () => fetchLibraryBooks(),
  });

  const [selectedFilter, setSelectedFilter] = useState<string>('전체');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filterList = useMemo(() => {
    return ['전체', '비공개'];
  }, []);

  const filteredBooks = useMemo(() => {
    if (!data) return [];

    const categoryFiltered =
      selectedFilter === '전체'
        ? data
        : data.filter((book) => selectedFilter === '비공개' && book.public === false);

    if (!searchTerm.trim()) return categoryFiltered;

    const term = searchTerm.toLowerCase().trim();
    return categoryFiltered.filter(
      (book) =>
        book.title.toLowerCase().includes(term) ||
        (book.author && book.author.toLowerCase().includes(term)),
    );
  }, [data, selectedFilter, searchTerm]);

  if (isLoading) {
    return <Loading loadingText={'읽은 책 목록 불러오는 중...'} />;
  }

  return (
    <div className="bg-light-bg min-h-screen pb-28">
      <Header title="독서 기록" onBackClick={() => navigate(-1)} showBackButton showNotification />

      <div className="relative pb-16 px-4 pt-4">
        {/* 재사용 가능한 SearchFilterBar 컴포넌트 사용 */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          filterList={filterList}
          totalCount={filteredBooks.length}
          searchPlaceholder="내가 읽은 도서 검색하기 (책 제목, 저자)"
        />

        <div className="space-y-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.bookId}
                className="card flex items-center justify-between p-4 mb-4 w-full cursor-pointer bg-white rounded-xl shadow"
                onClick={() => navigate(`/booknotes/create?bookId=${book.bookId}`)}
              >
                {/* Book Image */}
                <div className="flex-shrink-0 w-24 h-32 mr-4">
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-md shadow-sm"
                  />
                </div>

                {/* Book Info */}
                <div className="flex-grow min-w-0 pr-2">
                  <h3
                    className="text-base font-medium text-light-text mb-1 truncate"
                    title={book.title}
                  >
                    {book.title}
                  </h3>
                  <p className="text-xs text-light-text-secondary mb-1 truncate">{book.author}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-light-text-secondary">
              <p>조건에 맞는 책이 없습니다.</p>
              <p>다른 검색어나 필터를 사용해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryBookListPage;
