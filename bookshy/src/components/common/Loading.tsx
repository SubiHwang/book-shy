import { FC } from 'react';
import { LoadingProps } from '@/types/common/loading';
import Lottie from 'lottie-react';
import LoadingAnimation from '@/assets/lottie/loading-primary-accent-color.json';

const Loading: FC<LoadingProps> = ({ loadingText = '로딩 중...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-24 lg:py-32 min-h-[40vh]">
      <Lottie
        animationData={LoadingAnimation}
        loop={true}
        autoplay={true}
        className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28"
      />
      <p className="text-primary-accent text-sm sm:text-base md:text-lg mt-2 sm:mt-3 md:mt-4">
        {loadingText}
      </p>
    </div>
  );
};

export default Loading;
