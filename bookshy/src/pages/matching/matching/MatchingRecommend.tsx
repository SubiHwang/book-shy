import { FC, useState, useEffect } from 'react';
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

const MatchingRecommend: FC = () => {
  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [matchings, setMatchings] = useState<MatchingRecommendation[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 첫 페이지 데이터 가져오기
  const { data, isLoading, refetch } = useQuery<MatchingRecommendationResponse>({
    queryKey: ['matching-list', currentPage],
    queryFn: async () => {
      return await getMatchingList(currentPage);
    },
    enabled: true, // 컴포넌트 마운트 시 자동으로 쿼리 실행
  });

  // 데이터 로드 시 상태 업데이트
  useEffect(() => {
    if (data) {
      if (currentPage === 1) {
        // 첫 페이지일 경우 데이터 초기화
        setMatchings(data.candidates);
      } else {
        // 추가 페이지일 경우 데이터 누적
        setMatchings((prev) => [...prev, ...data.candidates]);
      }

      // 총 아이템 수와 총 페이지 수 업데이트
      setTotalItems(data.results);
      setTotalPages(data.totalPages);
    }
  }, [data, currentPage]);

  // 다음 페이지 로드 가능 여부 확인
  const hasNextPage = currentPage < totalPages;

  // 위로 스크롤 함수
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 더보기 버튼 클릭 핸들러
  const handleLoadMore = async () => {
    if (!hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      // 다음 페이지로 이동
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to load more matchings', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 새로고침 핸들러
  const handleRefresh = async () => {
    setCurrentPage(1);
    setMatchings([]);
    await refetch();
  };

  // 매칭이 충분한지 확인하는 상수 (3개 이하면 적다고 판단)
  const MIN_SUFFICIENT_MATCHES = 3;
  const hasSufficientMatches = totalItems > MIN_SUFFICIENT_MATCHES;
  const hasFewMatches = totalItems > 0 && totalItems <= MIN_SUFFICIENT_MATCHES;

  return (
    <div className="flex flex-col bg-light-bg mb-24">
      <MatchingHeader matchingCount={totalItems} />

      <div className="flex flex-col px-5 sm:px-8 md:px-10 pt-3 sm:pt-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <h2 className="text-primary-dark font-medium text-base">매칭된 이웃들을 둘러보세요</h2>
          </div>

          {!isLoading && (
            <button
              onClick={handleRefresh}
              disabled={isLoading || isLoadingMore}
              className="text-primary hover:text-primary-dark transition-colors"
              aria-label="추천 도서 새로고침"
            >
              <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {isLoading && currentPage === 1 ? (
        <Loading loadingText="매칭 추천을 불러오는 중..." />
      ) : hasSufficientMatches ? (
        <>
          {/* 매칭 목록 표시 */}
          <MatchingList matchings={matchings} />

          {/* 더보기 버튼 영역 */}
          <div className="py-4 px-5 sm:px-8 md:px-10">
            <div className="flex justify-center items-center py-4 min-h-[60px]">
              {hasNextPage ? (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-70"
                >
                  {isLoadingMore ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw size={16} className="animate-spin" />
                      불러오는 중...
                    </span>
                  ) : (
                    '더 보기'
                  )}
                </button>
              ) : (
                <MatchingEndMessage matchingCount={totalItems} onScrollToTop={scrollToTop} />
              )}
            </div>

            {/* 추가 여백으로 스크롤 끝 표시 */}
            {!hasNextPage && <div className="h-16"></div>}
          </div>

          {/* 위로 스크롤 버튼 - 첫 페이지 이상일 때만 표시 */}
          {currentPage > 1 && <ScrollToTopButton onClick={scrollToTop} />}
        </>
      ) : hasFewMatches ? (
        <>
          <MatchingList matchings={matchings} />
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
        <NoRecommendationState onRetry={handleRefresh} />
      )}
    </div>
  );
};

export default MatchingRecommend;
