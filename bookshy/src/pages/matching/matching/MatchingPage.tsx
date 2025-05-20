import { FC } from 'react';
import Header from '@/components/common/Header';
import { useNavigate, Outlet } from 'react-router-dom';
import TabNavBar from '@/components/common/TabNavBar';

const MatchingPage: FC = () => {
  const navigate = useNavigate();
  const pages = [
    { path: '/matching', label: '매칭된 책' },
    { path: '/matching/wish-books', label: '읽고 싶은 책' },
  ];
  return (
    <div className="flex flex-col h-full bg-light-bg">
      {/* Header - Fixed at top */}
      <div className="flex-none">
        <Header
          title="매칭 추천"
          onBackClick={() => navigate(-1)}
          showBackButton={false}
          showNotification={true}
          extraButton={null}
          extraButtonIcon={null}
          onExtraButtonClick={() => {}}
          className="bg-light-bg shadow-md"
        />
        <TabNavBar pages={pages} />
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
export default MatchingPage;
