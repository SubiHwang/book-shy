// src/pages/MyLibrary/MyLibraryPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/common/Header';
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
  const navigate = useNavigate();
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
    <div className="flex flex-col h-screen">
      {/* Header 컴포넌트 적용 */}
      <Header
        title="내 서재"
        onBackClick={() => navigate(-1)}
        showBackButton={false}
        showNotification={true}
        extraButton={true}
        extraButtonIcon={null}
        onExtraButtonClick={() => {}}
        className="bg-white shadow-md"
      />

      <div className="max-w-screen-md mx-auto px-4 py-4 flex-1 overflow-auto">
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
    </div>
  );
};

export default MyLibraryPage;
