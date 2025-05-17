import { Heart, MessageCircle } from 'lucide-react';
import { FC, useState } from 'react';
import { BookDetailPageProps } from '@/types/book';
import Skeleton from 'react-loading-skeleton';
import { useImageColors } from '@/hooks/common/useImageColors';
import { createGradientStyle } from '@/utils/common/gradientStyles';
import { addWishBook, deleteWishBook } from '@/services/matching/wishbooks';
import { useQueryClient } from '@tanstack/react-query';
import { getChatId } from '@/services/matching/matching';
import { useNavigate, useSearchParams } from 'react-router-dom';

const WishBooksDetailInfoHeader: FC<BookDetailPageProps> = ({
  itemId,
  title,
  author,
  publisher,
  coverImageUrl,
  isLiked,
  isLoading: isLoadingData,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const whoParams = searchParams.get('who');
  const userId = Number(whoParams);
  const [isBookInWishList, setIsBookInWishList] = useState<boolean | undefined>(isLiked);
  const [isLikedLoading, setIsLikedLoading] = useState<boolean>(false);
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

  const handleToggleLike = async (e: React.MouseEvent) => {
    // Stop event propagation to prevent navigation
    e.stopPropagation();

    // itemId가 없으면 함수 실행을 중단
    if (itemId === undefined) {
      console.error('Book ID is missing');
      return;
    }

    setIsLikedLoading(true);
    try {
      let response;

      if (isBookInWishList) {
        // 좋아요 취소
        response = await deleteWishBook(itemId);
        console.log('Book removed from wishlist:', response);
      } else {
        // 좋아요 추가
        response = await addWishBook(itemId);
        console.log('Book added to wishlist:', response);
      }
      // 서버 응답에 따라 상태 업데이트
      setIsBookInWishList(!isBookInWishList);

      // 쿼리 무효화 (서버에서 데이터가 변경되었으므로)
      queryClient.invalidateQueries({ queryKey: ['wishBooks'] });
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
    } finally {
      setIsLikedLoading(false);
    }
  };

  const onChatClick = async (userId: number) => {
    console.log(userId);
    try {
      const response = await getChatId(userId);
      navigate(`/chat/${response.chatRoomId}`, {
          state: {
            partnerName: response.nickname,
            partnerProfileImage: response.profileImageUrl,
            bookShyScore: response.temperature,
          },
        });
    } catch (error) {
      console.log('채팅 생성 실패', error);
    }
  };

  return (
    <div>
      {/* 책 정보 섹션 - 파스텔 그라데이션 적용, flex 컨테이너로 변경 */}
      <div className="flex flex-col justify-end p-4 shadow-sm min-h-[25vh]" style={gradientStyle}>
        {/* 내용물을 하단에 배치 */}
        {!itemId && (
          <p className="text-sm mb-1 truncate text-light-text-muted">
            * 사용자가 직접 등록한 책입니다
          </p>
        )}
        <div className="flex flex-row items-start mt-auto">
          {/* 책 표지 이미지 */}

          <div
            className="w-26 h-36 flex-shrink-0 mr-4 rounded-md overflow-hidden shadow-md bg-white"
            style={{ aspectRatio: '3/4', maxWidth: '26%' }}
          >
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
                  {!itemId && (
                    <p className="text-sm mb-1 truncate text-light-text-muted">
                      채팅으로 문의하세요.
                    </p>
                  )}
                </>
              )}
            </div>
            <div className="flex justify-end mt-2">
              {itemId ? (
                <button
                  className="p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 shadow-sm"
                  onClick={handleToggleLike}
                >
                  <Heart
                    className={`w-6 h-6 text-primary ${!isLikedLoading && isBookInWishList ? 'fill-primary' : ''}`}
                    strokeWidth={1}
                  />
                </button>
              ) : (
                <button
                  onClick={() => {
                    onChatClick(userId);
                  }}
                  className="flex justify-center items-center gap-1 px-3 py-1 rounded-full bg-primary bg-opacity-70 text-white font-extralight hover:bg-opacity-90 shadow-sm"
                >
                  <MessageCircle className={`w-4 h-4`} strokeWidth={1} />
                  채팅
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishBooksDetailInfoHeader;
