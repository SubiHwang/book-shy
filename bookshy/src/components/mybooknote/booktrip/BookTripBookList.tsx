import type { BookTripListItem } from '@/types/mybooknote/booktrip/booktrip';

interface Props {
  books: BookTripListItem[];
  onClick: (bookId: number) => void;
}

const BookTripBookList = ({ books, onClick }: Props) => (
  <div className="flex flex-col gap-4">
    {books.map((book) => (
      <div key={book.bookId} className="flex items-center gap-3 p-3 bg-white rounded-md shadow">
        <img
          src={book.coverImageUrl || '/placeholder.jpg'}
          alt={book.title}
          className="w-14 h-20 object-cover rounded"
        />
        <div className="flex-1">
          <div className="font-semibold text-sm">{book.title}</div>
          <div className="text-xs text-gray-500">{book.author}</div>
          <div
            className={`mt-1 text-xs font-semibold ${
              book.hasTrip ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {book.hasTrip ? '여정 작성됨' : '여정 미작성'}
          </div>
        </div>
        <button
          onClick={() => onClick(book.bookId)}
          className="text-xs bg-primary text-white px-3 py-1 rounded-md"
        >
          책의 여정 보기
        </button>
      </div>
    ))}
  </div>
);

export default BookTripBookList;
