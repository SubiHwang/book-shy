interface BookNoteCardProps {
  coverUrl?: string;
  title: string;
  author?: string;
  quote?: string;
  review?: string;
  stage: 'quote' | 'review';
  onMoreClick: () => void;
}

const BookNoteCard: React.FC<BookNoteCardProps> = ({
  coverUrl,
  title,
  author,
  quote,
  review,
  stage,
  onMoreClick,
}) => {
  return (
    <div className="w-[280px] h-[420px] rounded-2xl shadow-xl relative overflow-hidden z-10">
      <img
        src={coverUrl || '/placeholder.jpg'}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />

      {/* 인용구 화면 */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-center items-center px-6 text-white text-center transition-opacity duration-300 ${
          stage === 'quote' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <p className="text-xs mb-1">{author}</p>
        <h2 className="font-semibold text-sm mb-2">{title} 중에서</h2>
        <p className="text-sm leading-tight">{quote || '등록된 인용구가 없습니다.'}</p>
      </div>

      {/* 독후감 화면 */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-center items-center px-6 text-white text-center transition-opacity duration-300 ${
          stage === 'review' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <p className="text-xs mb-1">{author}</p>
        <h2 className="font-semibold text-sm mb-2">{title}을(를) 읽고</h2>
        <p className="text-sm leading-tight">{review || '작성된 독후감이 없습니다.'}</p>
        <p
          className="text-right text-xs text-white/80 mt-4 w-full"
          onClick={(e) => {
            e.stopPropagation();
            onMoreClick();
          }}
        >
          더 보기 →
        </p>
      </div>
    </div>
  );
};

export default BookNoteCard;
