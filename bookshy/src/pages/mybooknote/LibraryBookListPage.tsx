import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchLibraryBooks } from '@/services/mybooknote/library';
import type { LibraryBook } from '@/types/mybooknote/library';
import Header from '@/components/common/Header';
import { useState } from 'react';

const LibraryBookListPage = () => {
  const navigate = useNavigate();
  const { data = [] } = useQuery<LibraryBook[]>({
    queryKey: ['library-books'],
    queryFn: () => fetchLibraryBooks(),
  });

  const [filter, setFilter] = useState<'ALL' | 'X'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = data.filter((book) => {
    const matchFilter = filter === 'ALL' || book.public === false;
    const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="bg-light-bg min-h-screen pb-28">
      <Header title="독서 기록" onBackClick={() => navigate(-1)} showBackButton showNotification />

      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="내가 읽은 도서 검색하기"
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'ALL' | 'X')}
            className="text-sm border rounded-md px-2"
          >
            <option value="X">X 책</option>
            <option value="ALL">전체</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredBooks.map((book) => (
            <div
              key={book.bookId}
              className="bg-white p-4 rounded-xl shadow flex gap-4 cursor-pointer"
              onClick={() => navigate(`/booknotes/create?bookId=${book.bookId}`)}
            >
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-16 h-24 object-cover rounded-md"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm mb-1">{book.title}</h3>
                  <p className="text-xs text-gray-500">{book.author}</p>
                </div>
              </div>
            </div>
          ))}

          {filteredBooks.length === 0 && (
            <div className="text-sm text-center text-gray-400 mt-12">
              조건에 맞는 책이 없습니다.
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate('/booknotes/create')}
        className="fixed bottom-20 right-6 w-12 h-12 bg-pink-500 text-white rounded-full shadow-lg text-2xl"
      >
        +
      </button>
    </div>
  );
};

export default LibraryBookListPage;
