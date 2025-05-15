import { FC } from 'react';

interface LoadingIndicatorProps {
  loadingText: string;
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ loadingText }) => {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="w-10 h-10 border-t-2 border-primary-dark rounded-full animate-spin mb-2"></div>
      <p className="text-light-text-secondary text-sm">{loadingText}</p>
    </div>
  );
};

export default LoadingIndicator;
