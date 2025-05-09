// src/components/mylibrary/BookDetail/BookDetailHeader.tsx
import React from 'react';
import { BookDetailResponse } from '@/services/mylibrary/bookDetailService';
// 공통 Header 컴포넌트 import

interface BookDetailHeaderProps {
  bookDetail: BookDetailResponse & { libraryId: number; isPublic: boolean };
  onBack: () => void;
  onTogglePublicStatus: () => void;
}

const BookDetailHeader: React.FC<BookDetailHeaderProps> = ({
  bookDetail,
  onTogglePublicStatus,
}) => {
  return (
    <>
      {/* 책 정보 섹션 - 그라데이션 적용, 레이아웃 개선 */}
      <div className="bg-gradient-to-r from-[#FCF6D4] to-[#F4E8B8] p-4 flex-shrink-0">
        <div className="flex flex-row items-start">
          {/* 책 표지 이미지 - 고정 크기 유지 */}
          <div className="w-26 h-36 flex-shrink-0 mr-4 rounded-md overflow-hidden shadow-md">
            <img
              src={bookDetail.coverImageUrl || '/placeholder-book.jpg'}
              alt={bookDetail.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-book.jpg';
              }}
            />
          </div>

          {/* 책 정보 - 제목이 길어도 전체 표시 */}
          <div className="flex-1 min-w-0 flex flex-col min-h-36 justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2 break-words">{bookDetail.title}</h2>
              <p className="text-sm mb-1 truncate">작가: {bookDetail.author || '정보 없음'}</p>
              <p className="text-sm mb-1 truncate">출판사: {bookDetail.publisher || '정보 없음'}</p>
            </div>

            <button
              className="mt-3 py-1.5 px-4 rounded-full bg-white text-gray-700 shadow-sm hover:bg-gray-50 text-sm font-medium transition-colors self-start"
              onClick={onTogglePublicStatus}
            >
              {bookDetail.isPublic ? '공개 서재에서 숨기기' : '공개 서재에 추가'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetailHeader;
