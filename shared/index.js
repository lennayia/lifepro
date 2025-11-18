/**
 * SHARED MODULES - Barrel Exports
 * Importováno z CoachPro pro konzistentní design
 */

// ============================================
// COMPONENTS - Cards
// ============================================
export { default as FlipCard } from './components/cards/FlipCard.jsx';
export { default as BaseCard } from './components/cards/BaseCard.jsx';

// ============================================
// COMPONENTS - Effects
// ============================================
export { default as AnimatedGradient } from './components/effects/AnimatedGradient.jsx';

// ============================================
// COMPONENTS - UI
// ============================================
export { default as GoogleSignInButton } from './components/GoogleSignInButton.jsx';
export { default as RegisterForm } from './components/RegisterForm.jsx';
export { default as WelcomeScreen } from './components/WelcomeScreen.jsx';
export { default as ProfileScreen } from './components/ProfileScreen.jsx';
export { default as PhotoUpload } from './components/PhotoUpload.jsx';
export { default as FloatingMenu } from './components/FloatingMenu.jsx';
export { default as NavigationFloatingMenu } from './components/NavigationFloatingMenu.jsx';
export { default as Breadcrumbs } from './components/Breadcrumbs.jsx';
export { default as Footer } from './components/Footer.jsx';
export { default as Layout } from './components/Layout.jsx';

// ============================================
// CONTEXT
// ============================================
export { default as NotificationContext, NotificationProvider, useNotification } from './context/NotificationContext.jsx';

// ============================================
// HOOKS
// ============================================
export { default as useSoundFeedback } from './hooks/useSoundFeedback.js';
export { default as useModernEffects } from './hooks/useModernEffects.js';
export { default as useResponsive } from './hooks/useResponsive.js';

// ============================================
// UTILS
// ============================================
export * from './utils/imageCompression.js';
export * from './utils/photoStorage.js';
export * from './utils/czechGrammar.js';
export * from './utils/validation.js';

// ============================================
// STYLES
// ============================================
export * from './styles /animations.js';
export * from './styles /borderRadius.js';
export * from './styles /modernEffects.js';
export * from './styles /colors.js';
