import { ChangeEvent, FC, KeyboardEvent, useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { SearchBarProps } from '@/types/Matching';
import { useBookSuggestions } from '@/hooks/wishbook/useBookSuggestions';
import highlightMatch from '@/utils/highlightMatch';
interface AutocompleteSearchBarProps extends SearchBarProps {
  suggestions?: string[]; // 정적 제안 목록 (선택적)
  maxSuggestions?: number; // 최대 표시할 제안 수
  minQueryLength?: number; // 자동완성 시작을 위한 최소 글자 수
}

const SearchBar: FC<AutocompleteSearchBarProps> = ({ 
  onSearch, 
  value, 
  onChange, 
  placeholder,
  suggestions = [],
  maxSuggestions = 5,
  minQueryLength = 2
}) => {
  // 상태 관리
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);
  
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // useBookSuggestions 훅 사용
  const { data: fetchedSuggestions = [], isLoading } = useBookSuggestions(value);

  // 정적 제안과 API 제안 결합 (중복 제거)
  const allSuggestions = [...suggestions, ...(fetchedSuggestions || [])]
    .filter((suggestion, index, self) => self.indexOf(suggestion) === index)
    .slice(0, maxSuggestions);

  // 외부 클릭 감지하여 제안 목록 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (newValue.length >= minQueryLength) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    
    setActiveSuggestionIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 자동완성 선택 및 탐색 기능
    if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && allSuggestions[activeSuggestionIndex]) {
        e.preventDefault();
        selectSuggestion(allSuggestions[activeSuggestionIndex]);
      } else {
        onSearch(e);
        setShowSuggestions(false);
      }
    }
    // 화살표 아래 키 - 다음 제안으로 이동
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev < allSuggestions.length - 1 ? prev + 1 : 0
      );
    }
    // 화살표 위 키 - 이전 제안으로 이동
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : allSuggestions.length - 1
      );
    }
    // ESC 키 - 제안 목록 닫기
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // 제안 선택 함수
  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => value && value.length >= minQueryLength && setShowSuggestions(true)}
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        {isLoading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-gray-500"></div>
          </div>
        )}
        <button
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          onClick={() => {
            onSearch({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
            setShowSuggestions(false);
          }}
        >
          <Search size={20} className="text-gray-400" />
        </button>
      </div>

      {/* 자동완성 제안 목록 - 하이라이트 기능 추가 */}
      {showSuggestions && allSuggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
        >
          {allSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                index === activeSuggestionIndex ? 'bg-gray-100' : ''
              }`}
              onClick={() => selectSuggestion(suggestion)}
            >
              {/* 검색어와 일치하는 부분을 하이라이트 */}
              {highlightMatch(suggestion, value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;