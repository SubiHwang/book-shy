interface BookNoteCardProps {
  coverUrl?: string;
  title: string;
  author?: string;
  quote?: string;
  flipped: boolean;
  onMoreClick?: () => void;
}

const BookNoteCard: React.FC<BookNoteCardProps> = ({
  coverUrl,
  title,
  author,
  quote,
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
        {/* 앞면: 책 표지 */}
        <div className="absolute inset-0 backface-hidden rounded-2xl shadow-xl overflow-hidden">
          <img
            src={coverUrl || '/placeholder.jpg'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 뒷면: 인용구 */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-black/30 backdrop-blur-sm text-white rounded-2xl shadow-xl flex flex-col justify-center items-center px-6 text-center">
          <p className="text-xs mb-1">{author}</p>
          <h2 className="font-semibold text-sm mb-2">{title} 중에서</h2>
          <p className="text-sm leading-tight">{quote || '등록된 인용구가 없습니다.'}</p>

          {onMoreClick && (
            <p
              className="text-right text-xs text-white/80 mt-4 w-full"
              onClick={(e) => {
                e.stopPropagation();
                onMoreClick();
              }}
            >
              더 보기 →
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookNoteCard;
