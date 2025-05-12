interface Props {
  value: number;
  onChange: (val: number) => void;
}

function TradeRatingStars({ value, onChange }: Props) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`text-2xl ${star <= value ? 'text-primary' : 'text-gray-300'}`}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default TradeRatingStars;
