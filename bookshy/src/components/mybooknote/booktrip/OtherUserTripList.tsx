import BookTripBubble from './BookTripBubble';
import type { BookTripWithUser } from '@/types/mybooknote/booktrip/booktrip';

interface Props {
  trips: BookTripWithUser[];
}

const OtherUserTripList = ({ trips }: Props) => (
  <>
    {trips.map((trip) => (
      <BookTripBubble
        key={trip.tripId}
        profileImageUrl={trip.userProfile.profileImageUrl}
        nickname={trip.userProfile.nickname}
        createdAt={trip.createdAt}
        content={trip.content}
      />
    ))}
  </>
);

export default OtherUserTripList;
