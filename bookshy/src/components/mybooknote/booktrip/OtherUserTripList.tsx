import type { BookTripWithUser } from '@/types/mybooknote/booktrip/booktrip';

interface Props {
  trips: BookTripWithUser[];
}

const OtherUserTripList = ({ trips }: Props) => (
  <>
    {trips.map((trip) => (
      <div key={trip.tripId} className="flex items-start gap-2">
        <img
          src={trip.userProfile.profileImageUrl || '/avatars/default.png'}
          className="w-8 h-8 rounded-full"
          alt={trip.userProfile.nickname}
        />
        <div>
          <p className="text-xs text-gray-500 mb-1">
            {trip.userProfile.nickname} 님의 한 마디 · {new Date(trip.createdAt).toLocaleString()}
          </p>
          <div className="bg-white px-4 py-2 rounded-md shadow-sm max-w-[80%] text-sm">
            {trip.content}
          </div>
        </div>
      </div>
    ))}
  </>
);

export default OtherUserTripList;
