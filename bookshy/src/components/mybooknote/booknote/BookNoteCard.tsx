interface BookNoteCardProps {
  coverUrl?: string;
  title: string;
  author?: string;
  quote?: string;
  content?: string;
  flipped: boolean;
  onMoreClick?: () => void;
}

const BookNoteCard: React.FC<BookNoteCardProps> = ({
  coverUrl,
  title,
  author,
  quote,
  content,
  flipped,
  onMoreClick,
}) => {
  return (
    <div className="w-[280px] h-[420px] perspective">
      <div
        className={`relative w-full h-full duration-700 transform-style preserve-3d ${
          flipped ? 'rotate-y-180' : 'rotate-y-0'
        }`}
      >
        {/* 앞면: 인용구 */}
        <div className="absolute inset-0 backface-hidden rounded-2xl shadow-xl overflow-hidden">
          {/* 배경 이미지 */}
          <div className="absolute inset-0">
            <img
              src={coverUrl || '/placeholder.jpg'}
              alt={title}
              className="w-full h-full object-cover filter blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </div>

          {/* 인용구 내용 */}
          <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-6 text-center">
            <p className="text-xs mb-1 text-white/90">{author}</p>
            <h2 className="font-semibold text-sm mb-2 text-white">{title} 중에서</h2>
            <p className="text-sm leading-tight text-white/90">
              {quote || '등록된 인용구가 없습니다.'}
            </p>
          </div>
        </div>

        {/* 뒷면: 독후감 */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] rounded-2xl shadow-xl overflow-hidden">
          <div className="w-full h-full p-6 flex flex-col">
            {/* 헤더 영역 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-20 h-28 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img
                  src={coverUrl || '/placeholder.jpg'}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-800 truncate mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{author}</p>
              </div>
            </div>

            {/* 독후감 내용 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-primary rounded-full" />
                  <h4 className="text-sm font-medium text-gray-700">독후감</h4>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {content || '작성된 독후감이 없습니다.'}
                </p>
              </div>
            </div>

            {/* 더보기 버튼 */}
            {onMoreClick && (
              <div className="mt-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoreClick();
                  }}
                  className="w-full py-3 px-4 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-sm font-medium transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
                >
                  <span>전체 내용 보기</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookNoteCard;
