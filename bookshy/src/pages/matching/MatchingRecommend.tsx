import { FC } from 'react';
import { Zap } from 'lucide-react';

const MatchingRecommend: FC = () => {
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
    </div>
  );
};

export default MatchingRecommend;
