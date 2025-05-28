import { FC } from 'react';
import { RotateCcw } from 'lucide-react';
import { NoRecommendationStateProps } from '@/types/Matching';
import NeighborhoodList from './NeighborhoodList';

const NoRecommendationState: FC<NoRecommendationStateProps> = ({ onRetry }) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-64 sm:h-80 md:h-96 py-8 sm:py-12 text-light-text-secondary">
        <div className="space-y-2 sm:space-y-3 text-center">
          <p className="text-sm sm:text-base">아직 매칭된 사람이 없어요!</p>
          <p className="text-sm sm:text-base">주변 이웃들의 서재를 더 둘러볼까요?</p>
          <p className="text-sm sm:text-base">서재를 둘러보면 매칭 확률이 높아져요!</p>
        </div>

        <button
          onClick={onRetry}
          className="flex items-center gap-1 bg-white text-light-text-muted rounded-md px-3 sm:px-4 py-1.5 sm:py-2 mt-4 sm:mt-6 border border-1 border-light-text-mudted hover:bg-gray-50 transition-colors"
        >
          <RotateCcw size={14} className="sm:w-4 sm:h-4" strokeWidth={0.5} />
          <span className="text-xs sm:text-sm">매칭 다시 시도하기</span>
        </button>
      </div>
      <div className="px-5 sm:px-8 md:px-10 py-3 sm:py-4">
        <h2 className="text-primary-dark font-medium text-base mb-2">
              주변 이웃들의 서재를 둘러보세요
            </h2>
            <p className="text-light-text-secondary font-light text-xs sm:text-sm mb-4">
              더 많은 매칭 기회를 찾을 수 있어요!
            </p>
        <NeighborhoodList />
      </div>
    </div>
  );
};
export default NoRecommendationState;
