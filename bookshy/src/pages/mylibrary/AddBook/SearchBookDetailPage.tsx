// src/pages/mylibrary/AddBook/SearchBookDetailPage.tsx
import Header from '@/components/common/Header';
import SearchBookDetailHeader from '@/components/mylibrary/BookAdd/SearchBookDetailHeader';
import SearchBookDetailBody from '@/components/mylibrary/BookAdd/SearchBookDetailBody';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { fetchBookDetailByItemId } from '@/services/book/search';
import { addBookFromSearch } from '@/services/mylibrary/bookSearchService';
import { BookDetail } from '@/services/book/search';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

interface LocationState {
  inLibrary?: boolean;
  libraryId?: number;
}

const SearchBookDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const itemId = id ? Number(id) : undefined;

  // 전달받은 상태 가져오기
  const state = (location.state as LocationState) || {};
  console.log('SearchBookDetailPage - 전달받은 state:', state);

  const [bookDetail, setBookDetail] = useState<BookDetail | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inLibrary, setInLibrary] = useState<boolean>(!!state.inLibrary);
  const [_libraryId, setLibraryId] = useState<number | undefined>(state.libraryId);

  const queryClient = useQueryClient();

  // 책 상세 정보만 가져오기
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    const fetchBookDetail = async () => {
      if (!itemId || isNaN(itemId)) {
        console.error('책 ID가 유효하지 않습니다.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetchBookDetailByItemId(itemId);
        setBookDetail(response);
      } catch (error) {
        console.error('책 상세 정보 가져오기 실패:', error);
        toast.error('책 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetail();
  }, [itemId]);

  // 서재에 책 추가
  const handleAddBook = useCallback(
    async (bookItemId: number) => {
      if (!bookItemId) return;

      // 낙관적 업데이트 - API 호출 전 UI 먼저 업데이트
      setInLibrary(true);

      try {
        // 정확한 API 호출
        const response = await addBookFromSearch(bookItemId);

        // API 응답 후 정확한 정보로 상태 업데이트
        setLibraryId(response.libraryId);

        // 서재 관련 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: ['myLibraryBooks'] });

        toast.success('책이 서재에 추가되었습니다!');
      } catch (error) {
        console.error('책 추가 중 오류:', error);
        // 에러 발생 시 상태 원복
        setInLibrary(false);
        toast.error('책 추가에 실패했습니다. 다시 시도해주세요.');
      }
    },
    [queryClient],
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
              itemId={itemId}
              title={bookDetail.title}
              author={bookDetail.author}
              publisher={bookDetail.publisher}
              coverImageUrl={bookDetail.coverImageUrl}
              isLoading={isLoading}
              onAddBook={handleAddBook}
              inLibrary={inLibrary}
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
          <div className="flex-1 flex items-center justify-center p-4">
            {isLoading ? (
              <p className="text-gray-500">책 정보를 불러오는 중입니다...</p>
            ) : (
              <p className="text-gray-500">책 정보를 찾을 수 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBookDetailPage;
