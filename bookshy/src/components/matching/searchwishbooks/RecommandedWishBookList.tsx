import { FileQuestion, RefreshCw } from 'lucide-react';
import WishBookCard from '../wishbooks/WishBookCard';
import { useState, useEffect } from 'react';
import { WishBook } from '@/types/book';
import { getRecommandationBooks } from '@/services/matching/wishbooks';
import Loading from '@/components/common/Loading';

const RecommandedWishBookList = () => {
  const [recommandedBooks, setRecommandedBooks] = useState<WishBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchBooks = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getRecommandationBooks();
      setRecommandedBooks(response.books);
    } catch (error) {
      console.error('추천 도서 fetch 중 오류 발생', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleRefresh = () => {
    fetchBooks(true);
  };

  return (
    <div>
      {/* 도서 목록이 있을 때만 취향 분석 헤더 표시 */}
      {recommandedBooks && recommandedBooks.length > 0 && (
        <div className="flex flex-col text-light-text px-8 py-4">
          <div className="flex justify-between items-center mb-1">
            <div className="flex gap-2 items-center">
              <FileQuestion size={24} />
              <p className="text-lg font-medium">이런 책은 어때요?</p>
            </div>

            {/* 새로고침 버튼은 로딩 중이 아닐 때만 표시 */}
            {!loading && (
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-1 text-primary hover:text-primary-dark transition-colors"
                aria-label="추천 도서 새로고침"
              >
                <RefreshCw size={18} className={`${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm">새로고침</span>
              </button>
            )}
          </div>
          <p className="text-md font-light">
            회원님의 취향을 분석하고 비슷한 취향을 가진 회원들이 많이 담은 인기 도서를 분석하여
            최적의 책을 추천해드려요.
          </p>
        </div>
      )}

      {/* 로딩 상태일 때는 로딩 컴포넌트 표시 */}
      {loading || refreshing ? (
        <div className="flex justify-center items-center py-12">
          <Loading loadingText="추천 도서 불러오는 중..." />
        </div>
      ) : (
        <div>
          {recommandedBooks && recommandedBooks.length > 0 ? (
            <div className="flex flex-col px-4 pb-6">
              {recommandedBooks.map((book) => (
                <WishBookCard key={book.itemId} wishBook={book} />
              ))}

              {/* 목록 아래에 다른 추천 보기 버튼 */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="mt-4 mx-auto flex items-center gap-2 px-5 py-2.5 border border-primary text-primary rounded-full hover:bg-primary-light hover:text-white transition-all"
              >
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                다른 추천도서 보기
              </button>

              {/* 안내 메시지 */}
              <div className="text-center text-gray-500 text-sm mt-2">
                <p>추천 도서가 마음에 들지 않나요? 새로고침해보세요!</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-64 px-4 py-8 mx-4">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                아직 맞춤 추천을 준비 중이에요
              </h3>
              <p className="text-gray-600 text-center mb-4">
                회원님의 취향을 파악하기 위한 정보가 더 필요합니다.
                <br />
                관심 있는 분야의 책을 위시리스트에 담아보세요!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommandedWishBookList;
