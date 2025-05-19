import { useState, KeyboardEvent } from 'react';
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
import FilterChips from '@/components/common/FilterChips';
import { MapPin, BookOpen, CheckCircle, CircleSlash } from 'lucide-react';
import Loading from '@/components/common/Loading';

// 📌 필터 타입 선언
type FilterType = '전체 보기' | '여정이 있는 책' | '여정이 없는 책';

const BookTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('전체 보기');

  const filterOptions: { label: string; value: FilterType; icon: React.ReactNode }[] = [
    { label: '전체 보기', value: '전체 보기', icon: <BookOpen size={16} className="mr-1" /> },
    { label: '여정 O', value: '여정이 있는 책', icon: <CheckCircle size={16} className="mr-1" /> },
    { label: '여정 X', value: '여정이 없는 책', icon: <CircleSlash size={16} className="mr-1" /> },
  ];

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
      // 향후 스크롤 등 추가 동작 가능
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

        {/* 🏷️ 칩 필터 */}
        <FilterChips<FilterType>
          options={filterOptions}
          selected={selectedFilter}
          onSelect={(val) => setSelectedFilter(val)}
        />

        {/* 📚 책의여정 지도 */}
        <div className="fixed bottom-32 left-6 z-50">
          <button
            onClick={() => navigate('/booknotes/trip-map')}
            className="w-14 h-14 rounded-full bg-cyan-500/20 backdrop-blur-md shadow-xl shadow-cyan-400/40 
               border border-cyan-400 hover:ring-2 hover:ring-cyan-300 hover:ring-offset-2 
               flex justify-center items-center transition duration-300"
          >
            <MapPin size={28} strokeWidth={2} color="white" />
          </button>
        </div>

        {/* 📚 리스트 */}
        {isLoading ? (
          <Loading loadingText="책의 여정 불러오는 중..." />
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
