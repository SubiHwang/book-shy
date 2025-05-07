import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  bookId: number;
  title: string;
  coverUrl: string;
}

const BookCard: React.FC<BookCardProps> = ({ bookId, title, coverUrl }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/booknotes/detail/${bookId}`);
  };

  return (
    <div
      className="relative w-[140px] h-[210px] bg-white rounded-2xl shadow overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
    </div>
  );
};

export default BookCard;
