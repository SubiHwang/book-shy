interface FilterOption<T> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

interface FilterChipsProps<T> {
  options: FilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

const FilterChips = <T extends string | number>({
  options,
  selected,
  onSelect,
}: FilterChipsProps<T>) => {
  return (
    <div className="max-w-full overflow-x-auto scrollbar-none -mx-4 px-4">
      <div className="inline-flex gap-2">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            onClick={() => onSelect(opt.value)}
            className={`flex items-center px-4 py-1.5 rounded-full border text-sm whitespace-nowrap transition duration-200 ease-in-out
              ${
                selected === opt.value
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              }
              
            `}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;
