import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Bell } from 'lucide-react';

interface ChatRoomHeaderProps {
  partnerName: string;
  partnerProfileImage: string;
  reputationScore?: number; // 북끄지수
}

const ChatRoomHeader: FC<ChatRoomHeaderProps> = ({
  partnerName,
  partnerProfileImage,
  reputationScore = 123,
}) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#FFFCF9] px-4 py-4 min-h-[64px] flex items-center justify-between border-b border-gray-200">
      {/* 왼쪽: 뒤로가기 + 프로필 */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={24} />
        </button>
        <img
          src={partnerProfileImage}
          alt={partnerName}
          className="w-11 h-11 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg text-black">{partnerName}</span>
            {reputationScore !== undefined && (
              <span className="text-sm text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                북끄지수 {reputationScore}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 오른쪽: 일정/알림 */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Calendar size={22} />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={22} />
        </button>
      </div>
    </header>
  );
};

export default ChatRoomHeader;
