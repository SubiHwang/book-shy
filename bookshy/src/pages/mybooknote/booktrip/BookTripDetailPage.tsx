import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchBookTripsByBookId } from '@/services/mybooknote/booktrip/booktrip';
import { fetchBookDetailByBookId } from '@/services/book/search';
import { fetchUserProfile } from '@/services/mypage/profile';
import type { BookTripWithUser } from '@/types/mybooknote/booktrip/booktrip';
import type { Book } from '@/types/book/book';
import type { UserProfile } from '@/types/User/user';
import Header from '@/components/common/Header';
import BookTripHeaderSection from '@/components/mybooknote/booktrip/BookTripHeaderSection';
import OtherUserTripList from '@/components/mybooknote/booktrip/OtherUserTripList';
import MyTripBox from '@/components/mybooknote/booktrip/MyTripBox';
import MyTripEditor from '@/components/mybooknote/booktrip/MyTripEditor';

const BookTripDetailPage = () => {
  const { bookId } = useParams<{ bookId: string }>();

  const { data: trips = [], isLoading: isTripsLoading } = useQuery<BookTripWithUser[]>({
    queryKey: ['bookTrips', bookId],
    queryFn: () => fetchBookTripsByBookId(Number(bookId)),
    enabled: !!bookId,
  });

  const { data: bookInfo, isLoading: isBookLoading } = useQuery<Book>({
    queryKey: ['bookInfo', bookId],
    queryFn: () => fetchBookDetailByBookId(Number(bookId)),
    enabled: !!bookId,
  });

  const { data: myProfile, isLoading: isUserLoading } = useQuery<UserProfile>({
    queryKey: ['myProfile'],
    queryFn: fetchUserProfile,
  });

  const myTrip = trips.find((trip) => trip.isMine);
  const otherTrips = trips.filter((trip) => !trip.isMine);

  if (isTripsLoading || isBookLoading || isUserLoading) {
    return <p className="text-center py-12 text-gray-500">로딩 중입니다...</p>;
  }

  return (
    <div className="bg-[#f9f4ec] min-h-screen pb-28">
      <Header title="독서 기록" showBackButton showNotification />
      <div className="px-4 py-4">
        <BookTripHeaderSection
          title={bookInfo!.title as string}
          author={bookInfo!.author as string}
          publisher={bookInfo!.publisher as string}
          coverUrl={bookInfo!.coverImageUrl}
        />

        <div className="flex flex-col gap-3">
          <OtherUserTripList trips={otherTrips} />
          {myTrip ? (
            <MyTripBox trip={myTrip} />
          ) : (
            <MyTripEditor profileImageUrl={myProfile?.profileImageUrl} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookTripDetailPage;
