import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';

const WishBooksDetailPage = () => {
  const navigate = useNavigate();

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

        <div className="bg-light-bg flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-screen-md mx-auto"></div>
        </div>
      </div>
    </div>
  );
};
export default WishBooksDetailPage;
