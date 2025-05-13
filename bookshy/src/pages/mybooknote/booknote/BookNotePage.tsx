import Header from '@/components/common/Header';
import TabNavBar from '@/components/common/TabNavBar';
import { Outlet } from 'react-router-dom';

const BookNotePage = () => {
  const pages = [
    { path: '/booknotes', label: '내 독서 기록 보기' },
    { path: '/booknotes/trip', label: '책의 여정 보기' },
  ];

  return (
    <div>
      <Header title="독서 기록" showBackButton={false} showNotification={true} />
      <TabNavBar pages={pages} />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default BookNotePage;
