import { NeighborhoodCardProps } from '@/types/Matching';
import { ChevronRight } from 'lucide-react';
import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

const NeighborhoodListCard: FC<NeighborhoodCardProps> = ({ neighborhood, isLoading }) => {
  return (
    <div className="flex flex-col card my-2 w-full">
      {/* 항상 가로 배치로 유지 */}
      <div className="card flex flex-row items-center justify-between p-3 sm:p-4 gap-2">
        {/* 프로필 정보 섹션 */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 프로필 이미지 */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 overflow-hidden flex-shrink-0">
            {isLoading ? (
              <Skeleton circle width="100%" height="100%" />
            ) : (
              <img
                src={neighborhood?.profileImageUrl || '#'}
                alt={neighborhood?.nickname}
                className="w-full h-full object-cover rounded-full border"
              />
            )}
          </div>

          {/* 이름과 위치 정보 */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center flex-wrap gap-1 sm:gap-2">
              {isLoading ? (
                <>
                  <Skeleton width={100} height={20} />
                  <Skeleton width={80} height={16} />
                </>
              ) : (
                <>
                  <div className="text-light-text">
                    <span className="text-base sm:text-lg font-medium">
                      {neighborhood.nickname}
                    </span>
                    <span className="text-sm sm:text-md font-light"> 님</span>
                  </div>

                  <div className="badge bg-primary-light/30 px-2 py-0.5 rounded-full">
                    <p className="text-primary text-xs sm:text-sm">
                      북끄지수 {neighborhood.shyScore}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap text-xs sm:text-sm text-light-text-muted mt-0.5 sm:mt-1">
              {isLoading ? (
                <Skeleton width={150} height={16} />
              ) : (
                <>
                  <span>{neighborhood.address}</span>
                  <span className="mx-2">|</span>
                  <span>{neighborhood.distance > 0 ? `${neighborhood.distance}km` : '근처'}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 서재 보러가기 버튼 - 항상 오른쪽에 배치 */}
        {isLoading ? (
          <div className="ml-auto">
            <Skeleton width={80} height={32} borderRadius={20} />
          </div>
        ) : (
          <button
            className="badge border border-primary-accent rounded-full flex items-center py-2 px-4 ml-auto"
            onClick={() => {}}
          >
            <span className="flex items-center text-sm sm:text-base font-extralight text-primary-accent whitespace-nowrap">
              서재 보기
              <ChevronRight strokeWidth={0.8} className="w-4 h-4 ml-1" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NeighborhoodListCard;
