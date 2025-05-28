import Header from '@/components/common/Header';
import WishBooksDetailInfoHeader from '@/components/matching/wishbooks/WishBooksDetailInfoHeader';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getWishBookDetail } from '@/services/matching/wishbooks';
import { WishBook } from '@/types/book';
import WishBooksDetailInfoBody from '@/components/matching/wishbooks/WishBooksDetailInfoBody';
import Loading from '@/components/common/Loading';
import { fetchBookDetailByBookId } from '@/services/book/search';

const WishBooksDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const from = queryParams.get('from');
  const { id } = useParams<{ id: string }>();
  const [bookDetail, setBookDetail] = useState<WishBook | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    const fetchBookDetail = async (bookId: number) => {
      setIsLoading(true);
      setError(null);

      try {
        if (from === 'neighborhood-bookshelf') {
          const response = await fetchBookDetailByBookId(bookId);
          console.log('책 상세 정보:', response);
          setBookDetail(response);
        } else if (from === 'wish-book-card') {
          const response = await getWishBookDetail(bookId);
          console.log('책 상세 정보:', response);
          setBookDetail(response);
        }
      } catch (error) {
        console.error('책 상세 정보 가져오기 실패:', error);
        setError('책 정보를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id && !isNaN(Number(id))) {
      fetchBookDetail(Number(id));
    } else {
      console.error('책 ID가 유효하지 않습니다.');
      setError('유효하지 않은 책 ID입니다.');
      setIsLoading(false);
    }
  }, [id]);

  return (
    <div>
      <Header
        title="도서 상세 보기"
        showBackButton={true}
        showNotification={true}
        className="bg-light-bg shadow-none"
        onBackClick={() => navigate(-1)}
      />
      <div className="bookshelf-container flex flex-col min-h-screen">
        {isLoading ? (
          <Loading loadingText="책 정보를 불러오는 중..." />
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                뒤로 가기
              </button>
            </div>
          </div>
        ) : bookDetail ? (
          <>
            <WishBooksDetailInfoHeader
              itemId={bookDetail.itemId}
              title={bookDetail.title}
              author={bookDetail.author}
              publisher={bookDetail.publisher}
              coverImageUrl={bookDetail.coverImageUrl}
              isLiked={bookDetail.isLiked}
              isLoading={false}
            />
            <div className="bg-light-bg flex-1 overflow-y-auto overflow-x-hidden">
              <div className="max-w-screen-md mx-auto">
                <WishBooksDetailInfoBody
                  pubDate={bookDetail.pubDate}
                  pageCount={bookDetail.pageCount}
                  category={bookDetail.category}
                  description={bookDetail.description}
                  isLoading={false}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p>책 정보를 찾을 수 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishBooksDetailPage;
