import { Heart } from 'lucide-react';
import { FC } from 'react';
import { BookDetailPageProps } from '@/types/book';

const WishBooksDetailInfoHeader: FC<BookDetailPageProps> = ({
  title,
  author,
  publisher,
  coverImageUrl,
  isLiked,
  isLoading
}) => {
  return (
    <div>
      {/* 책 정보 섹션 - 그라데이션 적용, 레이아웃 개선 */}
      <div className="bg-gradient-to-r from-[#FCF6D4] to-[#F4E8B8] p-4 flex-shrink-0">
        <div className="flex flex-row items-start">
          {/* 책 표지 이미지 - 고정 크기 유지 */}
          <div className="w-26 h-36 flex-shrink-0 mr-4 rounded-md overflow-hidden shadow-md">
            <img src={coverImageUrl} alt={title} className="w-full h-full object-cover" />
          </div>

          {/* 책 정보 - 제목이 길어도 전체 표시 */}
          <div className="flex-1 min-w-0 flex flex-col min-h-36 justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2 break-words">{title}</h2>
              <p className="text-sm mb-1 truncate">작가: {author || '정보 없음'}</p>
              <p className="text-sm mb-1 truncate">출판사: {publisher || '정보 없음'}</p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <button className="p-2 rounded-full bg-light-bg-shade hover:bg-gray-200">
                <Heart
                  className={`w-6 h-6 text-primary ${isLiked ? 'fill-primary' : ''}`}
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
