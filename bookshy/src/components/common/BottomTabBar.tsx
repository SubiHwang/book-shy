import { FC, useState, useEffect, useCallback } from 'react';
import { LibraryBig, BookCopy, MessageCircle, NotepadText, UserRound } from 'lucide-react';
import { TabBarItem, TabBarProps } from '@/types/common/bottomTabBar';
import { useLocation } from 'react-router-dom';

const BottomTabBar: FC<TabBarProps> = ({ onTabChange }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('bookshelf');
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

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
    } else if (['bookshelf', 'matching', 'chat', 'booknotes', 'mypage'].includes(path)) {
      setActiveTab(path);
    }
  }, [location.pathname]);

  const handleScroll = useCallback((): void => {
    const currentScrollY = window.scrollY;

    // 스크롤 방향 감지
    if (currentScrollY > lastScrollY) {
      setIsVisible(false); // 아래로 스크롤 중
    } else {
      setIsVisible(true); // 위로 스크롤 중
    }

    // 현재 스크롤 위치 저장
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]); // 이제 handleScroll만 의존성으로 넣어도 됨

  const handleTabChange = (tabId: string): void => {
    setActiveTab(tabId);
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

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-tabBackground border-t border-light-text-muted/30 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <nav className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-primary-light' : 'text-light-text-muted'
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              <div className="flex items-center justify-center">
                {/* 활성화 상태에 따라 아이콘 스타일 변경 */}
                <Icon
                  size={24}
                  strokeWidth={isActive ? 1 : 0.5}
                  className={isActive ? 'fill-primary-light/20' : ''}
                />
              </div>
              <p className={`text-xs mt-1 ${isActive ? 'font-medium' : 'font-normal'}`}>
                {tab.name}
              </p>
              {isActive && <div className="bg-primary-light h-1 w-3 rounded-sm"></div>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
export default BottomTabBar;
