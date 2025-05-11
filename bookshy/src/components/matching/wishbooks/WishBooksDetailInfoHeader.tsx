import { Heart } from 'lucide-react';
import { FC } from 'react';
import { BookDetailPageProps } from '@/types/book';
import Skeleton from 'react-loading-skeleton';
import { useImageColors } from '@/hooks/common/useImageColors';
import { createGradientStyle } from '@/utils/common/gradientStyles';

const WishBooksDetailInfoHeader: FC<BookDetailPageProps> = ({
  title,
  author,
  publisher,
  coverImageUrl,
  isLiked,
  isLoading: isLoadingData,
}) => {
  // 이미지에서 색상 추출 및 파스텔 색상 자동 생성
  const { pastelColors, isLoading: isLoadingColors } = useImageColors(
    !isLoadingData && coverImageUrl ? coverImageUrl : null, 
    ['#FCF6D4', '#F4E8B8'], // 기본 색상
    0.65,  // 더 밝은 파스텔 색상을 위한 밝기 조정값 (0-1)
    220    // 최소 밝기값 (0-255)
  );
  
  // 전체 로딩 상태
  const isLoading = isLoadingData || isLoadingColors;
  
  // 배경 그라데이션 스타일 생성 (항상 파스텔 색상 사용)
  const gradientStyle = createGradientStyle(pastelColors , 'bottom right');

  return (
    <div>
      {/* 책 정보 섹션 - 파스텔 그라데이션 적용 */}
      <div 
        className="p-4 flex-shrink-0 shadow-sm" 
        style={gradientStyle}
      >
        <div className="flex flex-row items-start">
          {/* 책 표지 이미지 */}
          <div className="w-26 h-36 flex-shrink-0 mr-4 rounded-md overflow-hidden shadow-md bg-white">
            {isLoading ? (
              <Skeleton width="100%" height="100%" />
            ) : (
              <img 
                src={coverImageUrl || '/api/placeholder/200/300'} 
                alt={title || '책 표지'} 
                className="w-full h-full object-cover" 
              />
            )}
          </div>

          {/* 책 정보 */}
          <div className="flex-1 min-w-0 flex flex-col min-h-36 justify-between text-gray-800">
            <div>
              {isLoading ? (
                <>
                  <Skeleton width="80%" height={28} className="mb-2" />
                  <Skeleton width="50%" height={20} className="mb-1" />
                  <Skeleton width="60%" height={20} className="mb-1" />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-2 break-words">{title || '제목 정보 없음'}</h2>
                  <p className="text-sm mb-1 truncate">작가: {author || '정보 없음'}</p>
                  <p className="text-sm mb-1 truncate">출판사: {publisher || '정보 없음'}</p>
                </>
              )}
            </div>
            <div className="flex justify-end">
              <button className="p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 shadow-sm">
                <Heart
                  className={`w-6 h-6 text-primary ${!isLoadingData && isLiked ? 'fill-primary' : ''}`}
                  strokeWidth={1}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishBooksDetailInfoHeader;