import { FC, useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { MatchingRecommendation } from '@/types/Matching';
import NoRecommendationState from '@/components/matching/matching/NoRecommendationState';
import MatchingList from '@/components/matching/matching/MatchingList';
import NeighborhoodList from '@/components/matching/matching/NeighborhoodList';
import Loading from '@/components/common/Loading';
import { getMatchingList } from '@/services/matching/matching';

// 에러 상태를 표시하는 컴포넌트
interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

const ErrorState: FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <p className="text-red-500 mb-4">데이터를 불러오는 중 오류가 발생했습니다.</p>
      <p className="text-light-text-secondary text-sm mb-6">
        {error?.message || '알 수 없는 오류'}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary-dark/90 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
};

const MatchingRecommend: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [matchingList, setMatchingList] = useState<MatchingRecommendation[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // 매칭이 충분한지 확인하는 상수 (3개 이하면 적다고 판단)
  const MIN_SUFFICIENT_MATCHES = 3;
  const hasSufficientMatches = matchingList.length > MIN_SUFFICIENT_MATCHES;
  const hasFewMatches = matchingList.length > 0 && matchingList.length <= MIN_SUFFICIENT_MATCHES;

  const getMatchings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMatchingList();
      setMatchingList(response || []);
    } catch (error) {
      console.log('retry 실패', error);
      setError(error instanceof Error ? error : new Error('알 수 없는 오류가 발생했습니다'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMatchings();
  }, []);

  return (
    <div className="flex flex-col bg-light-bg">
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
          {matchingList.length > 0 ? (
            <span>
              현재{' '}
              <span className="text-primary-accent font-medium">총 {matchingList.length}명</span>의
              사용자와 매칭 되었어요.
            </span>
          ) : (
            <span>현재 매칭된 사용자가 없어요.</span>
          )}
        </p>
      </div>
      {isLoading ? (
        <Loading loadingText="매칭 추천을 불러오는 중..." />
      ) : error ? (
        <ErrorState error={error} onRetry={getMatchings} />
      ) : hasSufficientMatches ? (
        <MatchingList matchings={matchingList} />
      ) : hasFewMatches ? (
        <>
          <MatchingList matchings={matchingList} />
          <div className="px-5 sm:px-8 md:px-10 py-3 sm:py-4">
            <h2 className="text-primary-dark font-medium text-base mb-2">
              주변 이웃들의 서재도 둘러보세요
            </h2>
            <p className="text-light-text-secondary font-light text-xs sm:text-sm mb-4">
              더 많은 매칭 기회를 찾을 수 있어요!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4">
              <NeighborhoodList />
            </div>
          </div>
        </>
      ) : (
        <NoRecommendationState onRetry={getMatchings} />
      )}
    </div>
  );
};

export default MatchingRecommend;
