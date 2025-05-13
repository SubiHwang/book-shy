import type { BookTripListItem } from '@/types/mybooknote/booktrip/booktrip';
import { ChevronRight } from 'lucide-react';

interface Props {
  books: BookTripListItem[];
  onClick: (bookId: number) => void;
}

const BookTripBookList = ({ books, onClick }: Props) => (
  <div className="flex flex-col gap-3">
    {books.map((book) => (
      <div
        key={book.bookId}
        className="card flex flex-row items-center justify-between p-4 gap-2 bg-white rounded-xl shadow"
      >
        {/* 책 정보 섹션 */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-24 h-32 mr-2 relative rounded-md overflow-hidden">
            <img
              src={book.coverImageUrl || '/placeholder.jpg'}
              alt={book.title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-x-0 top-0 h-full bg-black/10"></div>

            {/* 우측 상단에 상태 뱃지 표시 */}
            <div
              className={`absolute top-1 right-1 px-2 py-0.5 rounded-full text-xs font-light shadow-sm ${
                book.hasTrip ? 'bg-light-status-info text-white' : 'bg-primary-light text-white'
              }`}
            >
              {book.hasTrip ? '작성' : '미작성'}
            </div>
          </div>

          {/* 책 제목과 저자 정보 */}
          <div className="flex flex-col justify-center flex-grow">
            <div className="text-light-text">
              <span className="text-base font-medium">{book.title}</span>
            </div>

            <div className="flex flex-wrap text-xs text-light-text-secondary mt-1">
              <span>{book.author || '저자 미상'}</span>
            </div>
          </div>
        </div>

        {/* 책의 여정 보기 버튼 */}
        <button
          className="badge border border-primary-accent rounded-full flex items-center py-2 px-4 ml-auto"
          onClick={() => onClick(book.bookId)}
        >
          <span className="flex items-center text-sm font-extralight text-primary-accent whitespace-nowrap">
            여정 보기
            <ChevronRight strokeWidth={0.8} className="w-4 h-4 ml-1" />
          </span>
        </button>
      </div>
    ))}
  </div>
);

export default BookTripBookList;
