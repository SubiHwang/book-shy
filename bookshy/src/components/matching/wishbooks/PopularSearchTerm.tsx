import { TrendingUp } from 'lucide-react';

const PopularSearchTerm = () => {
  return (
    <div className="populr-search-term flex justify-between mt-3">
      <div className="flex text-white w-3/6 text-center items-center gap-2">
        <TrendingUp strokeWidth={1} />
        <p>실시간 인기 검색어</p>
      </div>
      <div className="w-1/6 text-white">순위</div>
      <div className="w-2/6 text-white">검색어</div>
    </div>
  );
};

export default PopularSearchTerm;
