interface BookNoteCardProps {
  coverUrl?: string;
  title: string;
  author?: string;
  quote?: string;
  onMoreClick?: () => void; // ❗ 선택적 prop로 변경
}

const BookNoteCard: React.FC<BookNoteCardProps> = ({
  coverUrl,
  title,
  author,
  quote,
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

      {/* ✅ 인용구 화면만 표시 */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center px-6 text-white text-center">
        <p className="text-xs mb-1">{author}</p>
        <h2 className="font-semibold text-sm mb-2">{title} 중에서</h2>
        <p className="text-sm leading-tight">{quote || '등록된 인용구가 없습니다.'}</p>

        {/* ❓ 더 보기 버튼이 필요하다면 조건부 렌더링 */}
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
  );
};

export default BookNoteCard;
