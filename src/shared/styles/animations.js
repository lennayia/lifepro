/**
 * Framer Motion Animation Presets - CoachPro Design System
 * Používáno v celém ekosystému Pro aplikací
 */

// Fade In
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
};

// Fade In Up
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

// Fade In Down
export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

// Scale In
export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.4, type: 'spring', stiffness: 200 },
};

// Stagger Container (pro lists)
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Stagger Item
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Glow Animation (pulzující efekt)
export const glow = {
  animate: {
    boxShadow: [
      '0 0 5px rgba(139, 188, 143, 0.3)',
      '0 0 20px rgba(139, 188, 143, 0.6)',
      '0 0 5px rgba(139, 188, 143, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Hover Scale
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 300 },
};

// Slide In Left
export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5 },
};

// Slide In Right
export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5 },
};

// Rotate In
export const rotateIn = {
  initial: { rotate: -180, opacity: 0 },
  animate: { rotate: 0, opacity: 1 },
  transition: { duration: 0.6 },
};

// Float Animation (levitující efekt)
export const float = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Bounce
export const bounce = {
  initial: { y: -100 },
  animate: { y: 0 },
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 10,
  },
};

// Page Transition
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

export default {
  fadeIn,
  fadeInUp,
  fadeInDown,
  scaleIn,
  staggerContainer,
  staggerItem,
  glow,
  hoverScale,
  slideInLeft,
  slideInRight,
  rotateIn,
  float,
  bounce,
  pageTransition,
};
