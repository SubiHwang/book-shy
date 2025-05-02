import { FC, useState } from 'react';
import { Zap } from 'lucide-react';
import { MatchingRecommendation } from '@/types/Matching';
import NoRecommendationState from '@/components/Matching/MatchRecommend/NoRecommendationState';
import MatchingList from '@/components/Matching/MatchRecommend/MatchingList';

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
      theirBooks: ['호모데우스', '정의란 무엇인가'],
    },
    {
      id: 2,
      name: '제니',
      profileImage: '/images/profile.png',
      matchingPercent: 65,
      shyScore: 85,
      location: '구미시 진평동',
      myWishBooks: ['이기적 유전자'],
      theirBooks: ['호모데우스'],
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
    <div>
      <div className="bg-primary-light/20 p-5">
        <div className="flex items-center gap-1">
          <Zap className="text-primary-dark" size={20} strokeWidth={1} />
          <h1 className="text-primary-dark font-medium">북끄북끄 매칭 시스템</h1>
        </div>
        <p className="text-light-text-secondary font-light">
          읽고 싶은 책, 보유 도서, 위치, 북끄 지수 등을 고려한 알고리즘으로 최적의 교환 상대를 추천
          해드려요.
        </p>
      </div>
      {isLoading ? (
        <div>로딩중...</div>
      ) : dummyData.length > 0 ? (
        <MatchingList matchings={dummyData} />
      ) : (
        <NoRecommendationState onRetry={handleRetryMatching} />
      )}
    </div>
  );
};

export default MatchingRecommend;
