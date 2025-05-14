import { FC, useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { MatchingRecommendation } from '@/types/Matching';
import NoRecommendationState from '@/components/matching/matching/NoRecommendationState';
import MatchingList from '@/components/matching/matching/MatchingList';
import NeighborhoodList from '@/components/matching/matching/NeighborhoodList';
import Loading from '@/components/common/Loading';
import { getMatchingList } from '@/services/matching/matching';

const MatchingRecommend: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [matchingList, setMatchingList] = useState<MatchingRecommendation[]>([]);

  // 매칭이 충분한지 확인하는 상수 (3개 이하면 적다고 판단)
  const MIN_SUFFICIENT_MATCHES = 3;
  const hasSufficientMatches = matchingList.length > MIN_SUFFICIENT_MATCHES;
  const hasFewMatches = matchingList.length > 0 && matchingList.length <= MIN_SUFFICIENT_MATCHES;

  const getMatchings = async () => {
    setIsLoading(true);
    try {
      const response = await getMatchingList();
      console.log('API 응답:', response); // 응답 전체 확인
      console.log('candidates 존재 여부:', !!response.candidates); // candidates가 있는지 확인
      console.log('candidates 내용:', response.candidates); // candidates 내용 확인
      setMatchingList(response.candidates || []);
    } catch (error) {
      console.log('retry 실패', error);
    } finally {
      setIsLoading(false);
    }
  };

  // matchingList 상태 업데이트 후 로그 추가
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
