import { NeighborhoodCardProps } from '@/types/Matching';
import { ChevronRight } from 'lucide-react';
import { FC } from 'react';

const NeighborhoodListCard: FC<NeighborhoodCardProps> = ({ neighborhood }) => {
  return (
    <div className="flex flex-col card my-2 w-full">
      {/* 항상 가로 배치로 유지 */}
      <div className="card flex flex-row items-center justify-between p-3 sm:p-4 gap-2">
        {/* 프로필 정보 섹션 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 프로필 이미지 */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 overflow-hidden flex-shrink-0">
            <img
              src={neighborhood.profileImage || '#'}
              alt={neighborhood.name}
              className="w-full h-full object-cover rounded-full border"
            />
          </div>

          {/* 이름과 위치 정보 */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center flex-wrap gap-1 sm:gap-2">
              <div className="text-light-text">
                <span className="text-base sm:text-lg font-medium">{neighborhood.name}</span>
                <span className="text-sm sm:text-md font-light"> 님</span>
              </div>

              <div className="badge bg-primary-light/30 px-2 py-0.5 rounded-full">
                <p className="text-primary text-xs sm:text-sm">북끄지수 {neighborhood.shyScore}</p>
              </div>
            </div>
            <div className="flex flex-wrap text-xs sm:text-sm text-light-text-muted mt-0.5 sm:mt-1">
              <span>{neighborhood.location}</span>
              <span className="mx-2">|</span>
              <span>{neighborhood.farfrom} km</span>
            </div>
          </div>
        </div>

        {/* 서재 보러가기 버튼 - 항상 오른쪽에 배치 */}
        <button
          className="badge border border-primary-accent rounded-full flex items-center py-2 px-4 ml-auto"
          onClick={() => {}}
        >
          <span className="flex items-center text-sm sm:text-base font-extralight text-primary-accent whitespace-nowrap">
            서재 보기
            <ChevronRight strokeWidth={0.8} className="w-4 h-4 ml-1" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default NeighborhoodListCard;
