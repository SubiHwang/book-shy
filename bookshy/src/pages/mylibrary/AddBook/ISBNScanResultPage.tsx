//src/pages/mylibrary/AddBook/ISBNScanResultPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchBookDetailsByISBN, registerBookByISBN } from '@/services/mylibrary/isbnresultService';
import { ISBNSearchResponse } from '@/types/mylibrary/isbn';

const ISBNScanResultPage: React.FC = () => {
  const { isbn } = useParams<{ isbn: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookDetail, setBookDetail] = useState<ISBNSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  console.log('컴포넌트 마운트 - ISBN:', isbn);

  useEffect(() => {
    const loadBookDetails = async () => {
      console.log('loadBookDetails 함수 시작 - ISBN:', isbn);

      if (!isbn) {
        console.error('ISBN이 없음');
        setError('ISBN 정보가 올바르지 않습니다.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      console.log('API 호출 시작...');

      try {
        console.log(`API 요청 URL: /api/book/search/isbn?isbn13=${isbn}`);
        const response = await fetchBookDetailsByISBN(isbn);
        console.log('API 응답 성공:', response);

        setBookDetail(response);
        console.log('상태 업데이트 - bookDetail 설정 완료');

        setIsLoading(false);
        console.log('로딩 상태 종료');
      } catch (err) {
        console.error('ISBN 검색 오류:', err);
        console.error('오류 세부 정보:', JSON.stringify(err, null, 2));

        let errorMessage = '책 정보를 불러오는데 실패했습니다.';
        if (err instanceof Error) {
          errorMessage += ` (${err.message})`;
        }

        setError(errorMessage);
        console.error('오류 상태 설정:', errorMessage);

        setIsLoading(false);
        console.log('오류로 인한 로딩 상태 종료');
      }
    };

    loadBookDetails();
  }, [isbn]);

  // 컴포넌트 상태 변경 감지
  useEffect(() => {
    console.log('컴포넌트 상태 변경:', {
      isLoading,
      hasError: !!error,
      errorMessage: error,
      hasBookDetail: !!bookDetail,
      isPublic,
    });
  }, [isLoading, error, bookDetail, isPublic]);

  const handleGoBack = () => {
    console.log('뒤로가기 버튼 클릭');
    navigate(-1);
  };

  const handleSaveBook = async () => {
    console.log('책 등록하기 버튼 클릭, 공개 설정:', isPublic);

    if (!isbn) {
      setRegistrationError('ISBN 정보가 없어 등록할 수 없습니다.');
      return;
    }

    try {
      setIsRegistering(true);
      setRegistrationError(null);

      // 서재에 책 등록 API 호출
      const registeredBook = await registerBookByISBN(isbn, isPublic);
      console.log('책 등록 성공:', registeredBook);

      // 알림 표시 후 서재 페이지로 이동
      alert('책이 성공적으로 등록되었습니다!');
      navigate('/bookshelf');
    } catch (err) {
      console.error('책 등록 오류:', err);

      let errorMessage = '책 등록에 실패했습니다.';
      if (err instanceof Error) {
        errorMessage += ` (${err.message})`;
      }

      setRegistrationError(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleScanAgain = () => {
    console.log('다시 스캔하기 버튼 클릭');
    navigate('/bookshelf/add/isbn');
  };

  const handleTogglePublic = () => {
    setIsPublic(!isPublic);
    console.log('공개 설정 변경:', !isPublic);
  };

  console.log('렌더링 시작 - 현재 상태:', { isLoading, error, hasBookDetail: !!bookDetail });

  return (
    <div className="flex flex-col h-screen bg-light-bg">
      {/* 헤더 */}
      <header className="bg-primary-light px-4 py-3 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <button onClick={handleGoBack} className="p-1">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold text-center flex-1 -ml-5">ISBN 스캔 결과</h1>
          <div className="w-6" /> {/* Placeholder for right side */}
        </div>
      </header>

      {/* 본문 */}
      <main className="flex-1 overflow-auto p-4 pb-24">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-300"></div>
            <p className="ml-3">ISBN {isbn} 검색 중...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-light-text-secondary text-lg mb-4">{error}</p>
            <p className="text-xs text-gray-500 mb-4">ISBN: {isbn}</p>
            <button
              onClick={handleScanAgain}
              className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition"
            >
              다시 스캔하기
            </button>
          </div>
        ) : (
          bookDetail && (
            <section className="bg-white rounded-xl shadow p-4 space-y-4">
              {/* 책 정보 */}
              <div className="flex gap-4">
                {/* 책 이미지 */}
                <img
                  src={bookDetail.coverImageUrl}
                  alt={bookDetail.title}
                  loading="lazy"
                  className="w-[160px] h-[240px] object-cover rounded-md border shadow-sm flex-shrink-0"
                  onError={(e) => {
                    console.log('이미지 로딩 오류, 대체 이미지 사용');
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-book.jpg';
                  }}
                />

                {/* 책 텍스트 정보 */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 line-clamp-2 mb-1">
                      {bookDetail.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">{bookDetail.author} 저</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>출판사: {bookDetail.publisher}</li>
                      {bookDetail.pubDate && <li>출판일: {bookDetail.pubDate}</li>}
                      {bookDetail.pageCount > 0 && <li>페이지: {bookDetail.pageCount}쪽</li>}
                      {bookDetail.category && <li>분류: {bookDetail.category}</li>}
                      <li>ISBN: {isbn}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 책 소개 */}
              {bookDetail.description && (
                <div>
                  <h3 className="text-ml font-semibold text-gray-800 mb-1 mt-8">책 소개</h3>
                  <p className="text-sm text-gray-600 line-clamp-4 mb-16">
                    {bookDetail.description}
                  </p>
                  {bookDetail.description.length > 250 && (
                    <button
                      className="text-xs text-primary-light mt-2"
                      onClick={() => {
                        console.log('더 보기 버튼 클릭');
                        alert('전체 내용 보기 기능은 개발 중입니다.');
                      }}
                    >
                      더 보기
                    </button>
                  )}
                </div>
              )}

              {/* 공개 설정 토글 추가 */}
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={handleTogglePublic}
                  className="w-4 h-4 text-primary-light focus:ring-primary-light rounded"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                  다른 사용자에게 이 책을 공개하기
                </label>
              </div>

              {/* 등록 오류 메시지 */}
              {registrationError && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
                  {registrationError}
                </div>
              )}

              {/* 버튼 */}
              <div className="space-y-3">
                {/* 책 등록하기 버튼 */}
                <button
                  onClick={handleSaveBook}
                  disabled={isRegistering}
                  className={`w-full py-3 ${
                    isRegistering ? 'bg-gray-400' : 'bg-primary-light hover:bg-primary-accent'
                  } text-white rounded-lg font-semibold transition`}
                >
                  {isRegistering ? '등록 중...' : '책 등록하기'}
                </button>

                {/* 다시 스캔하기 버튼 */}
                <button
                  onClick={handleScanAgain}
                  disabled={isRegistering}
                  className="w-full py-3 border border-light-text-muted/40 text-light-text-secondary rounded-lg hover:bg-light-bg-shade transition"
                >
                  다시 스캔하기
                </button>
              </div>
            </section>
          )
        )}
      </main>
    </div>
  );
};

export default ISBNScanResultPage;
