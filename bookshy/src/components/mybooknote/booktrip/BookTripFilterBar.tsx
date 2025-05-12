interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter: 'ALL' | 'WRITTEN' | 'UNWRITTEN';
  onFilterChange: (value: 'ALL' | 'WRITTEN' | 'UNWRITTEN') => void;
}

const BookTripFilterBar = ({ searchQuery, onSearchChange, filter, onFilterChange }: Props) => (
  <div className="flex gap-2 items-center mb-4">
    <input
      type="text"
      placeholder="여정이 궁금한 책 검색하기"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
    />
    <select
      value={filter}
      onChange={(e) => onFilterChange(e.target.value as any)}
      className="text-sm border border-gray-300 rounded-md px-2 py-2"
    >
      <option value="ALL">전체 보기</option>
      <option value="WRITTEN">내가 여정 작성한 책</option>
      <option value="UNWRITTEN">여정 미작성 책</option>
    </select>
  </div>
);

export default BookTripFilterBar;
