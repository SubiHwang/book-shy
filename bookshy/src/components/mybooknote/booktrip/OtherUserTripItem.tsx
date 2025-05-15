import BookTripBubble from './BookTripBubble';
import type { BookTripWithUser } from '@/types/mybooknote/booktrip/booktrip';

interface Props {
  trip: BookTripWithUser;
}

const OtherUserTripItem = ({ trip }: Props) => (
  <BookTripBubble
    profileImageUrl={trip.userProfile.profileImageUrl}
    nickname={trip.userProfile.nickname}
    createdAt={trip.createdAt}
    content={trip.content}
  />
);

export default OtherUserTripItem;
