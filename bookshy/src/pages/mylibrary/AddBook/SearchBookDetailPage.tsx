import Header from '@/components/common/Header';
import SearchBookDetailHeader from '@/components/mylibrary/BookAdd/SearchBookDetailHeader';
import SearchBookDetailBody from '@/components/mylibrary/BookAdd/SearchBookDetailBody';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { fetchBookDetailByItemId } from '@/services/book/search';
import { addBookFromSearch } from '@/services/mylibrary/bookSearchService';
import { BookDetail } from '@/services/book/search';
import { useQueryClient } from '@tanstack/react-query';

const SearchBookDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [bookDetail, setBookDetail] = useState<(BookDetail & { itemId?: number }) | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddingBook, setIsAddingBook] = useState<boolean>(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    const fetchBookDetail = async (bookId: number) => {
      setIsLoading(true);
      try {
        const response = await fetchBookDetailByItemId(bookId);
        setBookDetail({
          ...response,
          itemId: bookId, // id 파라미터로 전달된 값을 itemId로 설정
        });
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

  // 책 추가 핸들러
  const handleAddBook = useCallback(
    async (itemId: number) => {
      if (isAddingBook) return; // 이미 추가 중이면 중복 요청 방지

      setIsAddingBook(true);
      try {
        await addBookFromSearch(itemId);

        // 서재 관련 쿼리 무효화 (데이터 갱신)
        queryClient.invalidateQueries({ queryKey: ['myLibraryBooks'] });

        // 내 서재로 이동
        navigate('/mylibrary');
      } catch (error) {
        console.error('책 추가 중 오류:', error);
      } finally {
        setIsAddingBook(false);
      }
    },
    [navigate, isAddingBook, queryClient],
  );

  return (
    <div>
      <Header
        title="도서 검색 결과"
        showBackButton={true}
        showNotification={true}
        className="bg-light-bg shadow-none"
        onBackClick={() => navigate(-1)}
      />
      <div className="bookshelf-container flex flex-col min-h-screen">
        {bookDetail ? (
          <>
            <SearchBookDetailHeader
              itemId={bookDetail.itemId}
              title={bookDetail.title}
              author={bookDetail.author}
              publisher={bookDetail.publisher}
              coverImageUrl={bookDetail.coverImageUrl}
              isLoading={isLoading}
              onAddBook={handleAddBook}
            />
            <div className="bg-light-bg flex-1 overflow-y-auto overflow-x-hidden">
              <div className="max-w-screen-md mx-auto">
                <SearchBookDetailBody
                  pubDate={bookDetail.pubDate}
                  pageCount={bookDetail.pageCount}
                  category={bookDetail.category}
                  description={bookDetail.description}
                  isLoading={isLoading}
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

export default SearchBookDetailPage;
