// Modern design effects - glassmorphism, animations, hover states
// Centralizovaný systém pro moderní efekty
import BORDER_RADIUS from '../../styles/borderRadius';

const modernEffects = {
  // Glassmorphism efekty
  glassmorphism: {
    light: {
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
    },
    dark: {
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      backgroundColor: 'rgba(26, 26, 26, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    }
  },

  // Smoke overlay efekt
  smokeOverlay: {
    light: {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(139, 188, 143, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(188, 143, 143, 0.15) 0%, transparent 50%)',
        opacity: 0.6,
        pointerEvents: 'none',
        borderRadius: 'inherit',
        zIndex: 1,
      }
    },
    dark: {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 20%, rgba(139, 188, 143, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(188, 143, 143, 0.1) 0%, transparent 50%)',
        opacity: 0.6,
        pointerEvents: 'none',
        borderRadius: 'inherit',
        zIndex: 1,
      }
    }
  },

  // Animations
  animations: {
    fadeIn: {
      '@keyframes fadeIn': {
        from: { opacity: 0 },
        to: { opacity: 1 }
      },
      animation: 'fadeIn 0.3s ease-in-out'
    },
    slideUp: {
      '@keyframes slideUp': {
        from: { transform: 'translateY(20px)', opacity: 0 },
        to: { transform: 'translateY(0)', opacity: 1 }
      },
      animation: 'slideUp 0.3s ease-in-out'
    },
    scaleIn: {
      '@keyframes scaleIn': {
        from: { transform: 'scale(0.95)', opacity: 0 },
        to: { transform: 'scale(1)', opacity: 1 }
      },
      animation: 'scaleIn 0.3s ease-in-out'
    }
  },

  // Hover efekty
  hoverEffects: {
    lift: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
      }
    },
    glow: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        boxShadow: '0 8px 32px rgba(139, 188, 143, 0.4)',
      }
    },
    scale: {
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'scale(1.02)',
      }
    }
  }
};

// Helper funkce pro vytváření glassmorphism efektů
export const createGlass = (intensity = 'normal', isDark = false) => {
  const baseStyle = isDark ? modernEffects.glassmorphism.dark : modernEffects.glassmorphism.light;
  
  const intensityMap = {
    subtle: { blur: '20px', opacity: isDark ? 0.3 : 0.7 },
    normal: { blur: '40px', opacity: isDark ? 0.5 : 0.5 },
    strong: { blur: '60px', opacity: isDark ? 0.7 : 0.3 }
  };

  const config = intensityMap[intensity] || intensityMap.normal;

  return {
    backdropFilter: `blur(${config.blur}) saturate(180%)`,
    WebkitBackdropFilter: `blur(${config.blur}) saturate(180%)`,
    backgroundColor: isDark 
      ? `rgba(26, 26, 26, ${config.opacity})`
      : `rgba(255, 255, 255, ${config.opacity})`,
    border: baseStyle.border,
    boxShadow: baseStyle.boxShadow,
  };
};

// Helper funkce pro hover efekty
export const createHover = (type = 'lift') => {
  return modernEffects.hoverEffects[type] || modernEffects.hoverEffects.lift;
};

// Helper funkce pro vytvoření backdrop blur efektu (pro Dialog backdrop)
export const createBackdrop = () => ({
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
});

// Helper funkce pro vytvoření glassmorphism Dialog Paper props
export const createGlassDialog = (isDark = false, borderRadius = '20px') => ({
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  backgroundColor: isDark 
    ? 'rgba(26, 26, 26, 0.85)'
    : 'rgba(255, 255, 255, 0.85)',
  borderRadius,
  boxShadow: isDark
    ? '0 8px 32px rgba(139, 188, 143, 0.2), 0 4px 16px rgba(0, 0, 0, 0.4)'
    : '0 8px 32px rgba(85, 107, 47, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
});

// Helper funkce pro moderní karty
export const createModernCard = (isDark = false, borderRadius = '20px') => ({
  elevation: 0,
  sx: {
    borderRadius,
    backgroundColor: isDark 
      ? 'rgba(26, 26, 26, 0.95)'
      : 'rgba(255, 255, 255, 0.95)',
    border: isDark
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.08)',
    ...modernEffects.hoverEffects.lift,
  }
});

// Helper funkce pro transitions
export const createTransition = (properties = ['all'], duration = 0.3, easing = 'cubic-bezier(0.4, 0, 0.2, 1)') => ({
  transition: properties.map(prop => `${prop} ${duration}s ${easing}`).join(', ')
});

// Export všeho
export const glassmorphism = modernEffects.glassmorphism.light;
export const glassmorphismDark = modernEffects.glassmorphism.dark;
export const animations = modernEffects.animations;
export const hoverEffects = modernEffects.hoverEffects;
// Helper funkce pro glow efekt (pro selected karty)
export const createGlow = (isSelected = false, color = 'rgba(139, 188, 143, 0.6)') => ({
  boxShadow: isSelected
    ? `0 0 12px 2px ${color}`
    : '0 2px 8px rgba(0, 0, 0, 0.15)',
  transition: 'all 0.2s',
});

// Helper funkce pro IconButton hover efekt
export const createIconButtonHover = (color = 'primary', isDark = false) => {
  const colors = {
    primary: {
      dark: 'rgba(139, 188, 143, 0.1)',
      light: 'rgba(139, 188, 143, 0.08)',
    },
    secondary: {
      dark: 'rgba(255, 255, 255, 0.1)',
      light: 'rgba(0, 0, 0, 0.05)',
    },
    error: {
      dark: 'rgba(244, 67, 54, 0.1)',
      light: 'rgba(244, 67, 54, 0.08)',
    }
  };

  return {
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: isDark
        ? colors[color]?.dark
        : colors[color]?.light,
    }
  };
};

// ===== BUTTON SYSTEM =====
// Import BORDER_RADIUS bude potřeba v komponentě, která toto používá

// Základní tlačítko (pro akce: Uložit, Zrušit, atd.)
export const createActionButton = (variant = 'contained', borderRadius = '18px') => ({
  borderRadius,
  textTransform: 'none',
  px: 3,
  py: 1,
  fontWeight: 500,
});

// Náhledové tlačítko (vždy User ikona, jednotný design) - moderní 3D efekt
export const createPreviewButton = (isDark = false, borderRadius = '18px') => ({
  borderRadius,
  textTransform: 'none',
  px: 2.5,
  py: 0.75,
  fontWeight: 500,
  color: 'primary.main',
  border: '1px solid',
  borderColor: isDark ? 'rgba(139, 188, 143, 0.3)' : 'rgba(85, 107, 47, 0.3)',
  backgroundColor: isDark ? 'rgba(139, 188, 143, 0.08)' : 'rgba(85, 107, 47, 0.08)',
  boxShadow: isDark
    ? '0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    : '0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    backgroundColor: isDark ? 'rgba(139, 188, 143, 0.18)' : 'rgba(85, 107, 47, 0.18)',
    borderColor: isDark ? 'rgba(139, 188, 143, 0.6)' : 'rgba(85, 107, 47, 0.6)',
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: isDark
      ? '0 8px 20px rgba(139, 188, 143, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      : '0 8px 20px rgba(85, 107, 47, 0.25), inset 0 1px 0 rgba(255, 255, 255, 1)',
    '&::before': {
      left: '100%',
    }
  },
  '&:active': {
    transform: 'translateY(0) scale(0.98)',
  }
});

// IconButton akční (malá tlačítka v kartách - Eye, Pencil, Trash, atd.)
export const createIconButton = (color = 'primary', isDark = false, size = 'small') => {
  const colors = {
    primary: {
      color: 'primary.main',
      hover: isDark ? 'rgba(139, 188, 143, 0.1)' : 'rgba(139, 188, 143, 0.08)',
    },
    secondary: {
      color: 'text.secondary',
      hover: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
    error: {
      color: 'error.main',
      hover: isDark ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.08)',
    }
  };

  const padding = size === 'small' ? 0.5 : 1;

  return {
    p: padding,
    minWidth: { xs: 36, sm: 44 },  // Touch target: 36px na mobilu, 44px na desktopu
    minHeight: { xs: 36, sm: 44 },
    color: colors[color]?.color || colors.primary.color,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: colors[color]?.hover || colors.primary.hover,
    }
  };
};

// Moderní client preview tlačítko (s gradientem, glassmorphism, shine, glow)
export const createClientPreviewButton = (isDark = false) => ({
  py: 0.5,
  px: 1.5,
  fontSize: '0.7rem',
  fontWeight: 600,
  borderRadius: BORDER_RADIUS.small,
  color: '#fff',
  background: isDark
    ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.9) 0%, rgba(85, 107, 47, 0.85) 100%)'
    : 'linear-gradient(135deg, rgba(139, 188, 143, 0.95) 0%, rgba(85, 107, 47, 0.9) 100%)',
  backdropFilter: 'blur(10px)',
  textTransform: 'none',
  alignSelf: 'flex-start',
  border: '1px solid',
  borderColor: isDark
    ? 'rgba(139, 188, 143, 0.3)'
    : 'rgba(255, 255, 255, 0.4)',
  boxShadow: isDark
    ? '0 2px 8px rgba(139, 188, 143, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
    : '0 2px 8px rgba(85, 107, 47, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: isDark
      ? '0 4px 16px rgba(139, 188, 143, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      : '0 4px 16px rgba(85, 107, 47, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(-1px) scale(1.01)',
  },
});

// Primary modal button (fullWidth) s gradient a shine animation
export const createPrimaryModalButton = (isDark = false) => ({
  py: 1.5,
  px: 4,
  fontWeight: 600,
  borderRadius: BORDER_RADIUS.compact,
  color: '#fff',
  background: isDark
    ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.95) 0%, rgba(85, 107, 47, 0.9) 100%)'
    : 'linear-gradient(135deg, rgba(139, 188, 143, 0.98) 0%, rgba(85, 107, 47, 0.95) 100%)',
  backdropFilter: 'blur(10px)',
  textTransform: 'none',
  border: '1px solid',
  borderColor: isDark
    ? 'rgba(139, 188, 143, 0.4)'
    : 'rgba(255, 255, 255, 0.5)',
  boxShadow: isDark
    ? '0 4px 12px rgba(139, 188, 143, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
    : '0 4px 12px rgba(85, 107, 47, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: isDark
      ? '0 8px 20px rgba(139, 188, 143, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
      : '0 8px 20px rgba(85, 107, 47, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0px)',
  },
});

// TextField s moderním stylingem (focus glow, background)
export const createFormTextField = (isDark = false) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: BORDER_RADIUS.compact,
    backgroundColor: isDark
      ? 'rgba(255, 255, 255, 0.03)'
      : 'rgba(0, 0, 0, 0.02)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.03)',
    },
    '&.Mui-focused': {
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.03)',
      boxShadow: isDark
        ? '0 0 0 2px rgba(139, 188, 143, 0.3)'
        : '0 0 0 2px rgba(85, 107, 47, 0.2)',
    },
  },
});

// Cancel/Zrušit button s moderním stylingem
export const createCancelButton = (isDark = false) => ({
  px: 3,
  py: 1,
  fontWeight: 500,
  borderRadius: BORDER_RADIUS.compact,
  textTransform: 'none',
  color: 'text.secondary',
  border: '1px solid',
  borderColor: 'divider',
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: 'text.secondary',
    backgroundColor: isDark
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(0, 0, 0, 0.03)',
  },
});

// Submit/Action button ve formuláři (contained, s moderními efekty)
export const createSubmitButton = (isDark = false) => ({
  px: 3,
  py: 1,
  fontWeight: 600,
  borderRadius: BORDER_RADIUS.compact,
  textTransform: 'none',
  color: '#fff',
  background: isDark
    ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.9) 0%, rgba(85, 107, 47, 0.85) 100%)'
    : 'linear-gradient(135deg, rgba(139, 188, 143, 0.95) 0%, rgba(85, 107, 47, 0.9) 100%)',
  border: '1px solid',
  borderColor: isDark
    ? 'rgba(139, 188, 143, 0.3)'
    : 'rgba(255, 255, 255, 0.4)',
  boxShadow: isDark
    ? '0 2px 8px rgba(139, 188, 143, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
    : '0 2px 8px rgba(85, 107, 47, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: isDark
      ? '0 4px 12px rgba(139, 188, 143, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      : '0 4px 12px rgba(85, 107, 47, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
    '&::before': {
      left: '100%',
    },
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
});

// Světlé outlined tlačítko s moderními efekty (pro Admin badge, atd.)
export const createOutlinedButton = (isDark = false) => ({
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  fontSize: '0.7rem',
  position: 'relative',
  overflow: 'hidden',
  color: 'primary.main',
  backdropFilter: 'blur(30px)',
  background: isDark
    ? 'rgba(255, 255, 255, 0.05)'
    : 'rgba(255, 255, 255, 0.8)',
  borderWidth: 2,
  borderColor: isDark
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(0, 0, 0, 0.12)',
  boxShadow: isDark
    ? '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    : '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    background: isDark
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(255, 255, 255, 0.95)',
    // Glow efekt místo ostrého borderu
    boxShadow: isDark
      ? '0 8px 24px rgba(139, 188, 143, 0.3), 0 0 20px rgba(139, 188, 143, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
      : '0 8px 24px rgba(85, 107, 47, 0.2), 0 0 20px rgba(85, 107, 47, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1)',
    borderColor: isDark
      ? 'rgba(255, 255, 255, 0.25)'
      : 'rgba(0, 0, 0, 0.15)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(-1px) scale(1.01)',
  },
});

export default {
  glassmorphism,
  glassmorphismDark,
  animations,
  hoverEffects,
  createGlass,
  createHover,
  createBackdrop,
  createGlassDialog,
  createModernCard,
  createTransition,
  createGlow,
  createIconButtonHover,
  createActionButton,
  createPreviewButton,
  createIconButton,
  createClientPreviewButton,
  createOutlinedButton,
};