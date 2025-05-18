import { FC, useState, useEffect, useRef } from 'react';
import { MatchingRecommendation, MatchingRecommendationResponse } from '@/types/Matching';
import NoRecommendationState from '@/components/matching/matching/NoRecommendationState';
import MatchingList from '@/components/matching/matching/MatchingList';
import NeighborhoodList from '@/components/matching/matching/NeighborhoodList';
import Loading from '@/components/common/Loading';
import { getMatchingList } from '@/services/matching/matching';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
// 분리된 컴포넌트 임포트
import MatchingHeader from '@/components/matching/matching/MatchingHeader';
import MatchingEndMessage from '@/components/matching/matching/MatchingEndMessage';
import ScrollToTopButton from '@/components/matching/matching/ScrollToTopButton';
import LoadingIndicator from '@/components/matching/matching/LoadingIndicator';

const MatchingRecommend: FC = () => {
  const ITEMS_PER_PAGE = 10;
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // useQuery로 데이터 가져오기
  const { data, isLoading, refetch } = useQuery<MatchingRecommendationResponse>({
    queryKey: ['matching-list'],
    queryFn: async () => {
      return await getMatchingList(1);
    },
  });
  const matchingList: MatchingRecommendation[] = data?.candidates || [];

  const visibleMatchings = matchingList.slice(0, visibleItems);
  const hasMoreItems = visibleItems < matchingList.length;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 바닥 감지를 위한 Intersection Observer 설정
  useEffect(() => {
    if (!bottomRef.current || isLoading) return;

    const currentRef = bottomRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreItems && !isLoadingMore) {
          setIsLoadingMore(true);

          setTimeout(() => {
            setVisibleItems((prev) => Math.min(prev + ITEMS_PER_PAGE, matchingList.length));
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(currentRef);

    return () => {
      observer.unobserve(currentRef);
    };
  }, [bottomRef, hasMoreItems, isLoading, isLoadingMore, matchingList.length]);

  // 매칭이 충분한지 확인하는 상수 (3개 이하면 적다고 판단)
  const MIN_SUFFICIENT_MATCHES = 3;
  const hasSufficientMatches = matchingList.length > MIN_SUFFICIENT_MATCHES;
  const hasFewMatches = matchingList.length > 0 && matchingList.length <= MIN_SUFFICIENT_MATCHES;

  return (
    <div className="flex flex-col bg-light-bg mb-24">
      <MatchingHeader matchingCount={matchingList.length} />

      <div className="flex flex-col px-5 sm:px-8 md:px-10 pt-3 sm:pt-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <h2 className="text-primary-dark font-medium text-base">매칭된 이웃들을 둘러보세요</h2>
          </div>

          {!isLoading && (
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="text-primary hover:text-primary-dark transition-colors"
              aria-label="추천 도서 새로고침"
            >
              <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <Loading loadingText="매칭 추천을 불러오는 중..." />
      ) : hasSufficientMatches ? (
        <>
          {/* 매칭 목록 표시 */}
          <MatchingList matchings={visibleMatchings} />

          {/* 바닥 감지 영역 및 로딩 표시기 */}
          <div className="py-4 px-5 sm:px-8 md:px-10">
            <div ref={bottomRef} className="flex justify-center items-center py-4 min-h-[60px]">
              {isLoadingMore ? (
                <LoadingIndicator loadingText="더 많은 매칭을 불러오는 중..." />
              ) : hasMoreItems ? (
                <p className="text-light-text-secondary text-sm text-center">
                  스크롤하여 더 많은 매칭을 확인하세요
                </p>
              ) : (
                <MatchingEndMessage
                  matchingCount={matchingList.length}
                  onScrollToTop={scrollToTop}
                />
              )}
            </div>

            {/* 추가 여백으로 스크롤 끝 표시 */}
            {!hasMoreItems && <div className="h-16"></div>}
          </div>

          {/* 위로 스크롤 버튼 */}
          {visibleItems > ITEMS_PER_PAGE && hasMoreItems && (
            <ScrollToTopButton onClick={scrollToTop} />
          )}
        </>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 sm:p-4">
              <NeighborhoodList />
            </div>
          </div>
        </>
      ) : (
        <NoRecommendationState onRetry={refetch} />
      )}
    </div>
  );
};

export default MatchingRecommend;
