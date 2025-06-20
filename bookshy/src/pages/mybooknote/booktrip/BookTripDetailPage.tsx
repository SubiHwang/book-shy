import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBookTripsByBookId } from '@/services/mybooknote/booktrip/booktrip';
import { fetchBookDetailByBookId } from '@/services/book/search';
import { fetchUserProfile } from '@/services/mypage/profile';
import type { BookTripWithUser } from '@/types/mybooknote/booktrip/booktrip';
import type { Book } from '@/types/book/book';
import type { UserProfile } from '@/types/User/user';
import Header from '@/components/common/Header';
import BookTripHeaderSection from '@/components/mybooknote/BookDetailHeaderSection';
import OtherUserTripItem from '@/components/mybooknote/booktrip/OtherUserTripItem';
import MyTripBox from '@/components/mybooknote/booktrip/MyTripBox';
import MyTripEditor from '@/components/mybooknote/booktrip/MyTripEditor';
import Loading from '@/components/common/Loading';
import { Book as BookIcon } from 'lucide-react';

const BookTripDetailPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

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

  const hasMyTrip = trips.some((trip) => trip.mine);

  if (isTripsLoading || isBookLoading || isUserLoading) {
    return (
      <div className="bg-[#f9f4ec] min-h-screen flex items-center justify-center">
        <Loading loadingText="책의 여정 정보를 불러오는 중..." />
      </div>
    );
  }

  if (!bookInfo) {
    return (
      <div className="bg-[#f9f4ec] min-h-screen">
        <Header
          title="독서 기록"
          showBackButton
          showNotification
          onBackClick={() => navigate(-1)}
          className="bg-light-bg shadow-none"
        />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)] px-4 text-center">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-lg font-medium text-gray-700 mb-2">책 정보를 찾을 수 없습니다</p>
            <p className="text-sm text-gray-500 mb-4">요청하신 도서 정보를 불러올 수 없습니다.</p>
            <button
              onClick={() => navigate(-1)}
              className="text-primary font-medium border border-primary px-4 py-2 rounded-md text-sm"
            >
              이전 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f4ec] min-h-screen pb-20">
      <Header
        title="독서 기록"
        showBackButton
        showNotification
        onBackClick={() => navigate(-1)}
        className="bg-light-bg shadow-none"
      />

      <BookTripHeaderSection
        title={bookInfo.title || '제목 없음'}
        author={bookInfo.author || '저자 미상'}
        publisher={bookInfo.publisher || '출판사 정보 없음'}
        coverUrl={bookInfo.coverImageUrl}
      />

      <div className="px-4">
        <div className="flex items-center my-4">
          <BookIcon size={18} className="text-primary mr-2" />
          <h2 className="text-base font-medium text-gray-800">
            <span className="text-primary font-semibold">"{bookInfo.title}"</span>의 여정 살펴보기
          </h2>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          {trips.length === 0 ? (
            <div className="bg-white rounded-lg p-4 text-center text-sm text-gray-500">
              아직 이 책에 대한 여정이 없습니다. 첫 번째 여정을 남겨보세요!
            </div>
          ) : (
            trips.map((trip) =>
              trip.mine ? (
                <MyTripBox key={trip.tripId} trip={trip} />
              ) : (
                <OtherUserTripItem key={trip.tripId} trip={trip} />
              ),
            )
          )}

          {!hasMyTrip && <MyTripEditor profileImageUrl={myProfile?.profileImageUrl} />}
        </div>
      </div>
    </div>
  );
};

export default BookTripDetailPage;
