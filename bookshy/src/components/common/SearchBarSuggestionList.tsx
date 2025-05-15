import React from 'react';
import highlightMatch from '@/utils/highlightMatch';

interface SuggestionListProps {
  suggestions: string[];
  query: string;
  activeSuggestionIndex: number;
  onSelect: (suggestion: string) => void;
  suggestionsRef?: React.RefObject<HTMLDivElement>;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  query,
  activeSuggestionIndex,
  onSelect,
  suggestionsRef
}) => {
  if (!suggestions.length) return null;

  return (
    <div 
      ref={suggestionsRef}
      className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
            index === activeSuggestionIndex ? 'bg-gray-100' : ''
          }`}
          onClick={() => onSelect(suggestion)}
        >
          {/* 검색어와 일치하는 부분을 하이라이트 */}
          {highlightMatch(suggestion, query)}
        </div>
      ))}
    </div>
  );
};

export default SuggestionList;