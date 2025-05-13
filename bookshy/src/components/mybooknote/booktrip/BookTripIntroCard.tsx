import { BookOpen } from 'lucide-react'; // 책과 관련된 아이콘으로 BookOpen 선택

const BookTripIntroCard = () => (
  <div className="bg-primary-light/20 px-5 sm:px-8 md:px-10 py-3 sm:py-4">
    <div className="flex items-center gap-1 mb-1 sm:mb-2">
      <BookOpen className="text-primary-dark w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1} />
      <h1 className="text-primary-dark font-medium text-sm sm:text-base md:text-lg">
        책의 여정 보기 시스템
      </h1>
    </div>
    <p className="text-light-text-secondary font-light text-xs sm:text-sm leading-tight sm:leading-normal">
      내가 교환하거나, 대여한 책들을 다른 사람은 어떻게 읽었을까요?
      <br className="sm:hidden" />
      책의 여정 보기를 통해 다른 사람들의 감상평을 알아보세요.
    </p>
  </div>
);

export default BookTripIntroCard;
