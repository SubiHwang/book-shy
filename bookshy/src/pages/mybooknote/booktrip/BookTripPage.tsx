import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchLibraryBooksWithTrip } from '@/services/mybooknote/booktrip/booktrip';
import type { LibraryBookWithTrip } from '@/types/mybooknote/booktrip/booktrip';

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

  const { data: libraryBooks = [], isLoading } = useQuery<LibraryBookWithTrip[]>({
    queryKey: ['libraryBooksWithTrip'],
    queryFn: fetchLibraryBooksWithTrip,
  });

  const filteredBooks = libraryBooks.filter((book) => {
    const matchSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter =
      filter === 'ALL' ||
      (filter === 'WRITTEN' && book.hasTrip) ||
      (filter === 'UNWRITTEN' && !book.hasTrip);
    return matchSearch && matchFilter;
  });

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
