// src/pages/mylibrary/ISBNScanResultPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import bookAddService from '@/services/mylibrary/isbnresultservice';
import { ISBNSearchResponse } from '@/types/mylibrary/isbn';

const ISBNScanResultPage: React.FC = () => {
  const { isbn } = useParams<{ isbn: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookDetail, setBookDetail] = useState<ISBNSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookByISBN = async () => {
      if (!isbn) {
        setError('ISBN 정보가 올바르지 않습니다.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // API를 통해 ISBN으로 책 정보 검색
        const response = await bookAddService.searchBookByISBN(isbn);
        setBookDetail(response);
        setIsLoading(false);
      } catch (err) {
        console.error('ISBN 검색 오류:', err);
        setError('책 정보를 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    fetchBookByISBN();
  }, [isbn]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleScanAgain = () => {
    navigate('/bookshelf/add/isbn');
  };

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
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-light-text-secondary text-lg mb-4">{error}</p>
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
                      onClick={() => alert('전체 내용 보기 기능은 개발 중입니다.')}
                    >
                      더 보기
                    </button>
                  )}
                </div>
              )}

              {/* 버튼 */}
              <div className="space-y-3">
                <button
                  onClick={handleScanAgain}
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
