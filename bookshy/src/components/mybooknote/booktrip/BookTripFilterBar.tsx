import { Search, ChevronDown } from 'lucide-react';
import { FC, useState } from 'react';

interface BookTripFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter: 'ALL' | 'WRITTEN' | 'UNWRITTEN';
  onFilterChange: (value: 'ALL' | 'WRITTEN' | 'UNWRITTEN') => void;
  totalCount?: number;
}

const BookTripFilterBar: FC<BookTripFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  totalCount = 0,
}) => {
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const filterOptions = [
    { value: 'ALL', label: '전체 보기' },
    { value: 'WRITTEN', label: '여정이 있는 책' },
    { value: 'UNWRITTEN', label: '여정이 없는 책' },
  ];

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
            placeholder="책 여정 검색 (책 제목)"
            value={searchQuery}
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
              <span>{filterOptions.find((option) => option.value === filter)?.label}</span>
              <ChevronDown size={16} className="ml-1" />
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10 w-32">
                <ul className="py-1">
                  {filterOptions.map((option) => (
                    <li
                      key={option.value}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm font-light"
                      onClick={() => {
                        onFilterChange(option.value as 'ALL' | 'WRITTEN' | 'UNWRITTEN');
                        setFilterOpen(false);
                      }}
                    >
                      {option.label}
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

export default BookTripFilterBar;
