// utils/gradientStyles.ts

// 그라데이션 방향 타입 정의
type GradientDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top right'
  | 'top left'
  | 'bottom right'
  | 'bottom left';

// 색상 배열 타입 정의
type ColorArray = [string, string];

// 그라데이션 스타일 인터페이스 정의
interface GradientStyle {
  background: string;
}

// 사전 정의된 그라데이션 타입 정의
interface GradientStyles {
  [key: string]: GradientStyle;
}

/**
 * 색상 배열과 방향을 이용해 그라데이션 스타일 객체 생성
 * @param colors 그라데이션에 사용할 색상 배열 [시작색, 끝색]
 * @param direction 그라데이션 방향 ('top', 'right', 'bottom', 'left' 등)
 * @returns CSS 스타일 객체
 */
export const createGradientStyle = (
  colors: ColorArray,
  direction: GradientDirection = 'right',
): GradientStyle => {
  return {
    background: `linear-gradient(to ${direction}, ${colors[0]}, ${colors[1]})`,
  };
};

/**
 * 사전 정의된 그라데이션 스타일 (fallback용)
 */
export const defaultGradients: GradientStyles = {
  warmYellow: {
    background: 'linear-gradient(to right, #FCF6D4, #F4E8B8)',
  },
  coolBlue: {
    background: 'linear-gradient(to right, #E3F2FD, #BBDEFB)',
  },
  softPink: {
    background: 'linear-gradient(to right, #FCE4EC, #F8BBD0)',
  },
};

// 추가 편의 함수: 색상 코드에서 밝게/어둡게 변형
/**
 * 헥스 색상 코드를 밝게 또는 어둡게 조정
 * @param hex 변형할 헥스 색상 코드
 * @param percent 밝기 조정 비율 (-100 ~ 100, 음수는 어둡게, 양수는 밝게)
 * @returns 조정된 헥스 색상 코드
 */
export const adjustColorBrightness = (hex: string, percent: number): string => {
  // 헥스 색상에서 RGB 추출
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // 밝기 조정
  r = Math.min(255, Math.max(0, Math.round(r + (percent / 100) * 255)));
  g = Math.min(255, Math.max(0, Math.round(g + (percent / 100) * 255)));
  b = Math.min(255, Math.max(0, Math.round(b + (percent / 100) * 255)));

  // RGB를 헥스로 변환
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

/**
 * 단일 색상에서 그라데이션 생성 (더 밝은/어두운 변형 사용)
 * @param baseColor 기본 색상
 * @param brightnessOffset 밝기 조정값 (%)
 * @param direction 그라데이션 방향
 * @returns 그라데이션 스타일 객체
 */
export const createMonochromaticGradient = (
  baseColor: string,
  brightnessOffset: number = 10,
  direction: GradientDirection = 'right',
): GradientStyle => {
  const secondColor = adjustColorBrightness(baseColor, brightnessOffset);
  return createGradientStyle([baseColor, secondColor], direction);
};

export default {
  createGradientStyle,
  defaultGradients,
  adjustColorBrightness,
  createMonochromaticGradient,
};
