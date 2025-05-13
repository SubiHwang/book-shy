import { FC, useState, useEffect } from 'react';
import { LibraryBig, BookCopy, MessageCircle, NotepadText, UserRound } from 'lucide-react';
import { TabBarItem, TabBarProps } from '@/types/common/bottomTabBar';
import { useLocation } from 'react-router-dom';

const BottomTabBar: FC<TabBarProps> = ({ onTabChange }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(() => {
    return sessionStorage.getItem('activeTab') || 'bookshelf';
  });

  // 숨길 경로 목록
  const hiddenPaths = [
    '/bookshelf/add/title',
    '/bookshelf/add/isbn',
    '/bookshelf/add/self',
    '/bookshelf/add/search',
    '/bookshelf/add/ocr-result',
    '/setting-location',
  ];

  // 현재 경로가 숨김 목록에 있는지 확인
  const shouldHideTabBar = hiddenPaths.includes(location.pathname);

  useEffect(() => {
    const path = location.pathname.substring(1); // '/' 제거
    if (path === '') {
      setActiveTab('bookshelf');
      sessionStorage.setItem('activeTab', 'bookshelf');
    } else if (['bookshelf', 'matching', 'chat', 'booknotes', 'mypage'].includes(path)) {
      setActiveTab(path);
      sessionStorage.setItem('activeTab', path);
    }
  }, [location.pathname]);

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
    sessionStorage.setItem('activeTab', tabId);
    // 탭 변경 시 스크롤 위치 초기화
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (onTabChange) {
      onTabChange(tabId); // 부모 컴포넌트에 탭 변경 알림
    }
  };

  const tabs: TabBarItem[] = [
    { id: 'bookshelf', name: '내 서재', icon: LibraryBig },
    { id: 'matching', name: '매칭 추천', icon: BookCopy },
    { id: 'chat', name: '채팅', icon: MessageCircle },
    { id: 'booknotes', name: '독서 기록', icon: NotepadText },
    { id: 'mypage', name: '마이', icon: UserRound },
  ];

  if (shouldHideTabBar) {
    return null; // 경로가 숨김 목록에 포함되면 탭바를 렌더링하지 않음
  }

  // 하단 탭바가 항상 표시되도록 설정
  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-tabBackground border-t border-light-text-muted/30 z-50"
    >
      <nav className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-primary' : 'text-light-text-muted'
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              <div className="flex items-center justify-center">
                {/* 활성화 상태에 따라 아이콘 스타일 변경 */}
                <Icon
                  size={24}
                  strokeWidth={isActive ? 1 : 0.5}
                  className={isActive ? 'fill-primary/65' : ''}
                />
              </div>
              <p className={`text-xs mt-1 ${isActive ? 'font-medium' : 'font-normal'}`}>
                {tab.name}
              </p>
              {isActive && <div className="bg-primary h-1 w-3 rounded-sm"></div>}
            </button>
          );
        })}
      </nav>
      {/* 하단 패딩 추가 - 안전 영역(safe area) 대응 */}
      <div className="h-safe-bottom bg-tabBackground"></div>
    </div>
  );
};

export default BottomTabBar;