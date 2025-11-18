/**
 * MUI Theme Configuration - LifePro
 * Based on CoachPro Design System
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { csCZ } from '@mui/material/locale';

// Import CoachPro design tokens
import { THEME_COLORS } from '@/shared/styles/colors';
import BORDER_RADIUS from '@/shared/styles/borderRadius';

/**
 * Get MUI theme with light/dark mode support
 * @param mode - 'light' or 'dark'
 */
export const getTheme = (mode: 'light' | 'dark' = 'light') => {
  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: THEME_COLORS.primary.main,
        light: THEME_COLORS.primary.light,
        dark: THEME_COLORS.primary.dark,
      },
      secondary: {
        main: THEME_COLORS.secondary.main,
        light: THEME_COLORS.secondary.light,
        dark: THEME_COLORS.secondary.dark,
      },
      success: {
        main: THEME_COLORS.accent.success,
      },
      error: {
        main: THEME_COLORS.accent.error,
      },
      warning: {
        main: THEME_COLORS.accent.warning,
      },
      info: {
        main: THEME_COLORS.accent.info,
      },
      background: {
        default: mode === 'dark' ? '#0a0f0a' : '#f5f5f0',
        paper: mode === 'dark' ? '#1a2410' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f5f5f0' : '#2d3748',
        secondary: mode === 'dark' ? '#a0aec0' : '#718096',
      },
    },
    shape: {
      borderRadius: BORDER_RADIUS.card,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.5,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none', // Disable uppercase for buttons
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: BORDER_RADIUS.button,
            padding: '10px 20px',
            fontWeight: 600,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: BORDER_RADIUS.card,
            boxShadow: mode === 'dark'
              ? '0 4px 6px rgba(0, 0, 0, 0.3)'
              : '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: BORDER_RADIUS.input,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: BORDER_RADIUS.modal,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: BORDER_RADIUS.compact,
          },
        },
      },
      // Glassmorphism effect for Paper components
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: mode === 'dark'
              ? '0 2px 4px rgba(0, 0, 0, 0.2)'
              : '0 2px 4px rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  };

  return createTheme(themeOptions, csCZ); // Czech localization
};

export default getTheme;
