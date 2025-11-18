// 🎨 Framer Motion animace pro CoachPro

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

// Fade in up animation
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Stagger container (pro postupné zobrazení dětí)
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Stagger item (použít jako child staggerContainer)
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Scale up animation (pro modaly)
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

// Slide in from right (pro drawers)
export const slideInRight = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: {
    x: '100%',
    transition: { duration: 0.2 }
  }
};

// Card hover animation
export const cardHover = {
  rest: {
    scale: 1,
    transition: { duration: 0.2 }
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2 }
  }
};

// Confetti trigger helper
export const triggerConfetti = () => {
  // Pro react-confetti komponentu
  // Tato funkce je placeholder - konfety se spustí přes state v komponentě
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('coachpro-confetti'));
  }
};

// 3D Card flip animation
export const cardFlip = {
  front: {
    rotateY: 0,
    transition: { duration: 0.6, ease: 'easeInOut' }
  },
  back: {
    rotateY: 180,
    transition: { duration: 0.6, ease: 'easeInOut' }
  }
};

// Pulse animation (for attention)
export const pulse = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

// Shimmer effect (loading state)
export const shimmer = {
  backgroundPosition: ['0% 0%', '100% 0%'],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: 'linear'
  }
};

// Float animation (subtle up/down)
export const float = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

// Glow animation (for highlights)
export const glow = {
  boxShadow: [
    '0 0 5px rgba(139, 188, 143, 0.3)',
    '0 0 20px rgba(139, 188, 143, 0.6)',
    '0 0 5px rgba(139, 188, 143, 0.3)',
  ],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};

// Bounce in animation
export const bounceIn = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15
    }
  }
};

// Rotate animation
export const rotate = {
  rotate: [0, 360],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'linear'
  }
};

export default {
  fadeIn,
  fadeInUp,
  staggerContainer,
  staggerItem,
  scaleUp,
  slideInRight,
  cardHover,
  triggerConfetti,
  cardFlip,
  pulse,
  shimmer,
  float,
  glow,
  bounceIn,
  rotate,
};
