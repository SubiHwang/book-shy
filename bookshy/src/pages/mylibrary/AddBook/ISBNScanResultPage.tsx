import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Book } from '@/types/book';

const ISBNScanResultPage: React.FC = () => {
  const { isbn } = useParams<{ isbn: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookDetail, setBookDetail] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookByISBN = async () => {
      setIsLoading(true);

      try {
        // 개발용 더미 데이터
        setTimeout(() => {
          if (isbn) {
            const dummyData: Book = {
              bookId: 1,
              title: '총, 균, 쇠',
              author: '제레드 다이아몬드',
              publisher: '김영사',
              publishDate: '2005-12-19',
              translator: '김진준',
              categories: '역사/문명',
              summary:
                '왜 어떤 민족들은 다른 민족들의 정복과 지배의 대상으로 전락했는가? 왜 원주민들은 유럽인들을 정복하지 못하고 그 반대가 되었는가? 왜 잉카 제국의 황제는 스페인 국왕을 포로로 잡지 못하고 그 반대가 되었는가? 정복의 불균형 뒤에 숨겨진 지리, 생물학, 문명의 비밀을 밝혀낸다.',
              bookImgUrl: 'https://image.aladin.co.kr/product/26/0/cover500/s742633278_1.jpg',
              pages: 752,
            };
            setBookDetail(dummyData);
          } else {
            setError('ISBN 정보가 올바르지 않습니다.');
          }
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError('책 정보를 불러오는데 실패했습니다.');
        setIsLoading(false);
      }
    };

    fetchBookByISBN();
  }, [isbn]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAddBook = () => {
    navigate('/bookshelf');
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
                  src={bookDetail.bookImgUrl}
                  alt={bookDetail.title}
                  loading="lazy"
                  className="w-[160px] h-[240px] object-cover rounded-md border shadow-sm flex-shrink-0"
                />

                {/* 책 텍스트 정보 */}
                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 line-clamp-2 mb-1">
                      {bookDetail.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">{bookDetail.author} 저</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {bookDetail.translator && <li>역자: {bookDetail.translator}</li>}
                      <li>출판사: {bookDetail.publisher}</li>
                      {bookDetail.publishDate && (
                        <li>
                          출판일: {new Date(bookDetail.publishDate).toLocaleDateString('ko-KR')}
                        </li>
                      )}
                      {bookDetail.pages && <li>페이지: {bookDetail.pages}쪽</li>}
                      {bookDetail.categories && <li>분류: {bookDetail.categories}</li>}
                      <li>ISBN: {isbn}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 책 소개 */}
              {bookDetail.summary && (
                <div>
                  <h3 className="text-ml font-semibold text-gray-800 mb-1 mt-8">책 소개</h3>
                  <p className="text-sm text-gray-600 line-clamp-4 mb-16">{bookDetail.summary}</p>
                  {bookDetail.summary.length > 250 && (
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
                  onClick={handleAddBook}
                  className="w-full py-3 bg-primary-light text-white rounded-lg font-semibold hover:bg-primary-accent transition"
                >
                  <Check size={18} className="inline mr-2" />내 서재에 추가하기
                </button>
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
