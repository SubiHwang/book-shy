// src/pages/MyLibrary/MyLibraryPage.tsx
import React, { useEffect, useState } from 'react';
import StatsCard from '@/components/mylibrary/StatsCard';
import LibraryTabs from '@/components/mylibrary/LibraryTabs';
import BookShelf from '@/components/mylibrary/BookShelf';
import AddBookDialog from '@/components/mylibrary/AddBookDialog';
import { BookType } from '@/types/mylibrary/models';

// 임의의 책 데이터 샘플
const sampleBooks: BookType[] = [
  {
    id: '1',
    title: '어린 왕자',
    author: '생텍쥐페리',
    coverUrl: 'https://image.aladin.co.kr/product/26/0/cover500/s742633278_1.jpg',
    isPublic: true,
    addedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    title: '데미안',
    author: '헤르만 헤세',
    coverUrl: 'https://image.aladin.co.kr/product/26/0/cover500/s742633278_1.jpg',
    isPublic: false,
    addedAt: new Date('2023-03-10'),
  },
  {
    id: '3',
    title: '사피엔스: 유인원에서 사이보그까지, 인간 역사의 대담하고 위대한 질문',
    author: '유발 하라리',
    coverUrl: 'https://image.aladin.co.kr/product/26/0/cover500/s742633278_1.jpg',
    isPublic: true,
    addedAt: new Date('2023-05-22'),
  },
  {
    id: '4',
    title: '사피엔스: 유인원에서 사이보그까지, 인간 역사의 대담하고 위대한 질문',
    author: '유발 하라리',
    coverUrl: 'https://image.aladin.co.kr/product/26/0/cover500/s742633278_1.jpg',
    isPublic: true,
    addedAt: new Date('2023-05-22'),
  },
  {
    id: '5',
    title: '사피엔스: 유인원에서 사이보그까지, 인간 역사의 대담하고 위대한 질문',
    author: '유발 하라리',
    coverUrl: 'https://image.aladin.co.kr/product/26/0/cover500/s742633278_1.jpg',
    isPublic: true,
    addedAt: new Date('2023-05-22'),
  },
  {
    id: '6',
    title: '사피엔스: 유인원에서 사이보그까지, 인간 역사의 대담하고 위대한 질문',
    author: '유발 하라리',
    coverUrl: 'https://image.aladin.co.kr/product/26/0/cover500/s742633278_1.jpg',
    isPublic: true,
    addedAt: new Date('2023-05-22'),
  },
  {
    id: '7',
    title: '사피엔스: 유인원에서 사이보그까지, 인간 역사의 대담하고 위대한 질문',
    author: '유발 하라리',
    coverUrl: 'https://image.aladin.co.kr/product/26/0/cover500/s742633278_1.jpg',
    isPublic: true,
    addedAt: new Date('2023-05-22'),
  },
  {
    id: '8',
    title: '사피엔스: 유인원에서 사이보그까지, 인간 역사의 대담하고 위대한 질문',
    author: '유발 하라리',
    coverUrl: 'https://image.aladin.co.kr/product/26/0/cover500/s742633278_1.jpg',
    isPublic: true,
    addedAt: new Date('2023-05-22'),
  },
  {
    id: '9',
    title: '사피엔스: 유인원에서 사이보그까지, 인간 역사의 대담하고 위대한 질문',
    author: '유발 하라리',
    coverUrl: 'https://image.aladin.co.kr/product/26/0/cover500/s742633278_1.jpg',
    isPublic: true,
    addedAt: new Date('2023-05-22'),
  },
];

const MyLibraryPage: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>(sampleBooks); // 샘플 데이터로 초기화
  const [activeTab, setActiveTab] = useState<'all' | 'public'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false); // 샘플 데이터가 있으므로 로딩 상태 false로 시작
  const [userRank, setUserRank] = useState<number>(1);
  const [achievement, setAchievement] = useState<string>('전체 1등 독서 왕이 되었어요!');

  // 다이얼로그 상태 관리
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    // 탭이 변경될 때 필터링 적용
    if (activeTab === 'public') {
      const publicBooks = sampleBooks.filter((book) => book.isPublic);
      setBooks(publicBooks);
    } else {
      setBooks(sampleBooks);
    }
  }, [activeTab]);

  // 다이얼로그 열기
  const openDialog = () => {
    setIsDialogOpen(true);
  };

  // 다이얼로그 닫기
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="max-w-screen-md mx-auto px-4 py-4">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">내 서재</h1>
        <button className="p-2 text-gray-500 hover:text-gray-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            ></path>
          </svg>
        </button>
      </div>

      {/* 통계 카드 */}
      <StatsCard totalBooks={books.length} rank={userRank} achievement={achievement} />

      {/* 탭 네비게이션 */}
      <LibraryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allCount={sampleBooks.length}
        publicCount={sampleBooks.filter((book) => book.isPublic).length}
      />

      {/* 책장 컴포넌트 */}
      <BookShelf books={books} isLoading={isLoading} />

      {/* 책 추가 플로팅 액션 버튼*/}
      <div className="fixed bottom-28 right-5 md:right-10">
        <button
          className="bg-primary hover:bg-primary-dark text-light-text-inverted rounded-full p-3 shadow-lg transition-colors"
          onClick={openDialog}
        >
          <img src="/icons/camera-upload.svg" alt="카메라 업로드" className="w-10 h-10" />
        </button>
      </div>

      {/* 책 추가 다이얼로그 */}
      <AddBookDialog isOpen={isDialogOpen} onClose={closeDialog} />
    </div>
  );
};

export default MyLibraryPage;
