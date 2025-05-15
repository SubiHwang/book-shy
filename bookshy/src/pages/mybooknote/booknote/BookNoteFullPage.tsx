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

  useEffect(() => {
    const noReview = !book || !book.content || book.content.trim() === '';
    const noQuote = !quote || !quote.content || quote.content.trim() === '';

    if (!loadingBook && !loadingQuote && noReview && noQuote && numericBookId) {
      setRedirecting(true);
      navigate(`/booknotes/create?bookId=${numericBookId}`);
    }
  }, [book, quote, loadingBook, loadingQuote, navigate, numericBookId]);

  if (!numericBookId) {
    return <p className="p-4">잘못된 접근입니다.</p>;
  }

  if (loadingBook || loadingQuote || redirecting) {
    return <Loading loadingText={redirecting ? '작성 페이지로 이동 중...' : '불러오는 중...'} />;
  }

  if (!book) {
    return <p className="p-4">책 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="pb-8 bg-gray-50 min-h-screen">
      <Header
        title="독서 기록 상세보기"
        showBackButton
        onBackClick={() => navigate('/booknotes')}
        showNotification
      />
      <BookDetailHeader
        coverImageUrl={book.coverUrl}
        title={book.title}
        author={book.author}
        publisher={book.publisher}
      />
      <div className="px-4">
        <div className="flex justify-between items-center mb-4 mt-3">
          <h2 className="text-base font-medium text-gray-800">나의 독서 기록</h2>
          <button
            onClick={() => navigate(`/booknotes/edit/${numericBookId}`)}
            className="flex items-center gap-1 text-sm text-primary-accent border border-primary-accent px-3 py-1.5 rounded-md"
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
