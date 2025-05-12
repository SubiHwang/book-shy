import { FC } from 'react';
import { MatchingListProps } from '@/types/Matching';
import MatchingListCard from '@/components/matching/matching/MatchingListCard';

const MatchingList: FC<MatchingListProps> = ({ matchings }) => {
  return (
    <div>
      <div className="px-2 sm:px-4 py-1 sm:py-2">
        {matchings.map((matching) => (
          <MatchingListCard
            key={matching.id}
            matching={matching}
            onChatClick={() => {
              // 채팅 클릭 핸들러
              console.log(`채팅 시작: ${matching.name}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchingList;
