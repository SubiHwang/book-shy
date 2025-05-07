import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  card: {
    title: string;
    coverUrl: string;
    reviewId?: number;
  };
}

const BookCard: React.FC<BookCardProps> = ({ card }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl shadow overflow-hidden cursor-pointer"
      onClick={() => navigate(`/booknotes/detail/${card.reviewId}`)}
    >
      <img
        src={card.coverUrl || '/placeholder.jpg'}
        alt={card.title}
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default BookCard;
