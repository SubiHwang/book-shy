import BookTripBubble from './BookTripBubble';
import type { BookTripWithUser } from '@/types/mybooknote/booktrip/booktrip';

interface Props {
  trip: BookTripWithUser;
}

const MyTripBox = ({ trip }: Props) => {
  return (
    <BookTripBubble
      profileImageUrl={trip.userProfile.profileImageUrl}
      nickname={trip.userProfile.nickname}
      createdAt={trip.createdAt}
      content={trip.content}
      isMine
    >
      <button className="text-xs text-gray-600 border px-3 py-1 rounded-md">삭제하기</button>
      <button className="text-xs text-white bg-primary px-3 py-1 rounded-md">수정하기</button>
    </BookTripBubble>
  );
};

export default MyTripBox;
