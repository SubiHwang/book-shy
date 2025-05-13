import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { fetchBookNote } from '@/services/mybooknote/booknote/booknote';
import { fetchBookQuote } from '@/services/mybooknote/booknote/bookquote';
import { updateNoteWithQuote } from '@/services/mybooknote/booknote/booknotequote';
import BookNoteForm from '@/components/mybooknote/booknote/BookNoteForm';
import BookNoteHeaderCard from '@/components/mybooknote/BookDetailHeaderSection';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import Loading from '@/components/common/Loading';
import Header from '@/components/common/Header';

const BookNoteEditPage: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const numericBookId = bookId ? Number(bookId) : null;

  const { data: book, isLoading: loadingNote } = useQuery({
    queryKey: ['book-note', numericBookId],
    queryFn: () => fetchBookNote(numericBookId as number),
    enabled: typeof numericBookId === 'number',
  });

  const { data: quote, isLoading: loadingQuote } = useQuery({
    queryKey: ['book-quote', numericBookId],
    queryFn: () => fetchBookQuote(numericBookId as number),
    enabled: typeof numericBookId === 'number',
  });

  const [quoteText, setQuoteText] = useState('');
  const [reviewText, setReviewText] = useState('');

  // 데이터 초기화 (quote, book이 불러와진 뒤에만)
  useEffect(() => {
    if (quote?.content !== undefined) setQuoteText(quote.content);
    if (book?.content !== undefined) setReviewText(book.content);
  }, [quote, book]);

  // useMutation으로 업데이트 처리
  const { mutate: saveChanges, isPending } = useMutation({
    mutationFn: () => {
      if (!book?.reviewId || !quote?.quoteId) {
        throw new Error('필요한 정보가 없습니다.');
      }

      return updateNoteWithQuote({
        reviewId: book.reviewId,
        quoteId: quote.quoteId,
        reviewContent: reviewText,
        quoteContent: quoteText,
      });
    },
    onSuccess: () => {
      // 수정 후 쿼리 무효화 (React Query 캐시 새로고침)
      queryClient.invalidateQueries({ queryKey: ['book-note'] });
      queryClient.invalidateQueries({ queryKey: ['book-quote'] });
      queryClient.invalidateQueries({ queryKey: ['my-booknotes'] });

      toast.success('독서 기록이 성공적으로 수정되었습니다.');
      navigate(`/booknotes/detail/${bookId}`);
    },
    onError: (error) => {
      console.error('수정 실패:', error);
      toast.error('독서 기록 수정에 실패했습니다.');
    },
  });

  const handleSave = () => {
    if (quoteText.trim() === '' && reviewText.trim() === '') {
      toast.warning('인용구 또는 감상기록을 작성해주세요.');
      return;
    }

    saveChanges();
  };

  // 로딩 상태 처리
  if (loadingNote || loadingQuote) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loading loadingText="독서 기록을 불러오는 중..." />
      </div>
    );
  }

  // 에러 상태 처리
  if (!numericBookId || !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <p className="text-lg text-gray-700 mb-2">책 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary-light font-medium"
        >
          <ArrowLeft size={16} />
          <span>이전 페이지로 돌아가기</span>
        </button>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="독서 감상 수정하기기"
        showBackButton={true}
        showNotification={true}
        onBackClick={() => {
          navigate(-1);
        }}
      />

      <BookNoteHeaderCard
        title={book.title || '제목 없음'}
        author={book.author || '저자 미상'} // 옵셔널 체이닝 대신 기본값 사용
        publisher={book.publisher || '출판사 정보 없음'} // 옵셔널 체이닝 대신 기본값 사용
        coverUrl={book.coverUrl || undefined}
      />

      <div className="bg-white">
        <div className="border-b border-gray-200 py-3 px-4">
          <h1 className="text-lg font-medium text-gray-800">독서 기록 수정</h1>
          <p className="text-sm text-gray-500">인용구와 감상 기록을 자유롭게 수정하세요.</p>
        </div>

        <BookNoteForm
          quoteText={quoteText}
          reviewText={reviewText}
          setQuoteText={setQuoteText}
          setReviewText={setReviewText}
          onSubmit={handleSave}
          onCancel={() => {
            navigate(-1);
          }}
          submitLabel={isPending ? '수정 중...' : '수정하기'}
        />
      </div>
    </div>
  );
};

export default BookNoteEditPage;
