import type { Library } from '@/types/mylibrary/library';

interface Props {
  book: Library;
  selected: boolean;
  onToggle: (title: string) => void;
  onViewDetail: (book: Library) => void;
}

const BookChip = ({ book, selected, onToggle, onViewDetail }: Props) => (
  <button
    key={book.libraryId ?? book.title}
    onClick={() => {
      onToggle(book.title);
      onViewDetail(book);
    }}
    className={`w-[140px] flex items-center gap-2 px-2 py-1 rounded-full border text-sm truncate
      ${selected ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'}`}
  >
    <img
      src={book.coverImageUrl || '/placeholder.jpg'}
      alt={book.title}
      className="w-6 h-8 object-cover rounded-sm"
    />
    <span className="truncate">{book.title}</span>
  </button>
);

export default BookChip;
