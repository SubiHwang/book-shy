// src/pages/mylibrary/BookDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Outlet } from 'react-router-dom';
import BookDetailHeader from '@/components/mylibrary/BookDetail/BookDetailHeader';
import TabNavBar from '@/components/common/TabNavBar';
import {
  deleteLibraryBook,
  fetchBookDetail,
  updateBookVisibility,
  BookDetailResponse,
} from '@/services/mylibrary/bookDetailService';
import Header from '@/components/common/Header';

interface BookDetailState extends BookDetailResponse {
  libraryId: number;
  isPublic: boolean;
}

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [bookDetail, setBookDetail] = useState<BookDetailState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ID 유효성 확인
  const isValidId = !!id;
  const bookId = isValidId ? parseInt(id) : 0;

  // 탭 페이지 설정
  const pages = [
    { path: `/bookshelf/books/${bookId}`, label: '정보' },
    { path: `/bookshelf/books/${bookId}/notes`, label: '내 독서 기록' },
  ];

  // 현재 경로가 기본 경로인지 확인 (/bookshelf/books/:id)
  useEffect(() => {
    if (isValidId && location.pathname === `/bookshelf/books/${bookId}`) {
      navigate(`/bookshelf/books/${bookId}`, { replace: true });
    }
  }, [bookId, location.pathname, navigate, isValidId]);

  const handleDeleteBook = async () => {
    if (!bookDetail) return;

    if (window.confirm('정말로 이 책을 삭제하시겠습니까?')) {
      try {
        await deleteLibraryBook(bookDetail.libraryId);
        alert('책이 성공적으로 삭제되었습니다.');
        navigate('/bookshelf'); // 서재 페이지로 이동
      } catch (error) {
        console.error('책 삭제 중 오류 발생:', error);
        alert('책 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 서재 책 정보 로드
  useEffect(() => {
    const loadBookDetail = async () => {
      if (!isValidId) {
        setError('책 ID가 올바르지 않습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // API를 통해 책 상세 정보 가져오기
        const response = await fetchBookDetail(bookId);

        // 응답 데이터를 상태에 설정
        setBookDetail({
          ...response,
          libraryId: bookId,
        });

        console.log('책 상세 정보 로드 완료:', response);
      } catch (err) {
        console.error('책 정보를 가져오는 중 오류 발생:', err);
        setError('책 정보를 불러오는 중 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadBookDetail();
  }, [bookId, isValidId]);

  const handleBack = () => {
    navigate('/bookshelf'); // 서재 페이지로 돌아가기
  };

  // 공개 상태 토글 함수
  const togglePublicStatus = async () => {
    if (!bookDetail) return;

    try {
      const newPublicStatus = !bookDetail.isPublic;

      // API를 통해 책 공개 상태 변경
      await updateBookVisibility(bookDetail.libraryId, newPublicStatus);

      // 상태 업데이트
      setBookDetail({
        ...bookDetail,
        isPublic: newPublicStatus,
      });

      // 알림 표시
      if (newPublicStatus) {
        alert('공개 서재에 추가되었습니다.');
      } else {
        alert('공개 서재에서 숨김 처리되었습니다.');
      }
    } catch (error) {
      console.error('공개 상태 변경 중 오류 발생:', error);
      alert('공개 상태 변경 중 오류가 발생했습니다.');
    }
  };

  // 조건부 반환을 Hook 호출 후에 배치
  if (!isValidId) {
    return <div className="p-6">책 ID가 올바르지 않습니다.</div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#FCF6D4] to-[#F4E8B8]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#FCF6D4] border-t-[#F4E8B8] rounded-full animate-spin mb-3"></div>
          <p className="text-gray-700 text-sm">책 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !bookDetail) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-[#FCF6D4] to-[#F4E8B8]">
        <p className="text-red-500 mb-4">{error || '책 정보를 찾을 수 없습니다.'}</p>
        <button onClick={handleBack} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 공통 Header 컴포넌트 사용 - 알림 아이콘 표시 */}
      <Header
        title="도서 상세 보기"
        showBackButton={true}
        showNotification={true} // 알림 아이콘 표시
        className="bg-gradient-to-r from-[#FCF6D4] to-[#F4E8B8] shadow-none"
        onBackClick={() => navigate(-1)}
      />
      <div className="bookshelf-container flex flex-col min-h-screen">
        {/* 헤더와 책 정보 컴포넌트 */}
        <BookDetailHeader
          bookDetail={bookDetail}
          onBack={handleBack}
          onDelete={handleDeleteBook}
          onTogglePublicStatus={togglePublicStatus}
        />

        {/* 탭 네비게이션 */}
        <div className="bg-light-bg flex-shrink-0 border-b border-gray-200">
          <TabNavBar pages={pages} />
        </div>

        {/* 중첩 라우트 컨텐츠 - overflow 설정으로 스크롤 가능 */}
        <div className="bg-light-bg flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-screen-md mx-auto">
            <Outlet context={{ bookDetail }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetailPage;
