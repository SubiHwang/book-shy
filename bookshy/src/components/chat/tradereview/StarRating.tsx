import { Star } from 'lucide-react';

interface Props {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

const StarRating = ({ label, value, onChange }: Props) => (
  <div className="mb-4 text-center">
    <p className="font-medium mb-1">{label}</p>
    <div className="flex justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)}>
          <Star fill={i < value ? '#E15F63' : 'none'} stroke="#E15F63" className="w-6 h-6" />
        </button>
      ))}
    </div>
  </div>
);

export default StarRating;
