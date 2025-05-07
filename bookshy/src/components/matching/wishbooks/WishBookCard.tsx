import { WishBookProps } from '@/types/book';
import { Heart } from 'lucide-react';
import { FC } from 'react';

const WishBookCard: FC<WishBookProps> = ({ wishBook }) => {
  const { isLiked = false } = wishBook;
  return (
    <div className="card flex items-center justify-between p-4 mb-4 w-full">
      {/* Book Image */}
      <div className="flex-shrink-0 w-24 h-32 mr-4">
        <img
          src={wishBook.bookImgUrl}
          alt={wishBook.title}
          className="w-full h-full object-cover rounded-md shadow-sm"
        />
      </div>

      {/* Book Info */}
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-light-text mb-1 truncate">{wishBook.title}</h3>
        <p className="text-sm font-light text-light-text-muted mb-1">{wishBook.author}</p>
        {wishBook.translator && (
          <p className="text-sm font-light text-light-text-muted mb-1">{wishBook.translator}</p>
        )}
        <p className="text-sm font-light text-light-text-muted mb-1">{wishBook.publisher}</p>
        {wishBook.summary && (
          <p className="text-sm font-light text-light-text-muted line-clamp-2 overflow-hidden mb-1">
            {wishBook.summary}
          </p>
        )}
      </div>

      {/* Heart Button */}
      <div className="flex-shrink-0 ml-4">
        <button className="p-2 rounded-full bg-light-bg-shade">
          <Heart
            className={`w-6 h-6 text-primary ${isLiked ? 'fill-primary' : ''}`}
            strokeWidth={1}
          />
        </button>
      </div>
    </div>
  );
};

export default WishBookCard;
