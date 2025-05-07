import { FC } from 'react';
import type { BookNote } from '@/types/booknote';

interface BookNoteCardProps {
  note: BookNote;
}

const BookNoteCard: FC<BookNoteCardProps> = ({ note }) => {
  return (
    <div className="card flex items-center justify-between p-4 mb-4 w-full">
      {/* Book Image */}
      <div className="flex-shrink-0 w-24 h-32 mr-4">
        <img
          src={note.coverUrl}
          alt={note.title}
          className="w-full h-full object-cover rounded-md shadow-sm"
        />
      </div>

      {/* Book Info */}
      <div className="flex-grow">
        <h3 className="text-lg font-medium text-light-text mb-1 truncate">{note.title}</h3>
        <p className="text-sm font-light text-light-text-muted mb-1">작가: {note.author}</p>
        <p className="text-sm font-light text-light-text-muted mb-1">출판: {note.publisher}</p>
        <p className="text-xs text-light-text-muted line-clamp-2 mt-1">{note.content}</p>
      </div>
    </div>
  );
};

export default BookNoteCard;
