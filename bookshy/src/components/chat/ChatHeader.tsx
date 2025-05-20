import { FC } from 'react';

interface ChatHeaderProps {
  partnerName: string;
  partnerProfileImage: string;
  bookShyScore: number;
}

const ChatHeader: FC<ChatHeaderProps> = ({ partnerName, partnerProfileImage, bookShyScore }) => {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 w-full flex items-center justify-between border-b bg-white"
      style={{ height: 56, paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center gap-3 py-3 px-4">
        <img
          src={partnerProfileImage}
          alt={partnerName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-base text-black">{partnerName}</span>
          <span className="text-xs text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
            북끄지수 {bookShyScore}
          </span>
        </div>
      </div>
      {/* 알림/뒤로가기 등 추가 가능 */}
    </header>
  );
};

export default ChatHeader; 