import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { SplashScreenProps } from '@/types/splash';

const SplashScreen = ({
  animationData,
  onFinish,
  minDisplayTime = 2000,
  text = '북끄북끄',
}: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 일정 시간 후 스플래시 화면 종료
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish();
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime, onFinish]);

  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#fffdf8] z-50">
      <div className="flex flex-col items-center w-full max-w-xs">
        {/* Lottie 애니메이션 */}
        <div className="w-full mb-4">
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay
            style={{ width: '100%', maxWidth: '200px', margin: '0 auto' }}
          />
        </div>

        {/* 앱 이름 */}
        {text && <h1 className="text-2xl font-bold text-[#5e4b39] mt-2">{text}</h1>}

        {/* 간단한 설명 문구 */}
        <p className="text-sm text-[#8a7b70] mt-2">책을 끄집어내고, 책을 끄적이다</p>
      </div>
    </div>
  );
};

export default SplashScreen;
