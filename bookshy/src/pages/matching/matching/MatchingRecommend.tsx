import { FC, useState } from 'react';
import { Zap } from 'lucide-react';
import { MatchingRecommendation } from '@/types/Matching';
import NoRecommendationState from '@/components/matching/MatchRecommend/NoRecommendationState';
import MatchingList from '@/components/matching/MatchRecommend/MatchingList';
import Loading from '@/components/common/Loading';

const MatchingRecommend: FC = () => {
  const dummyData: MatchingRecommendation[] = [
    {
      id: 1,
      name: '마이콜',
      profileImage: '/images/profile.png',
      matchingPercent: 85,
      shyScore: 85,
      location: '구미시 진평동',
      myWishBooks: ['이기적 유전자', '자존감 수업', '어떻게 원하는 것을 얻는가'],
      yourWishBooks: ['호모데우스', '정의란 무엇인가'],
    },
    {
      id: 2,
      name: '제니',
      profileImage: '/images/profile.png',
      matchingPercent: 65,
      shyScore: 85,
      location: '구미시 진평동',
      myWishBooks: ['이기적 유전자'],
      yourWishBooks: ['호모데우스'],
    },
  ];
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRetryMatching = (): void => {
    setIsLoading(true);
    // API 호출을 시뮬레이션합니다
    setTimeout(() => {
      setIsLoading(false);
      // 필요에 따라 데이터를 업데이트합니다
    }, 1500);
  };

  return (
    <div className="flex flex-col bg-light-bg">
      <div className="bg-primary-light/20 px-10 py-4">
        <div className="flex items-center gap-1">
          <Zap className="text-primary-dark" size={20} strokeWidth={1} />
          <h1 className="text-primary-dark font-medium">북끄북끄 매칭 시스템</h1>
        </div>
        <p className="text-light-text-secondary font-light">
          읽고 싶은 책, 보유 도서, 위치, 북끄 지수 등을 고려한 알고리즘으로 최적의 교환 상대를 추천
          해드려요.{' '}
          {dummyData.length > 0 ? (
            <span>
              현재 <span className="text-primary-accent font-medium">총 {dummyData.length}명</span>
              의 사용자와 매칭 되었어요.
            </span>
          ) : (
            <span>현재 매칭된 사용자가 없어요.</span>
          )}
        </p>
      </div>
      {isLoading ? (
        <Loading loadingText="매칭 추천을 불러오는 중..." />
      ) : dummyData.length > 0 ? (
        <MatchingList matchings={dummyData} />
      ) : (
        <NoRecommendationState onRetry={handleRetryMatching} />
      )}
    </div>
  );
};

export default MatchingRecommend;
