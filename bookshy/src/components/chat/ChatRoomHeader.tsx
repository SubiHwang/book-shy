import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NotificationButton from '../common/NotificationButton';

interface ChatRoomHeaderProps {
  partnerName: string;
  partnerProfileImage: string;
  bookShyScore: number; // 북끄지수
}

const ChatRoomHeader: FC<ChatRoomHeaderProps> = ({
  partnerName,
  partnerProfileImage,
  bookShyScore,
}) => {
  const navigate = useNavigate();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 w-full px-4 flex items-center justify-between border-b border-[#E5E5E5] bg-white"
      style={{ height: 56, paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* 왼쪽: 뒤로가기 + 프로필 */}
      <div className="flex items-center gap-3 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-full active:bg-gray-200 transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={22} />
        </button>
        <img
          src={partnerProfileImage}
          alt={partnerName}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base sm:text-lg text-black">{partnerName}</span>
            {bookShyScore !== undefined && (
              <span className="text-xs sm:text-sm text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                북끄지수 {bookShyScore}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 오른쪽: 일정/알림 */}
      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationButton></NotificationButton>
      </div>
    </header>
  );
};

export default ChatRoomHeader;
