import PopularSearchTerm from '@/components/matching/searchwishbooks/PopularSearchTerm';
import RecommandedWishBookList from '@/components/matching/searchwishbooks/RecommandedWishBookList';
import SearchBar from '@/components/matching/searchwishbooks/SearchBar';
import SearchResultBookList from '@/components/matching/searchwishbooks/SearchResultBookList';
import { WishBook } from '@/types/book';
import { ArrowLeft } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchWishBooks = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isResult, setIsResult] = useState<boolean>(false);
  const [resultList, setResultList] = useState<WishBook[]>([]); // 검색 결과 리스트

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      // api 호출
      console.log('검색', searchTerm);
      setSearchTerm('');
      setResultList([]); // 검색 결과 입력
      setIsResult(true);
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
      <div className="bg-primary-light">
        <PopularSearchTerm />
      </div>
      {isResult ? (
        <SearchResultBookList resultList={resultList} searchTerm={searchTerm} />
      ) : (
        <RecommandedWishBookList />
      )}
    </div>
  );
};

export default SearchWishBooks;
