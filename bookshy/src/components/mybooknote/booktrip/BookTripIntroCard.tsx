import { ShipWheel } from 'lucide-react';

const BookTripIntroCard = () => (
  // 책의 여정 보기 시스템 (수정된 버전)
  <div className="bg-primary-light/20 px-5 sm:px-8 py-3 sm:py-4">
    <div className="flex items-center gap-1 mb-1 sm:mb-2">
      <ShipWheel className="text-primary-dark w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1} />
      <h1 className="text-primary-dark font-medium text-sm sm:text-base md:text-lg">
        책의 여정 보기 시스템
      </h1>
    </div>
    <p className="text-light-text-secondary font-light text-xs sm:text-sm leading-tight sm:leading-normal">
      내가 교환하거나, 대여한 책들을 다른 사람은 어떻게 읽었을까요?
      <span className="hidden sm:inline"> </span>
      <span className="inline sm:hidden">
        <br />
      </span>
      책의 여정 보기를 통해 다양한 감상과 독서 경험을 확인해보세요.
    </p>
  </div>
);

export default BookTripIntroCard;
