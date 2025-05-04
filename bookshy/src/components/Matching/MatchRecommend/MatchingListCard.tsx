import { FC, useState } from 'react';
import { MatchingCardProps } from '@/types/Matching';
import { ChevronDown, ChevronUp, BookMarked, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MatchingListCard: FC<MatchingCardProps> = ({ matching }) => {
  const navigate = useNavigate();
  const [isCardExtended, setIsCardExtended] = useState<boolean>(false);

  const handleCardExtend = (): void => {
    setIsCardExtended(!isCardExtended);
  };

  const handleClickNeighborsBookshelf = (userId: number): void => {
    navigate(`/matching/neigbors-bookshelf/${userId}`);
  };
  return (
    <div className="flex flex-col card m-4">
      <div className="flex items-center gap-3 justify-between px-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 overflow-hidden">
            <img
              src={matching.profileImage || '#'}
              alt={matching.name}
              className="w-full h-full object-cover rounded-full border"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <div className="text-light-text">
                <span className="text-lg font-bold">{matching.name}</span>
                <span className="text-md font-medium"> 님</span>
              </div>

              <div className="badge bg-primary-light/30">
                <p className="text-primary">북끄지수 {matching.shyScore}</p>
              </div>
            </div>
            <div className="text-sm text-light-text-muted mt-1">
              <p>{matching.location}</p>
            </div>
          </div>
        </div>

        <div className="badge bg-primary-light/30 px-3 py-1 rounded-full">
          <p className="text-primary text-sm font-medium">
            {matching.matchingPercent || '?'}% 매칭률
          </p>
        </div>
      </div>
      <div className="m-2 px-4">
        <div className="flex flex-wrap my-1">
          <span className="text-light-text-muted text-sm font-extralight mr-1">
            내가 읽고 싶은 책 :{' '}
          </span>
          <div className="flex flex-wrap">
            {matching.myWishBooks.map((myWishBook, index) => (
              <div
                key={index}
                className="badge bg-light-status-success/20 mx-1 mb-1 whitespace-nowrap"
              >
                <span className="text-light-status-success text-xs truncate max-w-32">
                  {myWishBook}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap my-1">
          <span className="text-light-text-muted text-sm font-extralight mr-1">
            상대가 읽고 싶은 책:{' '}
          </span>
          <div className="flex flex-wrap">
            {matching.yourWishBooks.map((yourWishBook, index) => (
              <div
                key={index}
                className="badge bg-light-status-info/20 mx-1 mb-1 whitespace-nowrap"
              >
                <span className="text-light-status-info text-xs truncate max-w-32">
                  {yourWishBook}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-1">
        <div className="px-5 pb-3" onClick={handleCardExtend}>
          {isCardExtended ? <ChevronUp strokeWidth={0.5} /> : <ChevronDown strokeWidth={0.5} />}
        </div>
      </div>
      {isCardExtended && (
        <div className="bg-light-bg-shade">
          <div className="text-center m-4 font-light">
            <span>
              {matching.name} 님은 내 책{' '}
              <span className="text-light-status-info">{matching.yourWishBooks.length} 권</span>에
              관심이 있고, 내가 원하는 책{' '}
              <span className="text-light-status-success">{matching.myWishBooks.length} 권</span>을
              가지고 있어요.
            </span>
          </div>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => handleClickNeighborsBookshelf(matching.id)}
              className="bg-white text-light-text-secondary mx-3 text-sm font-extralight px-4 py-1 rounded-md border border-light-text-secondary/30 flex justify-between"
            >
              <BookMarked width={20} strokeWidth={0.5} className="mx-2" />
              <span className="mr-2">서재 보러가기</span>
            </button>
            <button className="bg-primary-light text-white mx-3 text-sm font-extralight px-4 py-1 rounded-md border border-white flex justify-between">
              <MessageCircle width={20} strokeWidth={0.5} className="mx-2" />
              <span className="mr-2">채팅 하러가기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingListCard;
