import { useState } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import QuickTooltip from './AppTooltip';
import { getCurrentUser } from '../../modules/coach/utils/storage';
import { NAVIGATION_ICONS, SETTINGS_ICONS } from '../constants/icons';

/**
 * NavigationFloatingMenu - Plovoucí navigační menu v levém horním rohu
 *
 * Logo + hlavní navigace (Dashboard, Materiály, Programy, Klientky)
 * Inspirováno PaymentsPro designem
 * Univerzální pro coach i client
 *
 * @created 4.11.2025
 * @updated 10.11.2025 - Modulární s userType prop
 */
const NavigationFloatingMenu = ({ isOpen = false, onToggle, userType = 'coach' }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.isAdmin === true;

  const handleToggle = () => {
    const newState = !isOpen;
    onToggle?.(newState);
  };

  const handleNavigate = (path) => {
    onToggle?.(false);
    navigate(path);
  };

  // Coach navigation items
  const coachMenuItems = [
    {
      icon: NAVIGATION_ICONS.dashboard,
      label: 'Dashboard',
      onClick: () => handleNavigate('/coach/dashboard'),
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    },
    {
      icon: NAVIGATION_ICONS.materials,
      label: 'Knihovna materiálů',
      onClick: () => handleNavigate('/coach/materials'),
      gradient: `linear-gradient(120deg, ${theme.palette.secondary.light} 0%, ${theme.palette.primary.dark} 100%)`,
    },
    {
      icon: NAVIGATION_ICONS.programs,
      label: 'Programy',
      onClick: () => handleNavigate('/coach/programs'),
      gradient: `linear-gradient(150deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.dark} 100%)`,
    },
    {
      icon: NAVIGATION_ICONS.cards,
      label: 'Koučovací karty',
      onClick: () => handleNavigate('/coach/cards'),
      gradient: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
    },
    {
      icon: NAVIGATION_ICONS.clients,
      label: 'Klientky',
      onClick: () => handleNavigate('/coach/clients'),
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
    },
  ];

  // Client navigation items
  const clientMenuItems = [
    {
      icon: NAVIGATION_ICONS.dashboard,
      label: 'Dashboard',
      onClick: () => handleNavigate('/client/dashboard'),
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    },
    {
      icon: NAVIGATION_ICONS.sessions,
      label: 'Moje sezení',
      onClick: () => handleNavigate('/client/sessions'),
      gradient: `linear-gradient(120deg, ${theme.palette.secondary.light} 0%, ${theme.palette.primary.dark} 100%)`,
    },
    {
      icon: NAVIGATION_ICONS.materials,
      label: 'Materiály',
      onClick: () => handleNavigate('/client/materials'),
      gradient: `linear-gradient(150deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.dark} 100%)`,
    },
    {
      icon: NAVIGATION_ICONS.programs,
      label: 'Moje programy',
      onClick: () => handleNavigate('/client/programs'),
      gradient: `linear-gradient(120deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.dark} 100%)`,
    },
    {
      icon: NAVIGATION_ICONS.cards,
      label: 'Koučovací karty',
      onClick: () => handleNavigate('/client/cards'),
      gradient: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
    },
  ];

  // Admin-only menu items (coach only)
  const adminMenuItems = [
    {
      icon: NAVIGATION_ICONS.testers,
      label: 'Správa testerů',
      onClick: () => handleNavigate('/coach/testers'),
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.primary.light} 100%)`,
    },
  ];

  // Build menu items based on userType
  let menuItems;
  if (userType === 'client') {
    menuItems = clientMenuItems;
  } else {
    menuItems = isAdmin ? [...coachMenuItems, ...adminMenuItems] : coachMenuItems;
  }

  return (
    <>
      {/* Floating Menu Container - NAVIGATION (vedle settings menu zleva) */}
      <Box
        sx={{
          position: 'absolute',
          right: 80,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 1,
          zIndex: 1300,
        }}
      >
        {/* Menu Items */}
        <AnimatePresence>
          {isOpen && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              sx={{
                position: 'absolute',
                top: '100%',
                right: 0,
                mt: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                zIndex: 1300,
              }}
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ pointerEvents: 'auto' }}
                >
                  <QuickTooltip title={item.label} placement="left">
                    <IconButton
                      onClick={item.onClick}
                      sx={{
                        width: 48,
                        height: 48,
                        background: item.gradient,
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: isDark
                          ? 'rgba(139, 188, 143, 0.3)'
                          : 'rgba(255, 255, 255, 0.4)',
                        boxShadow: isDark
                          ? '0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                          : '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
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
                          transform: 'scale(1.1) translateX(-4px)',
                          boxShadow: isDark
                            ? '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                            : '0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                          '&::before': {
                            left: '100%',
                          },
                        },
                      }}
                    >
                      <item.icon size={20} />
                    </IconButton>
                  </QuickTooltip>
                </motion.div>
              ))}
            </Box>
          )}
        </AnimatePresence>

        {/* Main FAB - Logo/Menu Toggle */}
        <QuickTooltip title={isOpen ? 'Zavřít menu' : 'Otevřít navigaci'} placement="left">
          <IconButton
            onClick={handleToggle}
            sx={{
              width: 48,
              height: 48,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backdropFilter: 'blur(20px)',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: isDark
                ? 'rgba(139, 188, 143, 0.3)'
                : 'rgba(255, 255, 255, 0.4)',
              boxShadow: isDark
                ? '0 8px 24px rgba(139, 188, 143, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                : '0 8px 24px rgba(85, 107, 47, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
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
                transform: 'scale(1.15) rotate(-90deg)',
                boxShadow: isDark
                  ? '0 12px 40px rgba(139, 188, 143, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                  : '0 12px 40px rgba(85, 107, 47, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                '&::before': {
                  left: '100%',
                },
              },
              '&:active': {
                transform: 'scale(1.05) rotate(-90deg)',
              },
            }}
          >
            <motion.div
              animate={{ rotate: isOpen ? -90 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isOpen ? (
                <SETTINGS_ICONS.close size={20} />
              ) : (
                <img
                  src="/coachPro-menu.png"
                  alt="CoachPro"
                  style={{
                    width: 24,
                    height: 24,
                    objectFit: 'contain',
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              )}
            </motion.div>
          </IconButton>
        </QuickTooltip>
      </Box>
    </>
  );
};

export default NavigationFloatingMenu;
