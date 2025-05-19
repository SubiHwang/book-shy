import { useEffect } from 'react';

export function useViewportHeightFix(divRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const handleResize = () => {
      const visual = window.visualViewport;
      if (!visual || !divRef.current) return;

      const adjustedHeight = visual.height - 30;
      divRef.current.style.height = `${adjustedHeight}px`;

      if (window.scrollY > 0) {
        window.scrollTo(0, 0);
      }
    };

    handleResize();

    const visual = window.visualViewport; // ✅ 여기 추가
    visual?.addEventListener('resize', handleResize);
    return () => {
      visual?.removeEventListener('resize', handleResize);
    };
  }, [divRef]);
}
