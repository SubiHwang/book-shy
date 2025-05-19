import { useEffect, useState } from 'react';

export function useDynamicViewportHeight() {
  const getHeight = () =>
    window.visualViewport
      ? window.visualViewport.height
      : window.innerHeight;

  const [height, setHeight] = useState(getHeight());

  useEffect(() => {
    const updateHeight = () => setHeight(getHeight());
    window.visualViewport?.addEventListener('resize', updateHeight);
    window.addEventListener('resize', updateHeight);
    return () => {
      window.visualViewport?.removeEventListener('resize', updateHeight);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return height;
} 