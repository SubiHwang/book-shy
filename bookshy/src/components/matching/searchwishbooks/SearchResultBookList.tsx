import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import WishBookCard from '../wishbooks/WishBookCard';
import Loading from '@/components/common/Loading';
import { getSearchResult } from '@/services/matching/wishbooks';
import { WishBook } from '@/types/book';
import { WishBooksResponse } from '@/types/Matching';

const SearchResultBookList: FC = () => {
  // useParams 대신 useSearchParams 사용
  const [searchParams] = useSearchParams();

  const [resultList, setResultList] = useState<WishBook[]>([]); // 검색 결과 리스트
  const [total, setTotal] = useState<number>(0); // 검색 결과 총 개수
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태

  useEffect(() => {
    const searchBooks = async () => {
      // 쿼리 파라미터에서 searchTerm 가져오기
      const searchTerm = searchParams.get('searchTerm') || '';
      if (!searchTerm) return;

      setIsLoading(true); // 로딩 시작
      try {
        console.log('검색어:', searchTerm);
        const res: WishBooksResponse = await getSearchResult(searchTerm);
        setResultList(res.books);
        setTotal(res.total);
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
        setResultList([]);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };
    searchBooks();
  }, [searchParams]); // 의존성 배열에 searchParams 추가

  if (isLoading) {
    return <Loading loadingText={'도서 검색 중...'} />;
  }

  return (
    <div>
      <div className="flex flex-col text-light-text px-8 py-4">
        <div className="flex items-center mb-1">
          <p className="text-lg font-medium flex items-center flex-1 min-w-0">
            <span className="font-semibold text-primary-dark truncate max-w-[70%] inline-block">
              {searchParams.get('searchTerm')}
            </span>
            <span className="ml-1 whitespace-nowrap">의 검색 결과</span>
          </p>
          <p className="font-light whitespace-nowrap ml-2">총 {total} 권</p>
        </div>
      </div>
      <div className="flex flex-col px-4">
        {resultList.map((book) => (
          <WishBookCard key={book.itemId} wishBook={book} />
        ))}
      </div>
    </div>
  );
};
export default SearchResultBookList;
