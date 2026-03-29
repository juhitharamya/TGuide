import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const MOBILE_MAX_WIDTH = 768;

export function useDeviceType() {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const isMobile = width <= MOBILE_MAX_WIDTH;
    const isDesktop = width > MOBILE_MAX_WIDTH;

    return {
      width,
      isMobile,
      isDesktop,
    };
  }, [width]);
}
