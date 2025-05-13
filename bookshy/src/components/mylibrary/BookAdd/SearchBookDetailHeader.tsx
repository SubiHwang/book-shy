import { Plus } from 'lucide-react';
import { FC, useState } from 'react';
import { ExtendedSearchBookDetailPageProps } from '@/types/book';
import Skeleton from 'react-loading-skeleton';
import { useImageColors } from '@/hooks/common/useImageColors';
import { createGradientStyle } from '@/utils/common/gradientStyles';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const SearchBookDetailHeader: FC<ExtendedSearchBookDetailPageProps> = ({
  itemId,
  title,
  author,
  publisher,
  coverImageUrl,
  isLoading: isLoadingData,
  onAddBook,
}) => {
  const [isAddLoading, setIsAddLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // 이미지에서 색상 추출 및 파스텔 색상 자동 생성
  const { pastelColors, isLoading: isLoadingColors } = useImageColors(
    !isLoadingData && coverImageUrl ? coverImageUrl : null,
    ['#FCF6D4', '#F4E8B8'], // 기본 색상
    0.65, // 더 밝은 파스텔 색상을 위한 밝기 조정값 (0-1)
    220, // 최소 밝기값 (0-255)
  );

  // 전체 로딩 상태
  const isLoading = isLoadingData || isLoadingColors;

  // 배경 그라데이션 스타일 생성 (항상 파스텔 색상 사용)
  const gradientStyle = createGradientStyle(pastelColors, 'bottom right');

  // 북 추가 핸들러
  const handleAddBook = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (itemId === undefined) {
      console.error('Book ID is missing');
      toast.error('책 ID 정보가 없습니다.');
      return;
    }

    setIsAddLoading(true);
    try {
      if (onAddBook) {
        await onAddBook(itemId);

        // 성공 알림 추가
        toast.success('책이 성공적으로 등록되었습니다!');
      }

      queryClient.invalidateQueries({ queryKey: ['myLibraryBooks'] });
    } catch (error) {
      console.error('Error adding book:', error);

      // 실패 알림 추가
      toast.error('책 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsAddLoading(false);
    }
  };
  return (
    <div>
      {/* 책 정보 섹션 - 파스텔 그라데이션 적용, flex 컨테이너로 변경 */}
      <div className="flex flex-col justify-end p-4 shadow-sm min-h-[25vh]" style={gradientStyle}>
        {/* 내용물을 하단에 배치 */}
        <div className="flex flex-row items-start mt-auto">
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

          {/* 책 정보 - 제목이 긴 경우를 위해 개선 */}
          <div className="flex-1 min-w-0 flex flex-col min-h-36 justify-between text-gray-800">
            <div className="overflow-hidden">
              {isLoading ? (
                <>
                  <Skeleton width="80%" height={28} className="mb-2" />
                  <Skeleton width="50%" height={20} className="mb-1" />
                  <Skeleton width="60%" height={20} className="mb-1" />
                </>
              ) : (
                <>
                  {/* 긴 제목도 잘 보이게 조정 */}
                  <h2 className="text-lg font-bold mb-2 break-words line-clamp-3 leading-tight">
                    {title || '제목 정보 없음'}
                  </h2>
                  <p className="text-sm mb-1 truncate">작가: {author || '정보 없음'}</p>
                  <p className="text-sm mb-1 truncate">출판사: {publisher || '정보 없음'}</p>
                </>
              )}
            </div>
            <div className="flex justify-end mt-2">
              <button
                className="p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 shadow-sm"
                onClick={handleAddBook}
                disabled={isAddLoading || isLoading}
              >
                <Plus className="w-6 h-6 text-primary" strokeWidth={1} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBookDetailHeader;
