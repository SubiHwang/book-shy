import { NeighborhoodCardProps } from '@/types/Matching';
import { ChevronRight } from 'lucide-react';
import { FC } from 'react';

const NeighborhoodListCard: FC<NeighborhoodCardProps> = ({ neighborhood }) => {
  return (
    <div className="flex flex-col card mx-5 my-3">
      <div className="card flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 overflow-hidden">
            <img
              src={neighborhood.profileImage || '#'}
              alt={neighborhood.name}
              className="w-full h-full object-cover rounded-full border"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <div className="text-light-text">
                <span className="text-lg font-medium">{neighborhood.name}</span>
                <span className="text-md font-light"> 님</span>
              </div>

              <div className="badge bg-primary-light/30">
                <p className="text-primary">북끄지수 {neighborhood.shyScore}</p>
              </div>
            </div>
            <div className="flex">
              <div className="text-sm text-light-text-muted mt-1">
                <span>{neighborhood.location}</span>
                <span className="mx-3">|</span>
                <span>{neighborhood.farfrom} km</span>
              </div>
            </div>
          </div>
        </div>

        <button className="badge border border-primary-accent ml-auto" onClick={()=>{}}>
          <span className="flex items-center text-base font-extralight text-primary-accent mx-1">
            서재 보러가기 <ChevronRight strokeWidth={0.8} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default NeighborhoodListCard;
