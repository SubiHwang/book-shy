import { FC } from 'react';
import { MatchingListProps } from '@/types/Matching';
import MatchingListCard from '@/components/matching/matching/MatchingListCard';

const MatchingList: FC<MatchingListProps> = ({ matchings }) => {
  return (
    <div>
      <div className="px-4 sm:px-6 py-1 sm:py-2">
        {matchings.map((matching) => (
          <MatchingListCard
            key={matching.userId}
            matching={matching}
            onChatClick={() => {
              // 채팅 클릭 핸들러
              console.log(`채팅 시작: ${matching.nickname}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchingList;
