// Cesta: src/shared/hooks/useResponsive.js
// Jednotný hook pro responsive design napříč celou aplikací

import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Hook pro responsive design s konzistentními breakpointy
 * Použití:
 *   const { isMobile, isTablet, isDesktop, isVeryNarrow } = useResponsive();
 *   const { up, down, between, only } = useResponsive();
 */
export const useResponsive = () => {
  const theme = useTheme();

  // Základní breakpointy (můžeme je snadno změnit na jednom místě)
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // < 900px
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 900px - 1200px
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg')); // >= 1200px
  const isVeryNarrow = useMediaQuery(theme.breakpoints.down('sm')); // < 600px

  // Flexibilní funkce pro custom queries
  const up = (breakpoint) => useMediaQuery(theme.breakpoints.up(breakpoint));
  const down = (breakpoint) => useMediaQuery(theme.breakpoints.down(breakpoint));
  const between = (start, end) => useMediaQuery(theme.breakpoints.between(start, end));
  const only = (breakpoint) => useMediaQuery(theme.breakpoints.only(breakpoint));

  return {
    // Předpřipravené hodnoty
    isMobile,
    isTablet,
    isDesktop,
    isVeryNarrow,

    // Flexibilní funkce
    up,
    down,
    between,
    only,

    // Orientace
    isPortrait: useMediaQuery('(orientation: portrait)'),
    isLandscape: useMediaQuery('(orientation: landscape)'),

    // Touch device detection
    isTouchDevice: useMediaQuery('(hover: none) and (pointer: coarse)'),
  };
};

/**
 * Hook pro získání aktuálního breakpointu jako string
 * Vrací: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 */
export const useBreakpoint = () => {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();

  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
};

/**
 * Hook pro responsive hodnoty (podobně jako sx responsivní objekty)
 * Použití: const spacing = useResponsiveValue({ xs: 2, sm: 3, md: 4 })
 */
export const useResponsiveValue = (values) => {
  const theme = useTheme();
  const breakpoint = useBreakpoint();

  // Najdi nejvyšší definovanou hodnotu pro aktuální breakpoint
  const keys = [...theme.breakpoints.keys];
  const currentIndex = keys.indexOf(breakpoint);

  for (let i = currentIndex; i >= 0; i--) {
    if (values[keys[i]] !== undefined) {
      return values[keys[i]];
    }
  }

  // Fallback na první definovanou hodnotu
  return values[keys[0]] || values.xs;
};
