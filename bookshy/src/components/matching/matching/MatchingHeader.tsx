import { FC } from 'react';
import { Zap } from 'lucide-react';

interface MatchingHeaderProps {
  matchingCount: number;
}

const MatchingHeader: FC<MatchingHeaderProps> = ({ matchingCount }) => {
  return (
    <div className="bg-primary-light/20 px-5 sm:px-8 md:px-10 py-3 sm:py-4">
      <div className="flex items-center gap-1 mb-1 sm:mb-2">
        <Zap className="text-primary-dark w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1} />
        <h1 className="text-primary-dark font-medium text-sm sm:text-base md:text-lg">
          북끄북끄 매칭 시스템
        </h1>
      </div>
      <p className="text-light-text-secondary font-light text-xs sm:text-sm leading-tight sm:leading-normal">
        읽고 싶은 책, 보유 도서, 위치, 북끄 지수 등을 고려한 알고리즘으로 최적의 교환 상대를 추천
        해드려요.{' '}
        {matchingCount > 0 ? (
          <span>
            현재 <span className="text-primary-accent font-medium">총 {matchingCount}명</span>의
            사용자와 매칭 되었어요.
          </span>
        ) : (
          <span>현재 매칭된 사용자가 없어요.</span>
        )}
      </p>
    </div>
  );
};

export default MatchingHeader;
