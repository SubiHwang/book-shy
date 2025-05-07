import { useState, useEffect } from 'react';
import { TrendingUp, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const PopularSearchTerm = () => {
  const dummyData = [
    { rank: 1, keyword: '책 제목 2', trend: 'up' },
    { rank: 2, keyword: '책 제목 1', trend: 'up' },
    { rank: 3, keyword: '책 제목 3', trend: 'down' },
    { rank: 4, keyword: '책 제목 4', trend: 'down' },
    { rank: 5, keyword: '책 제목 5', trend: 'steady' },
    { rank: 6, keyword: '책 제목 6', trend: 'down' },
    { rank: 7, keyword: '책 제목 7', trend: 'down' },
    { rank: 8, keyword: '책 제목 8', trend: 'down' },
    { rank: 9, keyword: '책 제목 9', trend: 'down' },
    { rank: 10, keyword: '책 제목 10', trend: 'down' },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!isOpen) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % dummyData.length);
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, dummyData.length]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderTrendIcon = (trend: string) => {
    switch (trend) {
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

  const currentItem = dummyData[currentIndex];

  return (
    <div className={`flex flex-col ${isOpen ? 'pb-0' : 'pb-2'}`}>
      <div className="popular-search-term flex justify-between items-center px-4">
        <div className="flex text-white items-center gap-1 w-32">
          <TrendingUp strokeWidth={1} />
          <p className="font-medium text-sm whitespace-nowrap">실시간 인기 검색어</p>
        </div>
        {!isOpen && (
          <div className="flex items-center flex-1 text-white ml-2 mr-1">
            <div className="text-center font-medium w-8">{currentItem.rank}</div>
            <div className="truncate max-w-full px-2">{currentItem.keyword}</div>
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
        <div className="flex flex-col mt-2 space-y-1 pt-2 bg-white px-4 shadow-md">
          {dummyData.map((item) => (
            <div key={item.rank} className="flex items-center text-light-text py-1 px-1">
              <div className="w-8 text-center font-medium">{item.rank}</div>
              <div className="truncate flex-1 px-2">{item.keyword}</div>
              <div className="w-8 flex justify-center">{renderTrendIcon(item.trend)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularSearchTerm;
