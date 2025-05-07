import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Book } from '@/types/book';

const BookInfoTab: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 데이터 가져오기
    const fetchBookDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // 실제 API 호출로 대체 필요
        setTimeout(() => {
          const mockBook: Book = {
            bookId: parseInt(id),
            title: '어린왕자',
            author: '생텍쥐페리',
            translator: '김경식',
            publisher: '더스토리북',
            summary:
              "어린 시절부터 어른이 된 지금까지 전 세계인의 사랑을 받는 가장 위대한 이야기. 생텍쥐페리의 '어린 왕자'는 사막에 불시착한 조종사가 어린 왕자를 만나면서 펼쳐지는 환상적인 이야기로, 어린이와 어른 모두에게 참의 본질과 사랑의 의미를 일깨워주는 작품입니다.",
            publishDate: '2014년 8월 15일',
            pages: 138,
            categories: '소설 > 고전문학',
            bookImgUrl: 'https://image.aladin.co.kr/product/11990/17/cover/8952766989_1.jpg',
          };
          setBook(mockBook);
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error('책 정보를 가져오는 중 오류 발생:', error);
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  if (loading || !book) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">도서 정보</h3>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className="w-6 h-6 text-red-300 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-12a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" />
            </svg>
          </div>
          <span className="text-gray-400">출간일</span>
          <span className="ml-auto">{book.publishDate}</span>
        </div>

        <div className="flex items-center mb-2">
          <div className="w-6 h-6 text-red-300 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
            </svg>
          </div>
          <span className="text-gray-400">페이지</span>
          <span className="ml-auto">{book.pages}쪽</span>
        </div>

        <div className="flex items-center mb-2">
          <div className="w-6 h-6 text-red-300 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39.92 3.31 0l4.569-4.57a2.25 2.25 0 000-3.18l-9.58-9.581a3 3 0 00-2.121-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-gray-400">카테고리</span>
          <span className="ml-auto">{book.categories}</span>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-2">책 소개</h3>
      <p className="text-sm leading-relaxed whitespace-pre-line">
        {book.summary || '책 소개가 없습니다.'}
      </p>
    </div>
  );
};

export default BookInfoTab;
