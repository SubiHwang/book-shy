import { FC } from 'react';
import { MatchingCardProps } from '@/types/Matching';

const MatchingListCard: FC<MatchingCardProps> = ({ matching }) => {
  return (
    <div className="flex flex-col card m-4 p-4">
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 overflow-hidden">
            <img
              src={matching.profileImage || '#'}
              alt={matching.name}
              className="w-full h-full object-cover rounded-full border"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <div className="text-light-text">
                <span className="text-lg font-bold">{matching.name}</span>
                <span className="text-md font-medium"> 님</span>
              </div>

              <div className="badge bg-primary-light/30">
                <p className="text-primary">북끄지수 {matching.shyScore}</p>
              </div>
            </div>
            <div className="text-sm text-light-text-muted mt-1">
              <p>{matching.location}</p>
            </div>
          </div>
        </div>

        <div className="badge bg-primary-light/30 px-3 py-1 rounded-full">
          <p className="text-primary text-sm font-medium">
            {matching.matchingPercent || '?'}% 매칭률
          </p>
        </div>
      </div>
    </div>
  );
};

export default MatchingListCard;
