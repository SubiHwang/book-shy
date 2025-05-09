// src/components/mylibrary/BookDetail/BookDetail.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import TabNavBar from '@/components/common/TabNavBar';
import {
  fetchBookDetail,
  updateBookVisibility,
  BookDetailResponse,
} from '@/services/mylibrary/bookDetailService';

interface BookDetailProps {
  bookId: number;
}

interface BookDetailState extends BookDetailResponse {
  libraryId: number;
  isPublic: boolean;
}

const BookDetail: React.FC<BookDetailProps> = ({ bookId }) => {
  const [bookDetail, setBookDetail] = useState<BookDetailState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 탭 페이지 설정
  const pages = [
    { path: `/bookshelf/books/${bookId}`, label: '정보' },
    { path: `/bookshelf/books/${bookId}/notes`, label: '내 독서 기록' },
  ];

  // 현재 경로가 기본 경로인지 확인 (/bookshelf/books/:id)
  useEffect(() => {
    if (location.pathname === `/bookshelf/books/${bookId}`) {
      navigate(`/bookshelf/books/${bookId}`, { replace: true });
    }
  }, [bookId, location.pathname, navigate]);

  // 서재 책 정보 로드
  useEffect(() => {
    const loadBookDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // API를 통해 책 상세 정보 가져오기
        const response = await fetchBookDetail(bookId);

        // 응답 데이터를 상태에 설정
        setBookDetail({
          ...response,
          libraryId: bookId,
          // isPublic: false, // 초기값, 실제로는 API에서 받아와야 함
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
  }, [bookId]);

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

  // 도서 정보 컴포넌트
  const BookInfoContent = () => {
    if (!bookDetail) return null;

    return (
      <div className="px-4 py-5">
        <h2 className="text-xl font-bold mb-4">도서 정보</h2>
        <div className="bg-light-bg-secondary rounded-lg mb-4 shadow-sm">
          <div className="flex items-center p-4 border-b border-gray-100">
            {/* 달력 아이콘 - 원형 배경 추가 */}
            <div className="w-8 h-8 mr-3 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="w-20 flex-shrink-0">
              <p className="text-sm text-gray-500">출간일</p>
            </div>
            <div className="flex-grow text-right">
              <p className="text-sm text-gray-700 font-medium">
                {bookDetail.pubDate || '정보 없음'}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 border-b border-gray-100">
            {/* 책 페이지 아이콘 - 원형 배경 추가 */}
            <div className="w-8 h-8 mr-3 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div className="w-20 flex-shrink-0">
              <p className="text-sm text-gray-500">페이지</p>
            </div>
            <div className="flex-grow text-right">
              <p className="text-sm text-gray-700 font-medium">
                {bookDetail.pageCount ? `${bookDetail.pageCount}쪽` : '정보 없음'}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4">
            {/* 태그 아이콘 - 원형 배경 추가 */}
            <div className="w-8 h-8 mr-3 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div className="w-20 flex-shrink-0">
              <p className="text-sm text-gray-500">카테고리</p>
            </div>
            <div className="flex-grow text-right">
              <p className="text-sm text-gray-700 font-medium">
                {bookDetail.category || '정보 없음'}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-3">책 소개</h2>
        <div className="bg-light-bg-secondary rounded-lg mb-6 shadow-sm">
          <div className="p-4">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {bookDetail.description || '책 소개 정보가 없습니다.'}
            </p>
          </div>
        </div>
      </div>
    );
  };

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
    <div className="bookshelf-container flex flex-col min-h-screen">
      {/* 헤더 부분 - 그라데이션 적용 */}
      <div className="bg-gradient-to-r from-[#FCF6D4] to-[#F4E8B8] p-4 flex items-center justify-between flex-shrink-0">
        <button onClick={handleBack} className="text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-center text-lg font-medium text-gray-800">도서 상세 보기</h1>
        <div className="w-6 h-6">{/* 간격 맞춤을 위한 빈 div */}</div>
      </div>

      {/* 책 정보 섹션 - 그라데이션 적용, 레이아웃 개선 */}
      <div className="bg-gradient-to-r from-[#FCF6D4] to-[#F4E8B8] p-4  flex-shrink-0">
        <div className="flex flex-row items-start">
          {/* 책 표지 이미지 - 고정 크기 유지 */}
          <div className="w-26 h-36 flex-shrink-0 mr-4 rounded-md overflow-hidden shadow-md">
            <img
              src={bookDetail.coverImageUrl || '/placeholder-book.jpg'}
              alt={bookDetail.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-book.jpg';
              }}
            />
          </div>

          {/* 책 정보 - 제목이 길어도 전체 표시 */}
          <div className="flex-1 min-w-0 flex flex-col min-h-36 justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2 break-words">{bookDetail.title}</h2>
              <p className="text-sm mb-1 truncate">작가: {bookDetail.author || '정보 없음'}</p>
              <p className="text-sm mb-1 truncate">출판사: {bookDetail.publisher || '정보 없음'}</p>
            </div>

            <button
              className="mt-3 py-1.5 px-4 rounded-full bg-white text-gray-700 shadow-sm hover:bg-gray-50 text-sm font-medium transition-colors self-start"
              onClick={togglePublicStatus}
            >
              {bookDetail.isPublic ? '공개 서재에서 숨기기' : '공개 서재에 추가'}
            </button>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-light-bg flex-shrink-0 border-b border-gray-200">
        <TabNavBar pages={pages} />
      </div>

      {/* 중첩 라우트 컨텐츠 - overflow 설정으로 스크롤 가능 */}
      <div className="bg-light-bg flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-screen-md mx-auto">
          {location.pathname === `/bookshelf/books/${bookId}` ? <BookInfoContent /> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
