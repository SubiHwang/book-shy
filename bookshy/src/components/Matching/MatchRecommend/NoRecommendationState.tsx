import { FC } from 'react';
import { RotateCcw } from 'lucide-react';
import { NoRecommendationStateProps } from '@/types/Matching';
import NeighborhoodList from './NeighborhoodList';

const NoRecommendationState: FC<NoRecommendationStateProps> = ({ onRetry }) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-96 text-light-text-secondary">
        <p>아직 매칭된 사람이 없어요!</p>
        <p>주변 이웃들의 서재를 더 둘러볼까요?</p>
        <p>서재를 둘러보면 매칭 확률이 높아져요!</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-1 bg-white text-light-text-muted rounded-md px-4 py-2 mt-4 border border-1 border-light-text-mudted"
        >
          <RotateCcw size={16} strokeWidth={0.5} />
          매칭 다시 시도하기
        </button>
      </div>
      <div>
        <NeighborhoodList />
      </div>
    </div>
  );
};
export default NoRecommendationState;
