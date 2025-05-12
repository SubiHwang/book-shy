interface Props {
  profileImageUrl: string;
  nickname: string;
  createdAt: string;
  content: React.ReactNode;
  isMine?: boolean;
  children?: React.ReactNode; // 수정/삭제 버튼 영역 등
}

const BookTripBubble = ({
  profileImageUrl,
  nickname,
  createdAt,
  content,
  isMine = false,
  children,
}: Props) => {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} gap-2`}>
      {!isMine && (
        <img
          src={profileImageUrl || '/avatars/default.png'}
          alt={nickname}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className={`text-sm ${isMine ? 'text-right' : 'text-left'} w-full max-w-[80%]'`}>
        <p className="text-xs text-gray-500 mb-1">
          {isMine ? '나의 한 마디' : `${nickname} 님의 한 마디`} ·{' '}
          {new Date(createdAt).toLocaleString()}
        </p>
        <div className="bg-white px-4 py-3 rounded-2xl shadow-sm min-h-[72px]">{content}</div>
        {children && <div className="flex justify-end gap-2 mt-2">{children}</div>}
      </div>
      {isMine && (
        <img
          src={profileImageUrl || '/avatars/me.png'}
          alt="내 프로필"
          className="w-8 h-8 rounded-full"
        />
      )}
    </div>
  );
};

export default BookTripBubble;
