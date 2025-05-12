import Loading from '@/components/common/Loading';
import { BookDetailPageProps } from '@/types/book';
import { CalendarDays, Layers, Tag } from 'lucide-react';
import { FC } from 'react';

const WishBooksDetailInfoBody: FC<BookDetailPageProps> = ({
  pubDate,
  pageCount,
  category,
  description,
  isLoading,
}) => {
  return (
    <div className="px-10 py-5">
      {isLoading ? (
        <Loading loadingText='정보 불러오는 중...'/>
      ) : (
        <>
          {' '}
          <h2 className="text-xl font-bold mb-4">도서 정보</h2>
          <div className="bg-light-bg-secondary rounded-lg mb-4 shadow-sm">
            <div className="flex items-center p-4 border-b border-gray-100">
              {/* 달력 아이콘 - 원형 배경 추가 */}
              <div className="w-8 h-8 mr-3 flex-shrink-0 rounded-full bg-card-bg-pink text-primary flex items-center justify-center">
                <CalendarDays strokeWidth={1}/>
              </div>
              <div className="w-20 flex-shrink-0">
                <p className="text-sm text-light-text-secondary">출간일</p>
              </div>
              <div className="flex-grow text-right">
                <p className="text-sm text-light-text font-medium">{pubDate || '정보 없음'}</p>
              </div>
            </div>

            <div className="flex items-center p-4 border-b border-gray-100">
              {/* 책 페이지 아이콘 - 원형 배경 추가 */}
              <div className="w-8 h-8 mr-3 flex-shrink-0 rounded-full flex items-center justify-center bg-card-bg-pink text-primary">
                <Layers strokeWidth={1}/>
              </div>
              <div className="w-20 flex-shrink-0">
                <p className="text-sm text-light-text-secondary">페이지</p>
              </div>
              <div className="flex-grow text-right">
                <p className="text-sm text-light-text font-medium">
                  {pageCount ? `${pageCount}쪽` : '정보 없음'}
                </p>
              </div>
            </div>

            <div className="flex items-center p-4">
              {/* 태그 아이콘 - 원형 배경 추가 */}
              <div className="w-8 h-8 mr-3 flex-shrink-0 rounded-full bg-card-bg-pink text-primary flex items-center justify-center">
                <Tag strokeWidth={1}/>
              </div>
              <div className="w-20 flex-shrink-0">
                <p className="text-sm text-light-text-secondary">카테고리</p>
              </div>
              <div className="flex-grow text-right">
                <p className="text-sm text-light-text font-medium">{category || '정보 없음'}</p>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold mb-3">책 소개</h2>
          <div className="bg-light-bg-secondary rounded-lg mb-6 shadow-sm">
            <div className="p-4">
              <p className="text-sm text-light-text leading-relaxed whitespace-pre-line">
                {description || '책 소개 정보가 없습니다.'}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default WishBooksDetailInfoBody;
