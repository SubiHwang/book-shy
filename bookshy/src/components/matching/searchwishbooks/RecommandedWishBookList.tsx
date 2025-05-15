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
      {/* 헤더 영역 - 간결하게 수정 */}
      <div className="flex flex-col text-light-text px-4 py-3 mx-4">
        <div className="flex justify-between items-center mb-1">
          <div className="flex gap-1 items-center">
            <FileQuestion size={20} />
            <p className="text-lg font-medium">이런 책은 어때요?</p>
          </div>

          {!loading && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-primary hover:text-primary-dark transition-colors"
              aria-label="추천 도서 새로고침"
            >
              <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
        <p className="text-sm font-light">회원님의 취향 분석 기반 맞춤 추천 도서입니다.</p>
      </div>

      {/* 로딩 상태 */}
      {loading || refreshing ? (
        <div className="flex justify-center items-center py-8">
          <Loading loadingText="취향 분석 중..." />
        </div>
      ) : (
        <div>
          {recommandedBooks && recommandedBooks.length > 0 ? (
            <div className="flex flex-col px-4 pb-32">
              {recommandedBooks.map((book) => (
                <WishBookCard key={book.itemId} wishBook={book} />
              ))}

              {/* 다른 추천 보기 버튼 */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="mt-3 mx-auto flex items-center gap-1 px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary-light hover:text-white transition-all text-sm"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                다른 추천 보기
              </button>
              <div className="text-center text-gray-500 text-sm mt-2">
                <p>추천 도서가 마음에 들지 않나요? 새로고침해보세요!</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-48 px-3 py-6 mx-2">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                아직 맞춤 추천을 준비 중이에요
              </h3>
              <p className="text-gray-600 text-center text-sm">
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
