import { Neighborhood } from '@/types/Matching';
import { FC } from 'react';
import NeighborhoodListCard from './NeighborhoodListCard';

const NeighborhoodList: FC = () => {
  const dummyData: Neighborhood[] = [
    {
      userId: 1,
      name: '마이콜',
      location: '구미시 진평동',
      farfrom: 0.4,
      shyScore: 86,
      profileImage: 'image',
    },
    {
      userId: 2,
      name: '제니',
      location: '구미시 인의동',
      farfrom: 0.8,
      shyScore: 75,
      profileImage: 'image',
    },
  ];
  return (
    <div className="flex flex-col mb-10">
      {dummyData.map((user) => (
        <NeighborhoodListCard neighborhood={user} />
      ))}
    </div>
  );
};

export default NeighborhoodList;
