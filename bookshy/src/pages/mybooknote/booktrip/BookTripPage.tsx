import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  fetchLibraryBooksWithTrip,
  fetchMyTripsOutsideLibrary,
} from '@/services/mybooknote/booktrip/booktrip';
import type { BookTripBookItem } from '@/types/mybooknote/booktrip/booktrip';

import Header from '@/components/common/Header';
import TabNavBar from '@/components/common/TabNavBar';
import BookTripIntroCard from '@/components/mybooknote/booktrip/BookTripIntroCard';
import BookTripFilterBar from '@/components/mybooknote/booktrip/BookTripFilterBar';
import BookTripBookList from '@/components/mybooknote/booktrip/BookTripBookList';

const BookTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'WRITTEN' | 'UNWRITTEN'>('ALL');

  const pages = [
    { path: '/booknotes', label: '내 독서 기록 보기' },
    { path: '/booknotes/trip', label: '책의 여정 보기' },
  ];

  const { data: libraryTrips = [], isLoading: isLoadingLibrary } = useQuery<BookTripBookItem[]>({
    queryKey: ['libraryBooksWithTrip'],
    queryFn: fetchLibraryBooksWithTrip,
  });

  const { data: extraTrips = [], isLoading: isLoadingExtra } = useQuery<BookTripBookItem[]>({
    queryKey: ['myTripsOutsideLibrary'],
    queryFn: fetchMyTripsOutsideLibrary,
  });

  const allTrips = [...libraryTrips, ...extraTrips];

  const filteredTrips = allTrips.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter =
      filter === 'ALL' ||
      (filter === 'WRITTEN' && item.hasTrip) ||
      (filter === 'UNWRITTEN' && !item.hasTrip); // 현재는 hasTrip이 모두 true이므로 실제 UNWRITTEN 필터는 사용되지 않음
    return matchSearch && matchFilter;
  });

  const isLoading = isLoadingLibrary || isLoadingExtra;

  return (
    <div className="bg-light-bg min-h-screen pb-28">
      <Header title="독서 기록" showBackButton={false} showNotification />
      <TabNavBar pages={pages} />
      <div className="px-4 pt-4">
        <BookTripIntroCard />
        <BookTripFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
        />
        {isLoading ? (
          <p className="text-center text-gray-500">불러오는 중...</p>
        ) : filteredTrips.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-12">조건에 맞는 책이 없습니다.</p>
        ) : (
          <BookTripBookList
            books={filteredTrips}
            onClick={(bookId) => navigate(`/booknotes/trip/${bookId}`)}
          />
        )}
      </div>
    </div>
  );
};

export default BookTripPage;
