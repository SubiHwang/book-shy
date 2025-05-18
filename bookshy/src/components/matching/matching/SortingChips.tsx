import { FC, useState } from 'react';

interface SortingChipsProps {
  onSortChange: (sortOption: string) => void;
  defaultSort?: string;
}

const SortingChips: FC<SortingChipsProps> = ({ onSortChange, defaultSort = 'score' }) => {
  const [activeSort, setActiveSort] = useState<string>(defaultSort);

  const handleSortChange = (sortOption: string) => {
    setActiveSort(sortOption);
    onSortChange(sortOption);
  };

  return (
    <div className="flex gap-2 py-3">
      <button
        onClick={() => handleSortChange('score')}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          activeSort === 'score'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-light-text-secondary hover:bg-gray-200'
        }`}
        aria-pressed={activeSort === 'score'}
      >
        매칭률 순
      </button>
      <button
        onClick={() => handleSortChange('distance')}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          activeSort === 'distance'
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-light-text-secondary hover:bg-gray-200'
        }`}
        aria-pressed={activeSort === 'distance'}
      >
        거리 순
      </button>
    </div>
  );
};

export default SortingChips;
