const BookTripIntroCard = () => (
  <div className="bg-[#FFF3F3] rounded-lg p-4 text-sm text-gray-600 mb-4">
    <div className="flex items-center gap-1 mb-1">
      <img src="/icons/book-journey-icon.svg" className="w-4 h-4" alt="책의 여정" />
      <span className="font-bold text-red-500">책의 여정 보기 시스템</span>
    </div>
    <p>
      내가 공감하거나, 대단한 책들을 다른 사람은 어떻게 읽었을까요?
      <br />
      책의 여정 기록을 통해 다른 사람들의 감상평을 알아보세요.
    </p>
  </div>
);

export default BookTripIntroCard;
