import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LibraryBook } from '@/types/book';
import TabNavBar from '@/components/common/TabNavBar';

interface BookDetailProps {
  bookId: number;
}

const BookDetail: React.FC<BookDetailProps> = ({ bookId }) => {
  const [libraryBook, setLibraryBook] = useState<LibraryBook | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 탭 페이지 설정
  const pages = [
    { path: `/bookshelf/books/${bookId}/info`, label: '정보' },
    { path: `/bookshelf/books/${bookId}/notes`, label: '내 독서 기록' },
  ];

  // 현재 경로가 기본 경로인지 확인 (/bookshelf/books/:id)
  useEffect(() => {
    if (location.pathname === `/bookshelf/books/${bookId}`) {
      navigate(`/bookshelf/books/${bookId}/info`, { replace: true });
    }
  }, [bookId, location.pathname, navigate]);

  // 서재 책 정보 로드
  useEffect(() => {
    const fetchLibraryBook = async () => {
      try {
        setLoading(true);

        // 실제 API 연동 시 아래 주석 해제
        // const response = await fetch(`/api/library/${bookId}`);
        // const data = await response.json();
        // setLibraryBook(data);

        // 임시 데이터 (API 연동 전까지 사용)
        setTimeout(() => {
          const mockLibraryBook: LibraryBook = {
            libraryId: 1,
            bookId: bookId,
            title: '어린왕자',
            author: '생텍쥐페리',
            translator: '김경식',
            publisher: '더스토리북',
            summary:
              "어린 시절부터 어른이 된 지금까지 전 세계인의 사랑을 받는 가장 위대한 이야기. 생텍쥐페리의 '어린 왕자'는 사막에 불시착한 조종사가 어린 왕자를 만나면서 펼쳐지는 환상적인 이야기로, 어린이와 어른 모두에게 참의 본질과 사랑의 의미를 일깨워주는 작품입니다.어린 시절부터 어른이 된 지금까지 전 세계인의 사랑을 받는 가장 위대한 이야기. 생텍쥐페리의 '어린 왕자'는 사막에 불시착한 조종사가 어린 왕자를 만나면서 펼쳐지는 환상적인 이야기로, 어린이와 어른 모두에게 참의 본질과 사랑의 의미를 일깨워주는 작품입니다어린 시절부터 어른이 된 지금까지 전 세계인의 사랑을 받는 가장 위대한 이야기. 생텍쥐페리의 '어린 왕자'는 사막에 불시착한 조종사가 어린 왕자를 만나면서 펼쳐지는 환상적인 이야기로, 어린이와 어른 모두에게 참의 본질과 사랑의 의미를 일깨워주는 작품입니다",
            publishDate: '2014년 8월 15일',
            pages: 138,
            categories: '소설 > 고전문학',
            registeredAt: '2025-04-30T12:00:00',
            isPublic: false,
            bookImgUrl: 'https://image.aladin.co.kr/product/26/0/cover500/s742633278_1.jpg',
          };

          setLibraryBook(mockLibraryBook);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('책 정보를 가져오는 중 오류 발생:', err);
        setError('책 정보를 불러오는 중 문제가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchLibraryBook();
  }, [bookId]);

  const handleBack = () => {
    navigate('/bookshelf'); // 서재 페이지로 돌아가기
  };

  // 공개 상태 토글 함수
  const togglePublicStatus = async () => {
    if (!libraryBook) return;

    try {
      const newPublicStatus = !libraryBook.isPublic;

      // 실제 API 연동 시 아래 주석 해제
      // await fetch(`/api/library/${libraryBook.libraryId}/visibility`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ isPublic: newPublicStatus }),
      // });

      // 상태 업데이트
      setLibraryBook({
        ...libraryBook,
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

  // const handleTabChange = (tabId: string) => {
  //   // 다른 탭으로 이동 처리
  //   navigate(`/${tabId}`);
  // };

  // 도서 정보 컴포넌트
  const BookInfoContent = () => {
    if (!libraryBook) return null;

    return (
      <div className="m-5">
        <h2 className="text-xl font-bold mb-4">도서 정보</h2>

        <div className="bg-light-bg-secondary rounded-lg mb-4">
          <div className="flex items-center p-3 border-b border-gray-100">
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
            <div className="flex-grow">
              <p className="text-sm text-gray-500">출간일</p>
            </div>
            <div className="text-sm text-gray-700">{libraryBook.publishDate}</div>
          </div>

          <div className="flex items-center p-3 border-b border-gray-100">
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
            <div className="flex-grow">
              <p className="text-sm text-gray-500">페이지</p>
            </div>
            <div className="text-sm text-gray-700">{libraryBook.pages}쪽</div>
          </div>

          <div className="flex items-center p-3">
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
            <div className="flex-grow">
              <p className="text-sm text-gray-500">카테고리</p>
            </div>
            <div className="text-sm text-gray-700">{libraryBook.categories}</div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-3">책 소개</h2>
        <div className="bg-light-bg-secondary rounded-lg mb-4">
          <div className="p-4">
            <p className="text-sm text-gray-700 leading-relaxed">{libraryBook.summary}</p>
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

  if (error || !libraryBook) {
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
    <div className="bookshelf-container flex flex-col h-screen">
      {/* 헤더 부분 - 그라데이션 적용 */}
      <div className="bg-gradient-to-r from-[#FCF6D4] to-[#F4E8B8] p-4 flex items-center justify-between">
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
        <button className="text-gray-700">
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
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      </div>

      {/* 책 정보 섹션 - 그라데이션 적용 */}
      <div className="bg-gradient-to-r from-[#FCF6D4] to-[#F4E8B8] px-4 pt-4 pb-5 mb-1">
        <div className="flex">
          <div className="w-28 h-36 ml-6 mr-6">
            <img
              src={libraryBook.bookImgUrl || '/placeholder-book.jpg'}
              alt={libraryBook.title}
              className="w-full h-full object-cover rounded-sm shadow-sm"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-book.jpg';
              }}
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-bold mb-1 mt-1">{libraryBook.title}</h2>
            <p className="text-sm ">작가 : {libraryBook.author}</p>
            {libraryBook.translator && (
              <p className="text-sm ">옮긴이 : {libraryBook.translator}</p>
            )}
            <p className="text-sm mb-1">출판사 : {libraryBook.publisher}</p>

            <button
              className="mt-1 py-1.5 px-4 rounded-full bg-white text-gray-700 shadow-ml hover:bg-gray-50 text-sm"
              onClick={togglePublicStatus}
            >
              {libraryBook.isPublic ? '공개 서재에서 숨기기' : '공개 서재에 추가'}
            </button>
          </div>
        </div>
      </div>

      {/* 기존 탭 네비게이션 */}
      <div className="bg-light-bg">
        <TabNavBar pages={pages} />
      </div>

      {/* 중첩 라우트 컨텐츠*/}
      <div className="bg-light-bg flex-1 overflow-auto">
        <div className="max-w-screen-md mx-auto px-4">
          {location.pathname.includes('/info') ? <BookInfoContent /> : <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
