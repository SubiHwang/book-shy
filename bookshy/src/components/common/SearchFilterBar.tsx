// components/common/SearchFilterBar.tsx
import { Search, ChevronDown } from 'lucide-react';
import { FC, useState } from 'react';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  filterList: string[];
  totalCount: number;
  searchPlaceholder?: string;
}

const SearchFilterBar: FC<SearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  filterList,
  totalCount,
  searchPlaceholder = '검색하기',
}) => {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  return (
    <>
      {/* 검색창 */}
      <div className="mb-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
          />
        </div>
      </div>

      {/* 필터 부분 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-light text-light-text-secondary">총 {totalCount} 권</div>
          <div className="relative">
            <button
              className="flex items-center border rounded px-3 py-1 text-sm"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <span>{selectedFilter}</span>
              <ChevronDown size={16} className="ml-1" />
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10 w-32">
                <ul className="py-1">
                  {filterList.map((filter) => (
                    <li
                      key={filter}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm font-light"
                      onClick={() => {
                        onFilterChange(filter);
                        setFilterOpen(false);
                      }}
                    >
                      {filter}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchFilterBar;
