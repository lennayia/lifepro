// 🎨 REACT HOOK PRO MODERN EFFECTS
// ===================================
import { useCallback } from 'react';
import { useThemeMode } from '../../App';
import {
  createGlass,
  createHover,
  createTransition,
  createModernCard,
  animations,
  hoverEffects
} from '../styles/modernEffects';
import BORDER_RADIUS from '../../styles/borderRadius';

export const useModernEffects = () => {
  const { mode } = useThemeMode();
  const isDarkMode = mode === 'dark';

  // 🌊 Glassmorphism hook
  const glass = useCallback((intensity = 'normal', useNature = false) => {
    return createGlass(intensity, isDarkMode, useNature);
  }, [isDarkMode]);

  // ⚡ Hover effects hook
  const hover = useCallback((type = 'lift', intensity = 'normal') => {
    return createHover(type, intensity);
  }, []);

  // 🎭 Transition hook
  const transition = useCallback((properties, speed = 'normal', easing = 'ease') => {
    return { transition: createTransition(properties, speed, easing) };
  }, []);

  // 🎯 Kompletní moderní karta hook
  const card = useCallback((glassIntensity = 'normal', hoverType = 'lift', useNature = false) => {
    return createModernCard(glassIntensity, hoverType, isDarkMode, useNature);
  }, [isDarkMode]);

  // 🎨 Předpřipravené kombinace pro časté použití
  const presets = {
    // Header glassmorphism
    header: useCallback(() => ({
      ...glass('normal'),
      borderBottom: '1px solid',
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    }), [glass, isDarkMode]),

    // Card glassmorphism (pro ProgressGarden, DailyView atd.)
    glassCard: useCallback((intensity = 'normal') => ({
      ...glass(intensity),
      borderRadius: BORDER_RADIUS.glassPanel,
      position: 'relative',
      overflow: 'hidden',
    }), [glass]),

    // Card s Nature theme tintem
    natureCard: useCallback((intensity = 'normal') => ({
      ...glass(intensity, true), // useNature = true
      borderRadius: BORDER_RADIUS.glassPanel,
      position: 'relative',
      overflow: 'hidden',
    }), [glass]),

    // Modal/Dialog glassmorphism
    modal: useCallback(() => ({
      ...glass('strong'),
      borderRadius: BORDER_RADIUS.modal,
    }), [glass]),

    // Navbar/AppBar glassmorphism
    navbar: useCallback(() => ({
      ...glass('normal'),
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    }), [glass]),

    // Sidebar glassmorphism (DEPRECATED - used by old Sidebar.jsx in _deprecated/)
    // sidebar: useCallback(() => ({
    //   ...glass('subtle'),
    //   borderRight: '1px solid',
    //   borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    // }), [glass, isDarkMode]),

    // Button glassmorphism
    button: useCallback(() => ({
      ...glass('subtle'),
      ...hover('lift', 'subtle'),
      ...transition(['transform', 'box-shadow'], 'fast', 'easeOut'),
      borderRadius: BORDER_RADIUS.button,
      padding: '0.75rem 1.5rem'
    }), [glass, hover, transition]),

    // Input field glassmorphism
    input: useCallback(() => ({
      ...transition(['box-shadow', 'background'], 'fast', 'ease'),
      borderRadius: BORDER_RADIUS.input,
      '& .MuiOutlinedInput-root': {
        borderRadius: BORDER_RADIUS.input,
        ...(isDarkMode ? {
          background: 'rgba(26, 26, 26, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
          },
          '&.Mui-focused': {
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)'
          }
        } : {
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
          },
          '&.Mui-focused': {
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
          }
        }),
      }
    }), [transition, isDarkMode])
  };

  // 🔧 Utility funkce
  const utils = {
    // Rychlý glassmorphism
    glass,

    // Rychlý hover
    hover,

    // Rychlý transition
    transition,

    // Kompletní karta
    card,

    // Vytvoří custom glow efekt s barvou
    colorGlow: useCallback((color, intensity = 0.3) => ({
      transition: 'box-shadow 0.3s ease',
      '&:hover': {
        boxShadow: `0 0 30px ${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`
      }
    }), []),

    // Vytvoří responzivní efekt
    responsive: useCallback((baseEffect, mobileEffect) => ({
      ...baseEffect,
      '@media (max-width: 768px)': mobileEffect
    }), []),

    // Kombinuje více efektů
    combine: useCallback((...effects) => {
      return effects.reduce((combined, effect) => ({
        ...combined,
        ...effect
      }), {});
    }, [])
  };

  return {
    // Základní hooks
    glass,
    hover,
    transition,
    card,

    // Předpřipravené kombinace
    presets,

    // Utility funkce
    utils,

    // Přímý přístup k animacím
    animations,
    hoverEffects,

    // Kontext info
    isDarkMode,
    mode
  };
};

// 🚀 Specialized hooks pro specifické případy použití

// Hook pro header/navbar
export const useHeader = () => {
  const { presets } = useModernEffects();
  return presets.header();
};

// Hook pro karty
export const useGlassCard = (intensity = 'normal') => {
  const { presets } = useModernEffects();
  return presets.glassCard(intensity);
};

// Hook pro Nature theme karty
export const useNatureCard = (intensity = 'normal') => {
  const { presets } = useModernEffects();
  return presets.natureCard(intensity);
};

// Hook pro modaly/dialogy
export const useModal = () => {
  const { presets } = useModernEffects();
  return presets.modal();
};

// Hook pro tlačítka
export const useButton = () => {
  const { presets } = useModernEffects();
  return presets.button();
};

// Hook pro input fieldy
export const useInput = () => {
  const { presets } = useModernEffects();
  return presets.input();
};

// Export všech hooks
export default useModernEffects;
