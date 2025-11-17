/**
 * SRC/SHARED MODULES - Barrel Exports
 * Next.js kompatibilní shared moduly
 */

// ============================================
// COMPONENTS - Cards
// ============================================
export { default as FlipCard } from './components/cards/FlipCard.jsx';

// ============================================
// CONTEXT
// ============================================
export { ThemeProvider, useTheme } from './context/ThemeContext';

// ============================================
// HOOKS
// ============================================
export { default as useSoundFeedback } from './hooks/useSoundFeedback.js';
export { default as useModernEffects } from './hooks/useModernEffects.js';
export { default as useResponsive } from './hooks/useResponsive.js';

// ============================================
// STYLES
// ============================================
export * from './styles/animations.js';
export * from './styles/borderRadius.js';
export * from './styles/modernEffects.js';
export * from './styles/colors.js';

// ============================================
// CONSTANTS
// ============================================
export * from './constants/icons';
