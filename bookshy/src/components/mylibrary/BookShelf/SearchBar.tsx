import { FC, FormEvent } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
}

const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = '책 제목, 저자, 키워드',
}) => {
  return (
    <div className="px-4 py-2 mt-2">
      <form onSubmit={onSubmit}>
        <div className="flex items-center bg-white rounded-full px-4 py-2">
          <input
            type="text"
            placeholder={placeholder}
            className="bg-transparent w-full outline-none text-sm text-gray-700"
            value={value}
            onChange={onChange}
          />
          <Search size={16} className="text-gray-400 ml-2" />
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
