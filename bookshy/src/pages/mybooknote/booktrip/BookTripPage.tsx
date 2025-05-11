import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchLibraryBooks } from '@/services/mybooknote/booknote/library';
import type { LibraryBook } from '@/types/mybooknote/library';
import Header from '@/components/common/Header';
import TabNavBar from '@/components/common/TabNavBar';

const BookTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PUBLIC' | 'PRIVATE'>('ALL');

  const pages = [
    { path: '/booknotes', label: '내 독서 기록 보기' },
    { path: '/booknotes/trip', label: '책의 여정 보기' },
  ];

  const { data: libraryBooks = [], isLoading } = useQuery<LibraryBook[]>({
    queryKey: ['libraryBooks'],
    queryFn: fetchLibraryBooks,
  });

  const filteredBooks = libraryBooks.filter((book) => {
    const matchSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter =
      filter === 'ALL' ||
      (filter === 'PUBLIC' && book.public) ||
      (filter === 'PRIVATE' && !book.public);
    return matchSearch && matchFilter;
  });

  return (
    <div className="bg-light-bg min-h-screen pb-28">
      <Header title="독서 기록" showBackButton={false} showNotification />
      <TabNavBar pages={pages} />

      <div className="px-4 pt-4">
        <div className="bg-[#FFF3F3] rounded-lg p-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1 mb-1">
            <img src="/icons/book-journey-icon.svg" className="w-4 h-4" alt="책의 여정" />
            <span className="font-bold text-red-500">책의 여정 보기 시스템</span>
          </div>
          <p>
            내가 공감하거나, 대단한 책들을 다른 사람은 어떻게 읽었을까요?
            <br />
            책의 여정 기록을 통해 다른 사람들의 감상평을 알아보세요.
          </p>
        </div>

        <div className="flex gap-2 items-center mb-4">
          <input
            type="text"
            placeholder="여정이 궁금한 책 검색하기"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'ALL' | 'PUBLIC' | 'PRIVATE')}
            className="text-sm border border-gray-300 rounded-md px-2 py-2"
          >
            <option value="ALL">전체 보기</option>
            <option value="PUBLIC">공개 감상</option>
            <option value="PRIVATE">비공개 감상</option>
          </select>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">불러오는 중...</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredBooks.map((book) => (
              <div
                key={book.libraryId}
                className="flex items-center gap-3 p-3 bg-white rounded-md shadow"
              >
                <img
                  src={book.coverImageUrl || '/placeholder.jpg'}
                  alt={book.title}
                  className="w-14 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{book.title}</div>
                  <div className="text-xs text-gray-500">{book.author}</div>
                  <div
                    className={`mt-1 text-xs font-semibold ${
                      book.public ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {book.public ? '공개 감상' : '비공개 감상'}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/booknotes/trip/${book.bookId}`)}
                  className="text-xs bg-primary text-white px-3 py-1 rounded-md"
                >
                  책의 여정 보기
                </button>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredBooks.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-12">조건에 맞는 책이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default BookTripPage;
