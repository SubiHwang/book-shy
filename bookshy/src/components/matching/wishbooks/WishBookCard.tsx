import { WishBookProps } from '@/types/book';
import { Heart } from 'lucide-react';
import { FC, useState } from 'react';
import { addWishBook, deleteWishBook } from '@/services/matching/wishbooks';

const WishBookCard: FC<WishBookProps> = ({ wishBook }) => {
  const { isLiked = false } = wishBook;
  const [isBookInWishList, setIsBookInWishList] = useState<boolean>(isLiked);
  const [_isLoading, setIsLoading] = useState<boolean>(false);

  const userId = 1; // 임시 userId, 실제로는 로그인한 사용자의 ID를 사용해야 함

  const handleToggleLike = async (isLiked: boolean) => {
    setIsLoading(true);
    try {
      let response;
      
      if (isLiked) {
        // 좋아요 취소
        response = await deleteWishBook(userId, wishBook.itemId);
        console.log('Book removed from wishlist:', response);
      } else {
        // 좋아요 추가
        response = await addWishBook(userId, wishBook.itemId);
        console.log('Book added to wishlist:', response);
      }
      // 서버 응답에 따라 상태 업데이트
      setIsBookInWishList(!isLiked);
    } catch (error) {
      console.error('Error toggling wishlist status:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="card flex items-center justify-between p-4 mb-4 w-full">
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
        <h3 className="text-base font-medium text-gray-800 mb-1 truncate" title={wishBook.title}>
          {wishBook.title}
        </h3>
        <p className="text-xs text-gray-600 mb-1 truncate">{wishBook.author}</p>
        <p className="text-xs text-gray-500 mb-1 truncate">{wishBook.publisher}</p>
        {wishBook.description && (
          <p className="text-xs text-gray-500 line-clamp-2 overflow-hidden mb-1" title={wishBook.description}>
            {wishBook.description}
          </p>
        )}
      </div>

      {/* Heart Button */}
      <div className="flex-shrink-0 ml-4">
        <button
          className="p-2 rounded-full bg-light-bg-shade"
          onClick={() => handleToggleLike(isBookInWishList)}
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
