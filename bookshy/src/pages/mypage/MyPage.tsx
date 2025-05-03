import { FC } from 'react';
import Header from '@/components/common/Header';
import { useNavigate, Outlet } from 'react-router-dom';
import TabNavBar from '@/components/common/TabNavBar';

const MyPage: FC = () => {
  const navigate = useNavigate();
  const pages = [
    { path: '/mypage', label: '거래 약속 보기' },
    { path: '/mypage/history', label: '거래 기록' },
  ];

  return (
    <div className="bg-light-bg flex flex-col min-h-screen">
      <Header
        title="마이페이지"
        onBackClick={() => navigate(-1)}
        showBackButton={false}
        showNotification
        className="bg-light-bg shadow-md"
      />

      <section className="px-4 py-4 bg-white flex items-center rounded-xl mx-3 mt-3 shadow-sm">
        <img
          src="/images/profile.jpg"
          alt="profile"
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div className="flex-1">
          <p className="font-semibold">마이쿨님 🛠️</p>
          <p className="text-sm text-gray-500">오늘도 북끄북끄한 하루 되세요!</p>
          <div className="text-xs text-pink-500 font-medium">북지수 85</div>
          <div className="text-xs text-green-600 font-medium mt-1">상성력 최강의 탐라지 마니아</div>
        </div>
      </section>

      <TabNavBar pages={pages} />
      <Outlet />
    </div>
  );
};

export default MyPage;
