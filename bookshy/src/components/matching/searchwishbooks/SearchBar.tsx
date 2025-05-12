import { ChangeEvent, FC, KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { SearchBarProps } from '@/types/Matching';
const SearchBar: FC<SearchBarProps> = ({ onSearch, value, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(e);
    }
  };

  return (
    <div className="relative flex items-center w-full">
      <input
        type="text"
        placeholder="읽고 싶은 책 검색(책 제목, 저자, 출판사)"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
      />
      <button
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        onClick={() => onSearch({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>)}
      >
        <Search size={20} className="text-gray-400" />
      </button>
    </div>
  );
};

export default SearchBar;
