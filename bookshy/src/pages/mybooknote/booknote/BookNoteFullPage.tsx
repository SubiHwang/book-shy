import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBookNote } from '@/services/mybooknote/booknote/booknote';
import { fetchBookQuote } from '@/services/mybooknote/booknote/bookquote';
import BookDetailHeader from '@/components/mybooknote/booknote/BookNoteHeader';
import BookNoteView from '@/components/mybooknote/booknote/BookNoteView';
import Header from '@/components/common/Header';
import { Edit2 } from 'lucide-react';
import Loading from '@/components/common/Loading';

const BookNoteFullPage: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const numericBookId = bookId ? Number(bookId) : null;

  const [redirecting, setRedirecting] = useState(false);

  // ✅ 항상 호출, 실행 여부는 enabled로 제어
  const { data: book, isLoading: loadingBook } = useQuery({
    queryKey: ['book-note', numericBookId],
    queryFn: () => fetchBookNote(numericBookId!),
    enabled: numericBookId !== null,
  });

  const { data: quote, isLoading: loadingQuote } = useQuery({
    queryKey: ['book-quote', numericBookId],
    queryFn: () => fetchBookQuote(numericBookId!),
    enabled: numericBookId !== null,
  });

  // ✅ 리디렉션 처리: 둘 다 없을 때
  useEffect(() => {
    const noReview = !book || !book.content || book.content.trim() === '';
    const noQuote = !quote || !quote.content || quote.content.trim() === '';

    if (!loadingBook && !loadingQuote && noReview && noQuote && numericBookId) {
      setRedirecting(true);
      navigate(`/booknotes/create?bookId=${numericBookId}`);
    }
  }, [book, quote, loadingBook, loadingQuote, navigate, numericBookId]);

  // ✅ 잘못된 접근 처리
  if (!numericBookId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-600">잘못된 접근입니다 (bookId 없음).</p>
      </div>
    );
  }

  // ✅ 로딩 or 리디렉팅 중
  if (loadingBook || loadingQuote || redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading
          loadingText={redirecting ? '작성 페이지로 이동 중...' : '독서 기록을 불러오는 중...'}
        />
      </div>
    );
  }

  // ✅ book이 없을 경우 (API 실패, 404 등)
  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <p className="text-lg text-gray-700 mb-2">책 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate('/booknotes')}
          className="flex items-center gap-1 text-primary-light font-medium"
        >
          <span>독서 기록 목록으로 돌아가기</span>
        </button>
      </div>
    );
  }

  // ✅ 정상 화면 렌더링
  return (
    <div className="pb-8 bg-gray-50 min-h-screen">
      <Header
        title="독서 기록 상세보기"
        showBackButton
        onBackClick={() => navigate('/booknotes')}
        showNotification
      />

      <BookDetailHeader
        coverImageUrl={book.coverUrl || undefined}
        title={book.title || '제목 없음'}
        author={book.author || '저자 미상'}
        publisher={book.publisher || '출판사 정보 없음'}
      />

      <div className="px-4">
        <div className="flex justify-between items-center mb-4 mt-3">
          <h2 className="text-base font-medium text-gray-800">나의 독서 기록</h2>
          <button
            onClick={() => navigate(`/booknotes/edit/${book.bookId}`)}
            className="flex items-center gap-1 text-sm text-primary-accent border border-primary-accent px-3 py-1.5 rounded-md hover:bg-primary-accent/10 transition-colors"
          >
            <Edit2 size={16} strokeWidth={1.5} />
            <span>수정하기</span>
          </button>
        </div>

        <BookNoteView quoteText={quote?.content || ''} reviewText={book.content || ''} />
      </div>
    </div>
  );
};

export default BookNoteFullPage;
