import { useState, useEffect } from 'react';
import { TrendingUp, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { PopularSearchTermType } from '@/types/Matching';
import { getPopularSearchTerms } from '@/services/matching/wishbooks';

const PopularSearchTerm = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [searchTermList, setSearchTermList] = useState<PopularSearchTermType[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSearchTerm = async () => {
      try {
        setIsLoading(true);
        const response = await getPopularSearchTerms();
        setSearchTermList(response.trendingKeywords || []);
      } catch (error) {
        console.log('trending 가져오다가 에러 발생');
        setSearchTermList([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchTerm();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!isOpen && searchTermList.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % searchTermList.length);
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, searchTermList.length]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderTrendIcon = (trend: string) => {
    switch (trend?.toLowerCase()) {
      case 'up':
        return <ArrowUp className="text-green-500" size={16} />;
      case 'down':
        return <ArrowDown className="text-red-500" size={16} />;
      case 'steady':
        return <Minus className="text-gray-400" size={16} />;
      default:
        return null;
    }
  };

  const currentItem = searchTermList.length > 0 ? searchTermList[currentIndex] : null;

  return (
    <div className={`flex flex-col ${isOpen ? 'pb-0' : 'pb-2'}`}>
      <div className="popular-search-term flex justify-between items-center px-4">
        <div className="flex text-white items-center gap-1 w-32">
          <TrendingUp strokeWidth={1} />
          <p className="font-medium text-sm whitespace-nowrap">실시간 인기 검색어</p>
        </div>
        {!isOpen && (
          <div className="flex items-center flex-1 text-white ml-2 mr-1">
            {isLoading ? (
              <div className="text-center w-full">불러오는 중...</div>
            ) : currentItem ? (
              <>
                <div className="text-center font-medium w-8">{currentItem.rank}</div>
                <div className="truncate max-w-full px-2">{currentItem.keyword}</div>
              </>
            ) : (
              <div className="text-center w-full">데이터가 없습니다</div>
            )}
          </div>
        )}
        <button
          className="text-white p-1"
          onClick={toggleOpen}
          aria-label={isOpen ? '접기' : '펼치기'}
        >
          {isOpen ? <ChevronUp strokeWidth={1} /> : <ChevronDown strokeWidth={1} />}
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col mt-2 space-y-1 py-2 bg-white px-4 shadow-md">
          {isLoading ? (
            <div className="py-2 text-center">불러오는 중...</div>
          ) : searchTermList.length > 0 ? (
            searchTermList.map((item) => (
              <div key={item.rank} className="flex items-center text-light-text py-1 px-1">
                <div className="w-8 text-center font-medium">{item?.rank}</div>
                <div className="truncate flex-1 px-2">{item?.keyword}</div>
                <div className="w-8 flex justify-center">{renderTrendIcon(item?.trend)}</div>
              </div>
            ))
          ) : (
            <div className="py-2 text-center">데이터가 없습니다</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PopularSearchTerm;