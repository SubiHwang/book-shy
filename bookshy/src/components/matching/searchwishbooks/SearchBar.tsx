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
        placeholder="책 제목, 출판사..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 pr-10 rounded-full border-none focus:outline-none shadow-sm text-gray-800"
      />
      <button
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        onClick={() => onSearch({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>)}
      >
        <Search size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
