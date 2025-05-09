// src/components/mylibrary/BookDetail/BookInfoTab.tsx
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { BookDetailResponse } from '@/services/mylibrary/bookDetailService';

interface BookDetailContext {
  bookDetail: BookDetailResponse & { libraryId: number; isPublic: boolean };
}

const BookInfoTab: React.FC = () => {
  const { bookDetail } = useOutletContext<BookDetailContext>();

  if (!bookDetail) return null;

  return (
    <div className="px-4 py-5">
      <h2 className="text-xl font-bold mb-4">도서 정보</h2>
      <div className="bg-light-bg-secondary rounded-lg mb-4 shadow-sm">
        <div className="flex items-center p-4 border-b border-gray-100">
          {/* 달력 아이콘 - 원형 배경 추가 */}
          <div className="w-8 h-8 mr-3 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="w-20 flex-shrink-0">
            <p className="text-sm text-gray-500">출간일</p>
          </div>
          <div className="flex-grow text-right">
            <p className="text-sm text-gray-700 font-medium">{bookDetail.pubDate || '정보 없음'}</p>
          </div>
        </div>

        <div className="flex items-center p-4 border-b border-gray-100">
          {/* 책 페이지 아이콘 - 원형 배경 추가 */}
          <div className="w-8 h-8 mr-3 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div className="w-20 flex-shrink-0">
            <p className="text-sm text-gray-500">페이지</p>
          </div>
          <div className="flex-grow text-right">
            <p className="text-sm text-gray-700 font-medium">
              {bookDetail.pageCount ? `${bookDetail.pageCount}쪽` : '정보 없음'}
            </p>
          </div>
        </div>

        <div className="flex items-center p-4">
          {/* 태그 아이콘 - 원형 배경 추가 */}
          <div className="w-8 h-8 mr-3 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <div className="w-20 flex-shrink-0">
            <p className="text-sm text-gray-500">카테고리</p>
          </div>
          <div className="flex-grow text-right">
            <p className="text-sm text-gray-700 font-medium">
              {bookDetail.category || '정보 없음'}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-3">책 소개</h2>
      <div className="bg-light-bg-secondary rounded-lg mb-6 shadow-sm">
        <div className="p-4">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {bookDetail.description || '책 소개 정보가 없습니다.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookInfoTab;
