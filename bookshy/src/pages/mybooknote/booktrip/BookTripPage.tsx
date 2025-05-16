import { useState, useMemo, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
  fetchLibraryBooksWithTrip,
  fetchMyTripsOutsideLibrary,
} from '@/services/mybooknote/booktrip/booktrip';
import type {
  LibraryBookWithTrip,
  BookTripBookItem,
  BookTripListItem,
} from '@/types/mybooknote/booktrip/booktrip';
import BookTripIntroCard from '@/components/mybooknote/booktrip/BookTripIntroCard';
import BookTripBookList from '@/components/mybooknote/booktrip/BookTripBookList';
import SearchBar from '@/components/common/SearchBar';

const BookTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('전체 보기');

  const filterList = useMemo(() => ['전체 보기', '여정이 있는 책', '여정이 없는 책'], []);

  const { data: libraryBooks = [], isLoading: isLoadingLibrary } = useQuery<LibraryBookWithTrip[]>({
    queryKey: ['libraryBooksWithTrip'],
    queryFn: fetchLibraryBooksWithTrip,
  });

  const { data: extraTrips = [], isLoading: isLoadingExtra } = useQuery<BookTripBookItem[]>({
    queryKey: ['myTripsOutsideLibrary'],
    queryFn: fetchMyTripsOutsideLibrary,
  });

  const libraryMapped: BookTripListItem[] = libraryBooks.map((book) => ({
    bookId: book.bookId,
    title: book.title,
    author: book.author,
    coverImageUrl: book.coverImageUrl,
    hasTrip: book.hasTrip,
  }));

  const extraMapped: BookTripListItem[] = extraTrips.map((trip) => ({
    bookId: trip.bookId,
    title: trip.title,
    author: trip.author,
    coverImageUrl: trip.coverImageUrl,
    hasTrip: true,
  }));

  const allBooks = [...libraryMapped, ...extraMapped];

  const filteredBooks = allBooks.filter((book) => {
    const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter =
      selectedFilter === '전체 보기' ||
      (selectedFilter === '여정이 있는 책' && book.hasTrip) ||
      (selectedFilter === '여정이 없는 책' && !book.hasTrip);
    return matchSearch && matchFilter;
  });

  const isLoading = isLoadingLibrary || isLoadingExtra;

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // 향후 추가 작업 가능 (예: 스크롤 이동 등)
    }
  };

  return (
    <div className="bg-light-bg min-h-screen pb-28">
      <BookTripIntroCard />

      <div className="px-4 pt-4 space-y-4">
        {/* 🔍 검색 바 */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearchKeyDown}
          placeholder="책 여정 검색 (책 제목)"
        />

        {/* 🏷️ 필터 버튼들 */}
        <div className="flex gap-2 overflow-x-auto">
          {filterList.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-1.5 text-sm rounded-full border transition ${
                selectedFilter === filter
                  ? 'bg-[#FF4040] text-white border-[#FF4040]'
                  : 'bg-white text-[#FF4040] border-[#FF8080]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* 📚 책 리스트 렌더링 */}
        {isLoading ? (
          <p className="text-center text-gray-500">불러오는 중...</p>
        ) : filteredBooks.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-12">조건에 맞는 책이 없습니다.</p>
        ) : (
          <BookTripBookList
            books={filteredBooks}
            onClick={(bookId) => navigate(`/booknotes/trip/${bookId}`)}
          />
        )}
      </div>
    </div>
  );
};

export default BookTripPage;
