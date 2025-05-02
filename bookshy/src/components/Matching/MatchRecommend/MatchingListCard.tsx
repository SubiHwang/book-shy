import { FC } from 'react';
import { MatchingCardProps } from '@/types/Matching';

const MatchingListCard: FC<MatchingCardProps> = ({ matching }) => {
  return (
    <div>
      <h1>{matching.name}</h1>
    </div>
  );
};
export default MatchingListCard;
