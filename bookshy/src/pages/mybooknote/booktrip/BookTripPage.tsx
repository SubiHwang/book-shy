import { useState, useMemo } from 'react';
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
import SearchFilterBar from '@/components/common/SearchFilterBar';

const BookTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('전체 보기');

  // 필터 옵션 정의
  const filterList = useMemo(() => {
    return ['전체 보기', '여정이 있는 책', '여정이 없는 책'];
  }, []);

  // ✅ 여정 여부 포함 서재 도서
  const { data: libraryBooks = [], isLoading: isLoadingLibrary } = useQuery<LibraryBookWithTrip[]>({
    queryKey: ['libraryBooksWithTrip'],
    queryFn: fetchLibraryBooksWithTrip,
  });

  // ✅ 서재에 없는 여정만 있는 도서
  const { data: extraTrips = [], isLoading: isLoadingExtra } = useQuery<BookTripBookItem[]>({
    queryKey: ['myTripsOutsideLibrary'],
    queryFn: fetchMyTripsOutsideLibrary,
  });

  // ✅ 공통 리스트 타입으로 가공
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
    hasTrip: true, // 여정은 항상 있음
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

  return (
    <div className="bg-light-bg min-h-screen pb-28">
      <BookTripIntroCard />
      <div className="px-4 pt-4">
        <div>
          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            filterList={filterList}
            totalCount={filteredBooks.length}
            searchPlaceholder="책 여정 검색 (책 제목)"
          />
        </div>

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
