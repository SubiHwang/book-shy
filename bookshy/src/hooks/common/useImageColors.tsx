// hooks/common/useImageColors.tsx
import { useState, useEffect, useMemo } from 'react';

// 색상 배열 타입 정의
type ColorArray = [string, string];

// 반환 값에 대한 인터페이스 정의
interface ImageColorsResult {
  colors: ColorArray;
  pastelColors: ColorArray;
  isLoading: boolean;
  error: Error | null;
}

/**
 * 색상을 파스텔톤으로 변환하는 함수
 * @param hexColor 변환할 색상 코드
 * @param brightness 밝기 조정 (0-1 사이, 높을수록 더 밝음)
 * @param minBrightness 최소 밝기 값 (0-255)
 * @returns 파스텔톤 색상 코드
 */
export const pastelizeColor = (
  hexColor: string, 
  brightness: number = 0.7, 
  minBrightness: number = 220
): string => {
  // RGB 값 추출
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // 색상을 파스텔톤으로 변환 (더 밝고 덜 채도 높게)
  const pastelR = Math.min(255, Math.max(minBrightness, Math.round(r * (1 - brightness) + 255 * brightness)));
  const pastelG = Math.min(255, Math.max(minBrightness, Math.round(g * (1 - brightness) + 255 * brightness)));
  const pastelB = Math.min(255, Math.max(minBrightness, Math.round(b * (1 - brightness) + 255 * brightness)));
  
  // 16진수 문자열로 변환
  return `#${(pastelR).toString(16).padStart(2, '0')}${(pastelG).toString(16).padStart(2, '0')}${(pastelB).toString(16).padStart(2, '0')}`;
};

/**
 * 이미지 URL로부터 주요 색상을 추출하는 React 훅
 * @param imageUrl 색상을 추출할 이미지의 URL
 * @param fallbackColors 이미지 로드 실패 시 사용할 기본 색상 배열
 * @param pastelBrightness 파스텔 변환 시 밝기 조정 (0-1 사이)
 * @param minBrightness 파스텔 색상의 최소 밝기 (0-255)
 * @returns 추출된 색상, 파스텔 색상, 로딩 상태, 오류 정보를 포함하는 객체
 */
export const useImageColors = (
  imageUrl: string | null | undefined, 
  fallbackColors: ColorArray = ['#FCF6D4', '#F4E8B8'],
  pastelBrightness: number = 0.7,
  minBrightness: number = 220
): ImageColorsResult => {
  const [colors, setColors] = useState<ColorArray>(fallbackColors);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 추출된 색상을 바탕으로 파스텔 색상 생성
  const pastelColors = useMemo<ColorArray>(() => {
    return [
      pastelizeColor(colors[0], pastelBrightness, minBrightness),
      pastelizeColor(colors[1], pastelBrightness, minBrightness)
    ];
  }, [colors, pastelBrightness, minBrightness]);

  useEffect(() => {
    if (!imageUrl) {
      setColors(fallbackColors);
      setIsLoading(false);
      return;
    }

    const extractColors = (): void => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = (): void => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          if (!ctx) {
            throw new Error('Canvas 2D context not supported');
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // 이미지의 다른 부분에서 색상 샘플링
          const topColor = getColorFromPixel(ctx, Math.floor(img.width/2), Math.floor(img.height/4));
          const bottomColor = getColorFromPixel(ctx, Math.floor(img.width/2), Math.floor(img.height*3/4));
          
          setColors([topColor, bottomColor]);
          setIsLoading(false);
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Unknown error occurred');
          setError(error);
          setColors(fallbackColors);
          setIsLoading(false);
        }
      };
      
      img.onerror = (event: Event | string): void => {
        const errorMessage = typeof event === 'string' ? event : 'Failed to load image';
        setError(new Error(errorMessage));
        setColors(fallbackColors);
        setIsLoading(false);
      };
      
      img.src = imageUrl;
    };

    /**
     * 캔버스 컨텍스트의 특정 픽셀에서 색상을 추출하여 헥스 코드로 반환
     */
    const getColorFromPixel = (ctx: CanvasRenderingContext2D, x: number, y: number): string => {
      try {
        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        const r = pixelData[0];
        const g = pixelData[1];
        const b = pixelData[2];
        
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
      } catch (err) {
        console.error('Error extracting pixel color:', err);
        // 오류 발생 시 흰색 반환
        return '#FFFFFF';
      }
    };

    extractColors();
  }, [imageUrl, fallbackColors]);

  return { colors, pastelColors, isLoading, error };
};

export default useImageColors;