import { FC } from 'react';

interface ScrollToBottomButtonProps {
  bottom: number;
  onClick: () => void;
}

const ScrollToBottomButton: FC<ScrollToBottomButtonProps> = ({ bottom, onClick }) => {
  return (
    <div
      className="w-full flex justify-center z-30"
      style={{
        position: 'absolute',
        left: 0,
        bottom: bottom + 16,
        transition: 'bottom 0.3s',
        pointerEvents: 'none',
      }}
    >
      <button
        style={{ pointerEvents: 'auto' }}
        className="bg-black/60 text-white px-3 py-1.5 rounded-full shadow-md"
        onClick={onClick}
      >
        ↓
      </button>
    </div>
  );
};

export default ScrollToBottomButton; 