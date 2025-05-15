import { BookOpen } from 'lucide-react';

const BookTripIntroCard = () => (
  <div className="bg-[#FFF3F3] border border-[#FF8080] rounded-md px-5 py-3 mb-4 mx-4 mt-4">
    <div className="flex items-center gap-1 mb-1">
      <BookOpen className="text-[#FF4040] w-4 h-4" />
      <h1 className="text-[#FF4040] font-medium text-sm">책의 여정 보기 시스템</h1>
    </div>
    <p className="text-[gray] text-xs sm:text-sm leading-relaxed">
      내가 교환하거나, 대여한 책들을 다른 사람은 어떻게 읽었을까요? <br />
      책의 여정 보기를 통해 다양한 감상과 독서 경험을 확인해보세요.
    </p>
  </div>
);

export default BookTripIntroCard;
