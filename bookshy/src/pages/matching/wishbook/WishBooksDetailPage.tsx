import Header from '@/components/common/Header';
import TabNavBar from '@/components/common/TabNavBar';
import { useNavigate, Outlet } from 'react-router-dom';

const WishBooksDetailPage = () => {
  const navigate = useNavigate();
  const bookId = 1; // 예시로 bookId를 1로 설정, 실제로는 props나 context에서 받아와야 함

  const pages = [
    { path: `/bookshelf/books/${bookId}`, label: '정보' },
    { path: `/bookshelf/books/${bookId}/notes`, label: '내 독서 기록' },
  ];
  return (
    <div>
      <Header
        title="도서 상세 보기"
        showBackButton={true}
        showNotification={true} // 알림 아이콘 표시
        className="bg-gradient-to-r from-[#FCF6D4] to-[#F4E8B8] shadow-none"
        onBackClick={() => navigate(-1)}
      />
      <div className="bookshelf-container flex flex-col min-h-screen">
        {/* 책 정보 컴포넌트 */}
        <div className="bg-light-bg flex-shrink-0 border-b border-gray-200">
          <TabNavBar pages={pages} />
        </div>

        <div className="bg-light-bg flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-screen-md mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
export default WishBooksDetailPage;
