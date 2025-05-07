import { useState, ChangeEvent, FC } from 'react';
import { Search } from 'lucide-react';
import { SearchBarProps } from '@/types/Matching';

const SearchBar:FC<SearchBarProps> = ({onSearch}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
  return (
    <div className="relative flex items-center w-full">
      <input
        type="text"
        placeholder="책 제목, 작가..."
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        onKeyDown={onSearch}
        className="w-full px-4 py-2 pr-10 rounded-full border-none focus:outline-none shadow-sm text-gray-800"
      />
      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
