import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBookNote } from '@/services/mybooknote/booknote/booknote';
import { fetchBookQuote } from '@/services/mybooknote/booknote/bookquote';
import BookDetailHeader from '@/components/mybooknote/booknote/BookNoteHeader';
import BookNoteView from '@/components/mybooknote/booknote/BookNoteView';
import Header from '@/components/common/Header';

const BookNoteFullPage: React.FC = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const numericBookId = bookId ? Number(bookId) : null;

  const { data: book } = useQuery({
    queryKey: ['book-note', numericBookId],
    queryFn: () => fetchBookNote(numericBookId!),
    enabled: !!numericBookId,
  });

  const { data: quote } = useQuery({
    queryKey: ['book-quote', numericBookId],
    queryFn: () => fetchBookQuote(numericBookId!),
    enabled: !!numericBookId,
  });

  if (!bookId || !book) return <p className="p-4">잘못된 접근입니다.</p>;

  return (
    <div>
      <Header
        title="독서 기록 상세보기"
        showBackButton={true}
        onBackClick={() => navigate('/booknotes')}
        showNotification={true}
      />
      <BookDetailHeader
        coverImageUrl={book.coverUrl}
        title={book.title}
        author={book.author}
        publisher={book.publisher}
      />

      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate(`/booknotes/edit/${book.bookId}`)}
          className="flex items-center gap-1 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 transition-colors px-4 py-1.5 rounded-full shadow"
        >
          ✏️ 수정하기
        </button>
      </div>

      <BookNoteView quoteText={quote?.content} reviewText={book.content} />
    </div>
  );
};

export default BookNoteFullPage;
