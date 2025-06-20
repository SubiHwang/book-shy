import PopularSearchTerm from '@/components/matching/searchwishbooks/PopularSearchTerm';
import SearchBar from '@/components/common/SearchBar';
import { ArrowLeft } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const SearchWishBooks = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = async (e: KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (!searchTerm) return;
    if (e.key === 'Enter') {
      navigate(
        `/matching/search-wish-books/result?searchTerm=${encodeURIComponent(searchTerm.trim())}`,
      ); // 검색어 앞뒤 공백 제거
    }
  };

  return (
    <div>
      <div className="bg-primary-light px-4 py-3">
        <div>
          <button
            onClick={() => navigate('/matching/wish-books')}
            className="mr-4 p-1 text-white"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
        <p className="text-xl font-light text-white text-center mb-3">
          읽고 싶은 책을 검색 해보세요.
        </p>
        <SearchBar
          value={searchTerm}
          onSearch={handleSearch}
          onChange={setSearchTerm}
          placeholder="읽고 싶은 책 검색(책 제목, 저자, 출판사)"
          suggestions={[]}
          maxSuggestions={8}
          minQueryLength={2}
        />
      </div>
      <div className="bg-primary-light">
        <PopularSearchTerm />
      </div>
      <Outlet />
    </div>
  );
};

export default SearchWishBooks;
