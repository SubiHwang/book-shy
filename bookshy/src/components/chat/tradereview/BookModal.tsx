import type { Library } from '@/types/mylibrary/library';

interface Props {
  book: Library;
  onClose: () => void;
}

const BookModal = ({ book, onClose }: Props) => (
  <div
    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-lg p-5 w-full max-w-xs shadow-lg relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
      >
        ×
      </button>
      <img
        src={book.coverImageUrl || '/placeholder.jpg'}
        alt={book.title}
        className="w-28 h-40 mx-auto object-cover rounded mb-4"
      />
      <p className="text-base font-semibold text-center">{book.title}</p>
      <p className="text-sm text-gray-600 text-center mt-1">{book.author}</p>
      <p className="text-xs text-gray-400 text-center mt-1">{book.isbn13}</p>
    </div>
  </div>
);

export default BookModal;
