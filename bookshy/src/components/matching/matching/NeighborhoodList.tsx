import { Neighborhood } from '@/types/Matching';
import { FC, useEffect, useState } from 'react';
import NeighborhoodListCard from './NeighborhoodListCard';
import { getNeighborhoodList } from '@/services/matching/matching';

const NeighborhoodList: FC = () => {
  const [neighborhoodList, setNeighborhoodList] = useState<[] | Neighborhood[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchNeighborhoodList = async () => {
      try {
        // 최소 로딩 시간 설정 (100ms)
        const minLoadingTime = 100;
        const startTime = Date.now();

        const response = await getNeighborhoodList();

        // 실제 API 호출에 걸린 시간
        const apiCallDuration = Date.now() - startTime;

        // 만약 API 호출이 minLoadingTime보다 빨리 완료됐다면, 차이만큼 지연
        if (apiCallDuration < minLoadingTime) {
          await new Promise((resolve) => setTimeout(resolve, minLoadingTime - apiCallDuration));
        }

        setNeighborhoodList(response);
      } catch (error) {
        setError('주변 이웃들의 목록을 불러올 수 없습니다.');
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNeighborhoodList();
  }, []);

  // 로딩 중일 때 보여줄 스켈레톤 UI 개수
  const skeletonCount = 3;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <button
          className="px-4 py-2 bg-primary-light text-primary rounded-md hover:bg-primary-light/80 transition-colors"
          onClick={() => {
            setError('');
            setIsLoading(true);
            getNeighborhoodList()
              .then((response) => {
                setNeighborhoodList(response);
                setIsLoading(false);
              })
              .catch(() => {
                setError('주변 이웃들의 목록을 불러올 수 없습니다.');
                setIsLoading(false);
              });
          }}
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {isLoading ? (
        // 로딩 중일 때는 스켈레톤 UI를 여러 개 표시
        Array.from({ length: skeletonCount }).map((_, index) => (
          <NeighborhoodListCard
            key={`skeleton-${index}`}
            neighborhood={{} as Neighborhood}
            isLoading={true}
          />
        ))
      ) : neighborhoodList.length > 0 ? (
        // 데이터가 있을 때
        neighborhoodList.map((user, index) => (
          <NeighborhoodListCard
            key={user.userId || `neighborhood-${index}`}
            neighborhood={user}
            isLoading={false}
          />
        ))
      ) : (
        // 데이터가 없을 때
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <p className="text-gray-500">주변에 이웃이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default NeighborhoodList;
