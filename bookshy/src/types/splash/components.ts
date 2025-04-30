export interface SplashScreenProps {
    animationData: any; // Lottie JSON 데이터
    onFinish: () => void;
    minDisplayTime?: number;
    text?: string;
  }