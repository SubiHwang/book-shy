import SearchBar from '@/components/temp/WishBooks/SearchBar';
import { ArrowLeft } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';
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
        <p className="text-xl font-light text-white text-center mb-3">
          읽고 싶은 책을 검색 해보세요.
        </p>
        <SearchBar onSearch={handleSearch} />
      </div>
    </div>
  );
};

export default SearchWishBooks;
