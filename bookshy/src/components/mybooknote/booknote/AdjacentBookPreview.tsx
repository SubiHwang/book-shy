import type { BookNote } from '@/types/mybooknote/booknote';

interface AdjacentBookPreviewProps {
  book: BookNote;
  direction: 'left' | 'right';
  onClick: () => void;
}

const AdjacentBookPreview: React.FC<AdjacentBookPreviewProps> = ({ book, direction, onClick }) => {
  const positionStyle = direction === 'left' ? 'left-0' : 'right-0';

  return (
    <div
      className={`absolute ${positionStyle} top-1/2 w-[280px] h-[420px] -translate-y-1/2 scale-75 opacity-40 overflow-hidden rounded-2xl`}
    >
      <img
        src={book.coverUrl || '/placeholder.jpg'}
        alt={book.title}
        className="w-full h-full object-cover"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      />
    </div>
  );
};

export default AdjacentBookPreview;
