import { FC, useState } from 'react';
import { MatchingCardProps } from '@/types/Matching';
import { ChevronDown, ChevronUp, BookMarked, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromToken } from '@/utils/jwt';
import { fetchChatList } from '@/services/chat/chat';
import { createChatRoom } from '@/services/matching/chatroom';

const MatchingListCard: FC<MatchingCardProps> = ({ matching }) => {
  const navigate = useNavigate();
  const [isCardExtended, setIsCardExtended] = useState<boolean>(false);
  const myUserId = getUserIdFromToken()!;

  const handleCardExtend = (): void => {
    setIsCardExtended(!isCardExtended);
  };

  const handleChatClick = async () => {
    try {
      const { roomId } = await createChatRoom({
        user1Id: myUserId,
        user2Id: matching.id,
      });

      navigate(`/chats/${roomId}`, {
        state: {
          partnerName: matching.name,
          partnerProfileImage: matching.profileImage,
        },
      });
    } catch (err: any) {
      if (err.response?.status === 405) {
        // 기존 방이 이미 있는 경우: fetchChatList 로 찾아서 이동
        const rooms = await fetchChatList();
        const existing = rooms.find(
          /**
           * 매칭 데이터가 없어서 일단 하드 코딩으로 인혁이 채팅방으로 가지도록 해놓았습니다.
           */
          (r: any) =>
            (r.participantId === myUserId && r.partnerId === 10) ||
            (r.partnerId === myUserId && r.participantId === 10),
        );
        if (existing) {
          navigate(`/chat/${existing.id}`, {
            state: {
              partnerName: existing.partnerName,
              partnerProfileImage: existing.partnerProfileImage,
            },
          });
          return;
        }
      }
      console.error(err);
      alert('채팅방 열기에 실패했습니다.');
    }
  };

  const handleClickNeighborsBookshelf = (userId: number): void => {
    navigate(`/matching/neigbors-bookshelf/${userId}`);
  };

  return (
    <div className="flex flex-col card m-4 sm:m-4 w-full max-w-md mx-auto">
      {/* 카드 헤더 - 프로필 부분 */}
      <div className="flex items-center justify-between px-3 sm:px-5 pt-4 sm:pt-5 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 프로필 이미지 */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 overflow-hidden flex-shrink-0">
            <img
              src={matching.profileImage || '#'}
              alt={matching.name}
              className="w-full h-full object-cover rounded-full border"
            />
          </div>

          {/* 이름과 위치 정보 */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center flex-wrap gap-1 sm:gap-2">
              <div className="text-light-text">
                <span className="text-base sm:text-lg font-bold">{matching.name}</span>
                <span className="text-sm sm:text-md font-medium"> 님</span>
              </div>

              <div className="badge bg-primary-light/30">
                <p className="text-primary text-xs sm:text-sm">북끄지수 {matching.shyScore}</p>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-light-text-muted mt-0.5 sm:mt-1">
              <p>{matching.location}</p>
            </div>
          </div>
        </div>

        {/* 매칭률 배지 */}
        <div className="badge bg-primary-light/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ml-auto">
          <p className="text-primary text-xs sm:text-sm font-medium">
            {matching.matchingPercent || '?'}% 매칭률
          </p>
        </div>
      </div>

      {/* 책 정보 섹션 */}
      <div className="m-1 sm:m-2 px-2 sm:px-4">
        {/* 내가 읽고 싶은 책 섹션 */}
        <div className="flex flex-wrap my-1 items-start">
          <span className="text-light-text-muted text-xs sm:text-sm font-extralight mr-1 whitespace-nowrap">
            내가 읽고 싶은 책 :{' '}
          </span>
          <div className="flex flex-wrap">
            {matching.myWishBooks.map((myWishBook, index) => (
              <div
                key={index}
                className="badge bg-light-status-success/20 mx-0.5 sm:mx-1 mb-1 whitespace-nowrap"
              >
                <span className="text-light-status-success text-xs truncate max-w-20 sm:max-w-32">
                  {myWishBook}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 상대가 읽고 싶은 책 섹션 */}
        <div className="flex flex-wrap my-1 items-start">
          <span className="text-light-text-muted text-xs sm:text-sm font-extralight mr-1 whitespace-nowrap">
            상대가 읽고 싶은 책:{' '}
          </span>
          <div className="flex flex-wrap">
            {matching.yourWishBooks.map((yourWishBook, index) => (
              <div
                key={index}
                className="badge bg-light-status-info/20 mx-0.5 sm:mx-1 mb-1 whitespace-nowrap"
              >
                <span className="text-light-status-info text-xs truncate max-w-20 sm:max-w-32">
                  {yourWishBook}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 펼치기/닫기 버튼 */}
      <div className="flex justify-end mb-0 sm:mb-1">
        <div className="px-3 sm:px-5 pb-2 sm:pb-3 cursor-pointer" onClick={handleCardExtend}>
          {isCardExtended ? (
            <ChevronUp strokeWidth={0.5} className="w-5 h-5" />
          ) : (
            <ChevronDown strokeWidth={0.5} className="w-5 h-5" />
          )}
        </div>
      </div>

      {/* 확장 영역 */}
      {isCardExtended && (
        <div className="bg-light-bg-shade rounded-b">
          <div className="text-center py-2 px-3 sm:m-4 font-light flex flex-col gap-1">
            <p className="text-xs sm:text-sm">
              {matching.name} 님은 내 책{' '}
              <span className="text-light-status-info">{matching.yourWishBooks.length} 권</span>에
              관심이 있고
            </p>
            <p className="text-xs sm:text-sm">
              내가 원하는 책{' '}
              <span className="text-light-status-success">{matching.myWishBooks.length} 권</span>을
              가지고 있어요.
            </p>
          </div>
          <div className="flex justify-center gap-2 sm:gap-0 flex-wrap pb-3 sm:mb-4 px-2">
            <button
              onClick={() => handleClickNeighborsBookshelf(matching.id)}
              className="bg-white text-light-text-secondary mx-1 sm:mx-3 text-xs sm:text-sm font-extralight px-2 sm:px-4 py-1 rounded-md border border-light-text-secondary/30 flex items-center"
            >
              <BookMarked width={16} height={16} strokeWidth={0.5} className="mx-1 sm:mx-2" />
              <span className="mr-1 sm:mr-2">서재 보기</span>
            </button>
            <button
              onClick={handleChatClick}
              className="bg-primary-light text-white mx-1 sm:mx-3 text-xs sm:text-sm font-extralight px-2 sm:px-4 py-1 rounded-md border border-white flex items-center"
            >
              <MessageCircle width={16} height={16} strokeWidth={0.5} className="mx-1 sm:mx-2" />
              <span className="mr-1 sm:mr-2">채팅 하기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingListCard;
