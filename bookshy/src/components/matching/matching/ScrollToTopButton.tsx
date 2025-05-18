import { FC } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  onClick: () => void;
}

const ScrollToTopButton: FC<ScrollToTopButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-4 right-4 z-20">
      <button
        onClick={onClick}
        className="bg-primary text-white p-3 rounded-full shadow-lg"
        aria-label="맨 위로 스크롤"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
