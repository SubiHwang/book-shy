import { useQuery } from '@tanstack/react-query';
import { fetchUserProfile } from '@/services/mypage/profile';
import Header from '@/components/common/Header';
import { useNavigate, Outlet } from 'react-router-dom';
import TabNavBar from '@/components/common/TabNavBar';
import type { UserProfile } from '@/types/User/user';
import { Settings } from 'lucide-react';

const greetings = [
  '오늘도 북끄북끄한 하루 되세요! 🍀',
  '책 속에서 행복한 하루 보내세요! ❤️',
  '좋은 책은 당신을 기다리고 있어요 📖',
  '당신의 독서 여정을 응원합니다! 🌟',
  '오늘도 한 장, 내일도 한 걸음! 👣',
];

const MyPage = () => {
  const navigate = useNavigate();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<UserProfile, Error, UserProfile>({
    queryKey: ['profile'],
    queryFn: fetchUserProfile,
  });

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

  const pages = [
    { path: '/mypage/promises', label: '거래 약속 보기' },
    { path: '/mypage', label: '거래 기록' },
  ];

  if (isLoading) return <div className="p-4">불러오는 중...</div>;
  if (error || !profile) return <div className="p-4 text-red-500">프로필 불러오기 실패</div>;

  return (
    <div className="bg-light-bg flex flex-col min-h-screen">
      <Header
        title="마이페이지"
        onBackClick={() => navigate(-1)}
        showBackButton={false}
        showNotification
        className="bg-light-bg shadow-md"
      />

      <section className="px-4 py-4 bg-white flex items-center rounded-xl mx-3 mt-3 shadow-md relative">
        <button
          onClick={() => navigate('/mypage/edit')}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          aria-label="프로필 수정"
        >
          <Settings />
        </button>

        <img
          src={profile.profileImageUrl}
          alt="프로필"
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div className="flex-1">
          <p className="font-semibold">{profile.nickname}님 </p>
          <p className="text-sm text-gray-500">{randomGreeting}</p>
          <div className="flex gap-2 mt-2">
            <div className="badge bg-primary-light/25 text-primary">
              북끄지수 {profile.bookShyScore.toFixed(1)}
            </div>
            <div className="badge bg-light-status-success/15 text-green-600">{profile.badge}</div>
          </div>
        </div>
      </section>

      <TabNavBar pages={pages} />
      <Outlet />
    </div>
  );
};

export default MyPage;
