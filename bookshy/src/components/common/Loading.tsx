import { FC } from 'react';
import { LoadingProps } from '@/types/common/loading';
import Lottie from 'lottie-react';
import LoadingAnimation from '@/assets/lottie/loading-primary-accent-color.json';

const Loading: FC<LoadingProps> = ({ loadingText = '로딩 중...' }) => {
  return (
    <div className="flex flex-col py-64 items-center justify-center">
      <Lottie animationData={LoadingAnimation} loop={true} autoplay={true} className="h-28 w-28" />
      <p className="text-primary-accent">{loadingText}</p>
    </div>
  );
};
export default Loading;
