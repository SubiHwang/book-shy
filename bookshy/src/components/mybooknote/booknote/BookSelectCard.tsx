import type { BookSearchItem } from '@/types/mylibrary/bookSearch';

interface SearchResultCardProps {
  book: BookSearchItem;
  onSelect?: () => void; // 등록 버튼 클릭 시 실행할 콜백
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ book, onSelect }) => (
  <div className="p-4 border rounded bg-white shadow">
    <img src={book.coverImageUrl} alt={book.title} className="w-20 h-28 object-cover mb-2" />
    <h2 className="text-md font-bold">{book.title}</h2>
    <p className="text-sm text-gray-700">{book.author}</p>
    <p className="text-sm text-gray-500">{book.publisher}</p>
    <button className="mt-2 px-3 py-1 bg-primary text-white rounded" onClick={onSelect}>
      등록하기
    </button>
  </div>
);

export default SearchResultCard;
