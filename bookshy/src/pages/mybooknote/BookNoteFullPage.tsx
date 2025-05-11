import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBookNote } from '@/services/mybooknote/booknote';
import { fetchBookQuote } from '@/services/mybooknote/bookquote';
import BookNoteHeaderCard from '@/components/booknote/BookNoteHeaderCard';
import BookNoteSection from '@/components/booknote/BookNoteSection';
import BookNoteLayout from '@/components/booknote/BookNoteLayout';

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
    <BookNoteLayout
      header={
        <>
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => navigate(-1)}>&lt;</button>
            <h1 className="text-lg font-semibold">독서 기록</h1>
            <div className="w-6" />
          </div>

          <BookNoteHeaderCard
            coverUrl={book.coverUrl}
            title={book.title}
            author={book.author}
            publisher={book.publisher}
            badgeText="독서 완료"
          />
        </>
      }
    >
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate(`/booknotes/edit/${book.bookId}`)}
          className="text-sm px-4 py-1 bg-gray-200 rounded-full text-gray-700 shadow"
        >
          수정하기
        </button>
      </div>

      <BookNoteSection
        label="인용구"
        icon="✍️"
        content={quote?.content}
        placeholder="등록된 인용구가 없습니다."
      />
      <BookNoteSection
        label="감상 기록"
        icon="💬"
        content={book.content}
        placeholder="작성된 독후감이 없습니다."
      />
    </BookNoteLayout>
  );
};

export default BookNoteFullPage;
