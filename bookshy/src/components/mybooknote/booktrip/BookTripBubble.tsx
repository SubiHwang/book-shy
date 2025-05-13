import React from 'react';

interface Props {
  profileImageUrl: string;
  nickname: string;
  createdAt: string;
  content: React.ReactNode;
  isMine?: boolean;
  children?: React.ReactNode;
}

// date-fns 대신 사용할 간단한 함수
const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}시간 전`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}일 전`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}개월 전`;

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}년 전`;
};

const BookTripBubble = ({
  profileImageUrl,
  nickname,
  createdAt,
  content,
  isMine = false,
  children,
}: Props) => {
  // 직접 구현한 함수로 날짜 포맷팅
  const formattedDate = formatRelativeTime(createdAt);

  return (
    <div className="relative mb-6">
      <div className="flex items-start relative z-10">
        {/* 프로필 이미지 */}
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
            <img
              src={profileImageUrl || (isMine ? '/avatars/me.png' : '/avatars/default.png')}
              alt={isMine ? '내 프로필' : nickname}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 말풍선 컨텐츠 */}
        <div className="flex-1 max-w-[calc(100%-3rem)]">
          {/* 사용자 정보 및 날짜 */}
          <div className="flex items-center mb-1.5">
            <span className="text-xs font-medium text-gray-700">
              {isMine ? '나의 한 마디' : `${nickname} 님의 한 마디`}
            </span>
            <span className="mx-1.5 text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">{formattedDate}</span>
          </div>

          {/* 말풍선 내용 */}
          <div
            className={`
            p-3.5 rounded-2xl shadow-sm 
            ${isMine ? 'bg-white text-primary' : 'bg-white text-light-text'}
          `}
          >
            <div className="text-sm break-words whitespace-pre-wrap leading-relaxed">{content}</div>
          </div>

          {/* 액션 버튼 영역 */}
          {children && <div className="flex justify-end gap-2 mt-2">{children}</div>}
        </div>
      </div>
    </div>
  );
};

export default BookTripBubble;
