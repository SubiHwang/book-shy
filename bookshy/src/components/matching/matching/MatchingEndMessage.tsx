import { FC } from 'react';
import { ArrowUp, CheckCircle } from 'lucide-react';

interface MatchingEndMessageProps {
  matchingCount: number;
  onScrollToTop: () => void;
}

const MatchingEndMessage: FC<MatchingEndMessageProps> = ({ matchingCount, onScrollToTop }) => {
  return (
    <div className="flex flex-col items-center w-full border-t border-gray-200 pt-6 mt-2">
      <div className="bg-gray-100 rounded-full p-3 mb-3">
        <CheckCircle className="text-gray-500" size={24} strokeWidth={1.5} />
      </div>
      <p className="text-gray-600 font-medium">모든 매칭을 확인했습니다</p>
      <p className="text-light-text-secondary text-sm mt-1">
        총 {matchingCount}명의 매칭 사용자를 모두 살펴보셨습니다
      </p>
      <button
        onClick={onScrollToTop}
        className="mt-4 bg-primary text-white px-6 py-2 rounded-full flex items-center"
      >
        <ArrowUp className="mr-2" size={16} />맨 위로 이동하기
      </button>
    </div>
  );
};

export default MatchingEndMessage;
