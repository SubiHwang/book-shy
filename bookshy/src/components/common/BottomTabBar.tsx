import { FC, useState, useEffect } from 'react';
import { LibraryBig, BookCopy, NotepadText, UserRound } from 'lucide-react';
import { TabBarProps } from '@/types/common/bottomTabBar';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatButton from './ChatButton';
import TabButton from './TabButton';

const BottomTabBar: FC<TabBarProps> = ({ onTabChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
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
    '/notifications',
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

    // 기본 경로로 이동 (bookshelf는 루트 경로)
    navigate(`/${tabId === 'bookshelf' ? '' : tabId}`);

    if (onTabChange) {
      onTabChange(tabId); // 부모 컴포넌트에 탭 변경 알림
    }
  };

  if (shouldHideTabBar) {
    return null; // 경로가 숨김 목록에 포함되면 탭바를 렌더링하지 않음
  }

  // 하단 탭바 - 동적 높이 적용 및 미묘한 음영 효과 추가
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-tabBackground border-t border-light-text-muted/10 z-50 shadow-[0_-3px_6px_0_rgba(0,0,0,0.1)] pb-safe">
      {/* 매우 미묘한 상단 그림자 효과 */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-black/[0.02] to-transparent transform -translate-y-full"></div>

      <nav className={`flex justify-around items-center ${tabHeight} pt-2 pb-2`}>
        {/* 내 서재 탭 */}
        <TabButton
          name="내 서재"
          Icon={LibraryBig}
          isActive={activeTab === 'bookshelf'}
          onClick={() => handleTabChange('bookshelf')}
        />

        {/* 매칭 추천 탭 */}
        <TabButton
          name="매칭 추천"
          Icon={BookCopy}
          isActive={activeTab === 'matching'}
          onClick={() => handleTabChange('matching')}
        />

        {/* 채팅 탭 - 별도 컴포넌트 사용 */}
        <ChatButton isActive={activeTab === 'chat'} onClick={() => handleTabChange('chat')} />

        {/* 독서 기록 탭 */}
        <TabButton
          name="독서 기록"
          Icon={NotepadText}
          isActive={activeTab === 'booknotes'}
          onClick={() => handleTabChange('booknotes')}
        />

        {/* 마이 페이지 탭 */}
        <TabButton
          name="마이"
          Icon={UserRound}
          isActive={activeTab === 'mypage'}
          onClick={() => handleTabChange('mypage')}
        />
      </nav>
    </div>
  );
};

export default BottomTabBar;
