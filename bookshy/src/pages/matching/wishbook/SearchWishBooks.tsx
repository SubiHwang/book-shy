import { ArrowLeft, Search } from 'lucide-react';
import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchWishBooks = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      // api 호출
      console.log('검색', searchTerm);
      setSearchTerm('');
    }
  };
  return (
    <div>
      <div className="bg-primary-light px-4 py-3">
        <div>
          <button onClick={() => navigate(-1)} className="mr-4 p-1 text-white" aria-label="Go back">
            <ArrowLeft size={24} />
          </button>
        </div>
        <p className="text-xl font-light text-white text-center mb-3">읽고 싶은 책을 검색 해보세요.</p>
        <div className="relative flex items-center w-full">
          <input
            type="text"
            placeholder="책 제목, 작가..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full px-4 py-2 pr-10 rounded-full border-none focus:outline-none shadow-sm text-gray-800"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchWishBooks;
