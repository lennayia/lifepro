/**
 * Glassmorphism & Modern Effects - CoachPro Design System
 */

/**
 * Glassmorphism styles pro MUI komponenty
 * @param {string} intensity - 'subtle', 'medium', 'strong'
 * @param {string} mode - 'light' or 'dark'
 */
export const getGlassmorphism = (intensity = 'medium', mode = 'light') => {
  const configs = {
    subtle: {
      light: {
        background: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      },
      dark: {
        background: 'rgba(26, 36, 16, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      },
    },
    medium: {
      light: {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
      },
      dark: {
        background: 'rgba(26, 36, 16, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      },
    },
    strong: {
      light: {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
      },
      dark: {
        background: 'rgba(26, 36, 16, 0.9)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      },
    },
  };

  return {
    ...configs[intensity][mode],
    boxShadow:
      mode === 'dark'
        ? '0 8px 32px rgba(0, 0, 0, 0.4)'
        : '0 8px 32px rgba(0, 0, 0, 0.1)',
  };
};

/**
 * Gradient backgrounds pro kategorie
 */
export const CATEGORY_GRADIENTS = {
  // Přítomnost - JSEM (soft green)
  jsem: 'linear-gradient(135deg, #8FBC8F 0%, #B2D8B2 100%)',

  // Přítomnost - VÍM (blue-green)
  vim: 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)',

  // Přítomnost - UMÍM (orange-yellow)
  umim: 'linear-gradient(135deg, #FFA726 0%, #FFB74D 100%)',

  // Přítomnost - MÁM RÁD/A (pink-purple)
  mamRad: 'linear-gradient(135deg, #EC407A 0%, #F48FB1 100%)',

  // Minulost (warm beige-brown)
  minulost: 'linear-gradient(135deg, #D4A574 0%, #E6C9A8 100%)',

  // Budoucnost (blue-purple)
  budoucnost: 'linear-gradient(135deg, #5C6BC0 0%, #7E57C2 100%)',

  // Srdcovka / Favorite (vibrant pink)
  srdcovka: 'linear-gradient(135deg, #FF6B9D 0%, #FFA8CC 100%)',

  // Default (CoachPro primary)
  default: 'linear-gradient(135deg, #8FBC8F 0%, #D4A574 100%)',
};

/**
 * Hover glow effect
 */
export const hoverGlow = (color = '#8FBC8F') => ({
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: `0 0 20px ${color}66, 0 0 40px ${color}33`,
  },
});

/**
 * Neumorphism effect
 */
export const getNeumorphism = (mode = 'light') => ({
  background: mode === 'dark' ? '#1a2410' : '#f5f5f0',
  boxShadow:
    mode === 'dark'
      ? '8px 8px 16px #0f1408, -8px -8px 16px #252e18'
      : '8px 8px 16px #d9d9cf, -8px -8px 16px #ffffff',
  border: 'none',
});

export default {
  getGlassmorphism,
  CATEGORY_GRADIENTS,
  hoverGlow,
  getNeumorphism,
};
