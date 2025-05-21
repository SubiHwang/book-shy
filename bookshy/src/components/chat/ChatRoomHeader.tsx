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
    <div className="flex justify-between items-center font-bold">
      <button onClick={() => navigate(-1)}>
        <ArrowLeft size={22} />
      </button>
      <div className="flex items-center gap-3">
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
      <div className="w-[2rem] h-[2rem]">
        <NotificationButton />
      </div>
    </div>
  );
};

export default ChatRoomHeader;
