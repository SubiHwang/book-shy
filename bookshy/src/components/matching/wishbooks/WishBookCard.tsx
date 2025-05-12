import { WishBookProps } from '@/types/book';
import { Heart } from 'lucide-react';
import { FC, useState } from 'react';
import { addWishBook, deleteWishBook } from '@/services/matching/wishbooks';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const WishBookCard: FC<WishBookProps> = ({ wishBook }) => {
  const { isLiked = false } = wishBook;
  const [isBookInWishList, setIsBookInWishList] = useState<boolean>(isLiked);
  const [_isLoading, setIsLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (wishBook.itemId) {
      navigate(`/matching/books/${wishBook.itemId}`);
    }
  };

  const handleToggleLike = async (e: React.MouseEvent) => {
    // Stop event propagation to prevent navigation
    e.stopPropagation();

    // itemId가 없으면 함수 실행을 중단
    if (wishBook.itemId === undefined) {
      console.error('Book ID is missing');
      return;
    }

    setIsLoading(true);
    try {
      let response;

      if (isBookInWishList) {
        // 좋아요 취소
        response = await deleteWishBook(wishBook.itemId);
        console.log('Book removed from wishlist:', response);
      } else {
        // 좋아요 추가
        response = await addWishBook(wishBook.itemId);
        console.log('Book added to wishlist:', response);
      }
      // 서버 응답에 따라 상태 업데이트
      setIsBookInWishList(!isBookInWishList);

      // 쿼리 무효화 (서버에서 데이터가 변경되었으므로)
      queryClient.invalidateQueries({ queryKey: ['wishBooks'] });
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="card flex items-center justify-between p-4 mb-4 w-full cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Book Image */}
      <div className="flex-shrink-0 w-24 h-32 mr-4">
        <img
          src={wishBook.coverImageUrl}
          alt={wishBook.title}
          className="w-full h-full object-cover rounded-md shadow-sm"
        />
      </div>

      {/* Book Info */}
      <div className="flex-grow min-w-0 pr-2">
        <h3 className="text-base font-medium text-light-text mb-1 truncate" title={wishBook.title}>
          {wishBook.title}
        </h3>
        <p className="text-xs text-light-text-secondary mb-1 truncate">{wishBook.author}</p>
        <p className="text-xs text-light-text-muted mb-1 truncate">{wishBook.publisher}</p>
        {wishBook.description && (
          <p
            className="text-xs text-gray-500 line-clamp-2 overflow-hidden mb-1"
            title={wishBook.description}
          >
            {wishBook.description}
          </p>
        )}
      </div>

      {/* Heart Button */}
      <div className="flex-shrink-0 ml-4">
        <button
          className="p-2 rounded-full bg-light-bg-shade hover:bg-gray-200"
          onClick={handleToggleLike}
        >
          <Heart
            className={`w-6 h-6 text-primary ${isBookInWishList ? 'fill-primary' : ''}`}
            strokeWidth={1}
          />
        </button>
      </div>
    </div>
  );
};

export default WishBookCard;
