import { FC, useState, useEffect } from 'react';
import { LibraryBig, BookCopy, MessageCircle, NotepadText, UserRound } from 'lucide-react';
import { TabBarItem, TabBarProps } from '@/types/common/bottomTabBar';
import { useLocation } from 'react-router-dom';

const BottomTabBar: FC<TabBarProps> = ({ onTabChange }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>(() => {
    return sessionStorage.getItem('activeTab') || 'bookshelf';
  });
  const [tabHeight, setTabHeight] = useState<string>('h-20');

  // 숨길 경로 목록
  const hiddenPaths = [
    '/login',
    '/oauth',
    '/setting-location',
    '/bookshelf/add/title',
    '/bookshelf/add/isbn',
    '/bookshelf/add/self',
    '/bookshelf/add/search',
    '/bookshelf/add/ocr-result',
    '/setting-location',
    '/notifications'
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

  // 화면 높이에 따라 탭바 높이 조정
  useEffect(() => {
    const updateTabHeight = () => {
      const viewportHeight = window.innerHeight;

      // 뷰포트 높이에 따라 다른 높이 설정
      if (viewportHeight < 667) {
        // iPhone SE, 작은 화면
        setTabHeight('h-16');
      } else if (viewportHeight < 812) {
        // iPhone 8, 중간 화면
        setTabHeight('h-18');
      } else {
        // iPhone X 이상, 큰 화면
        setTabHeight('h-20');
      }
    };

    // 초기 설정 및 리사이즈 이벤트 리스너 등록
    updateTabHeight();
    window.addEventListener('resize', updateTabHeight);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', updateTabHeight);
    };
  }, []);

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

  // 하단 탭바 - 동적 높이 적용 및 미묘한 음영 효과 추가
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-tabBackground border-t border-light-text-muted/10 z-50 shadow-[0_-3px_6px_0_rgba(0,0,0,0.1)] pb-safe">
      {/* 매우 미묘한 상단 그림자 효과 */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-black/[0.02] to-transparent transform -translate-y-full"></div>

      <nav className={`flex justify-around items-center ${tabHeight} pt-2 pb-2`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-primary' : 'text-light-text-secondary'
              } py-1`}
              onClick={() => handleTabChange(tab.id)}
            >
              <div className="flex items-center justify-center mb-1">
                {/* 활성화 상태에 따라 아이콘 스타일 변경 */}
                <Icon size={window.innerHeight < 667 ? 20 : 24} strokeWidth={isActive ? 2 : 0.5} />
              </div>
              <p className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>{tab.name}</p>
              {isActive && <div className="bg-primary h-1 w-3 rounded-sm mt-1"></div>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomTabBar;
