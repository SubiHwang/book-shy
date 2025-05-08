import PopularSearchTerm from '@/components/matching/searchwishbooks/PopularSearchTerm';
import RecommandedWishBookList from '@/components/matching/searchwishbooks/RecommandedWishBookList';
import SearchBar from '@/components/matching/searchwishbooks/SearchBar';
import SearchResultBookList from '@/components/matching/searchwishbooks/SearchResultBookList';
import { getSearchResult } from '@/services/matching/wishbooks';
import { WishBook } from '@/types/book';
import { SearchResultResponse } from '@/types/Matching';
import { ArrowLeft } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchWishBooks = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isResult, setIsResult] = useState<boolean>(false);
  const [resultList, setResultList] = useState<WishBook[]>([]); // 검색 결과 리스트
  const [total, setTotal] = useState<number>(0); // 검색 결과 총 개수
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태
  const [lastSearched, setLastSearched] = useState<string>(''); // 마지막 검색어 저장

  const handleSearch = async (e: KeyboardEvent<HTMLInputElement>): Promise<void> => {
    if (e.key === 'Enter') {
      const params = searchTerm.trim(); // 검색어 앞뒤 공백 제거
      if (!params) return;
      
      setIsLoading(true); // 로딩 시작
      try {
        console.log('검색어:', params);
        const res: SearchResultResponse = await getSearchResult(params);
        setResultList(res.books);
        setTotal(res.total);
        setIsResult(true);
        setLastSearched(params); // 검색 결과용 검색어 저장
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
        setResultList([]);
      } finally {
        // 검색창은 비우고, 검색 결과 표시용 검색어는 별도로 저장
        setSearchTerm('');
        setIsLoading(false);
      }
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
        <SearchBar 
          onSearch={handleSearch} 
          value={searchTerm} 
          onChange={setSearchTerm} 
        />
      </div>
      <div className="bg-primary-light">
        <PopularSearchTerm />
      </div>
      {isResult ? (
        <SearchResultBookList
          resultList={resultList}
          searchTerm={lastSearched} // 마지막 검색어를 전달
          isLoading={isLoading}
          total={total}
        />
      ) : (
        <RecommandedWishBookList />
      )}
    </div>
  );
};

export default SearchWishBooks;