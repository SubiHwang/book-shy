import Header from '@/components/common/Header';
import WishBooksDetailInfoHeader from '@/components/matching/wishbooks/WishBooksDetailInfoHeader';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getWishBookDetail } from '@/services/matching/wishbooks';
import { WishBook } from '@/types/book';

const WishBooksDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [bookDetail, setBookDetail] = useState<WishBook | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookDetail = async (bookId: number) => {
      setIsLoading(true);
      try {
        const response = await getWishBookDetail(bookId);
        console.log('책 상세 정보:', response);
        setBookDetail(response);
      } catch (error) {
        console.error('책 상세 정보 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && !isNaN(Number(id))) {
      fetchBookDetail(Number(id));
    } else {
      console.error('책 ID가 유효하지 않습니다.');
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
        {bookDetail ? (
          <>
            <WishBooksDetailInfoHeader
              title={bookDetail.title}
              author={bookDetail.author}
              publisher={bookDetail.publisher}
              coverImageUrl={bookDetail.coverImageUrl}
              isLiked={bookDetail.isLiked}
              isLoading={isLoading}
            />
            <div className="bg-light-bg flex-1 overflow-y-auto overflow-x-hidden">
              <div className="max-w-screen-md mx-auto">
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