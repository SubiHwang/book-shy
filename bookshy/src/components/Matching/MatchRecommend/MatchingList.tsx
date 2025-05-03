import { FC } from 'react';
import { MatchingListProps } from '@/types/Matching';
import MatchingListCard from '@/components/Matching/MatchRecommend/MatchingListCard';

const MatchingList: FC<MatchingListProps> = ({ matchings }) => {
  return (
    <div>
      <div>
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
