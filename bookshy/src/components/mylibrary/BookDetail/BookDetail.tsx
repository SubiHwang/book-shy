import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Book } from '@/types/book';
import Header from '@/components/common/Header';
import BottomTabBar from '@/components/common/BottomTabBar';
import TabNavBar from '@/components/common/TabNavBar';

interface BookDetailProps {
  bookId: number;
}

const BookDetail: React.FC<BookDetailProps> = ({ bookId }) => {
  const [book, setBook] = useState<Book | null>(null);
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

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);

        // 실제 API 연동 시 아래 주석 해제
        // const response = await fetch(`/api/books/${bookId}`);
        // const bookData = await response.json();
        // setBook(bookData);

        // 임시 데이터 (API 연동 전까지 사용)
        setTimeout(() => {
          const mockBook: Book = {
            bookId: bookId,
            title: '어린왕자',
            author: '생텍쥐페리',
            translator: '김경식',
            publisher: '더스토리북',
            summary:
              "어린 시절부터 어른이 된 지금까지 전 세계인의 사랑을 받는 가장 위대한 이야기. 생텍쥐페리의 '어린 왕자'는 사막에 불시착한 조종사가 어린 왕자를 만나면서 펼쳐지는 환상적인 이야기로, 어린이와 어른 모두에게 참의 본질과 사랑의 의미를 일깨워주는 작품입니다.",
            publishDate: '2014년 8월 15일',
            pages: 138,
            categories: '소설 > 고전문학',
            bookImgUrl: 'https://image.aladin.co.kr/product/11990/17/cover/8952766989_1.jpg',
          };
          setBook(mockBook);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error('책 상세 정보를 가져오는 중 오류 발생:', err);
        setError('책 정보를 불러오는 중 문제가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [bookId]);

  const handleBack = () => {
    navigate('/bookshelf'); // 서재 페이지로 돌아가기
  };

  // 공개 서재에 추가하는 함수
  const handleAddToPublicShelf = () => {
    alert('공개 서재에 추가되었습니다.');
    // 여기에 실제 API 호출 구현
  };

  const handleTabChange = (tabId: string) => {
    // 다른 탭으로 이동 처리
    navigate(`/${tabId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-light-bg">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 text-sm">책 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-light-bg">
        <p className="text-red-500 mb-4">{error || '책 정보를 찾을 수 없습니다.'}</p>
        <button onClick={handleBack} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="bookshelf-container flex flex-col h-screen bg-light-bg">
      {/* Header 컴포넌트 적용 */}
      <Header
        title="도서 상세 보기"
        onBackClick={handleBack}
        showBackButton={true}
        showNotification={true}
        extraButton={null}
        extraButtonIcon={null}
        onExtraButtonClick={() => {}}
        className="bg-light-bg shadow-md"
      />

      {/* 스크롤 영역 */}
      <div className="pb-16 bg-light-bg flex-1">
        <div className="max-w-screen-md mx-auto px-4 py-4">
          {/* 책 표지와 제목 섹션 */}
          <div className="bg-light-bg flex">
            <div className="w-24 h-32 mr-4">
              <img
                src={book.bookImgUrl || '/placeholder-book.jpg'}
                alt={book.title}
                className="w-full h-full object-cover rounded-md shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-book.jpg';
                }}
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
              <p className="text-sm mb-1">작가: {book.author}</p>
              {book.translator && <p className="text-sm mb-1">옮김이: {book.translator}</p>}
              <p className="text-sm mb-1">출판사: {book.publisher}</p>
              <button
                className="mt-2 bg-white text-gray-700 rounded-full py-1 px-4 text-sm"
                onClick={handleAddToPublicShelf}
              >
                공개 서재에 추가
              </button>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <TabNavBar pages={pages} />

          {/* 중첩 라우트 컨텐츠 */}
          <div className="tab-content mt-4">
            <Outlet />
          </div>
        </div>
      </div>

      {/* 공통 하단 네비게이션 바 사용 */}
      <BottomTabBar onTabChange={handleTabChange} />
    </div>
  );
};

export default BookDetail;
