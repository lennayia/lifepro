import { useState } from 'react';
import { Box, IconButton, Dialog, DialogContent, DialogActions, Button, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../../App';
import { getCurrentUser } from '../../modules/coach/utils/storage';
import QuickTooltip from './AppTooltip';
import BetaInfoContent from './BetaInfoContent';
import HelpDialog from './HelpDialog';
import { FULL_BETA_INFO } from '../constants/betaInfo';
import { createBackdrop, createGlassDialog } from '../styles/modernEffects';
import BORDER_RADIUS from '@styles/borderRadius';
import { SETTINGS_ICONS } from '../constants/icons';

/**
 * FloatingMenu - Plovoucí menu v pravém horním rohu
 *
 * Inspirováno PaymentsPro designem
 * Defaultně zavřené, otevírá se kliknutím na Settings ikonu
 * Univerzální pro coach i client
 *
 * @created 4.11.2025
 * @updated 10.11.2025 - Modulární s userType prop
 */
const FloatingMenu = ({ isOpen = false, onToggle, userType = 'coach', logoutHandler = null }) => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const currentUser = getCurrentUser();

  const [betaDialogOpen, setBetaDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const handleToggle = () => {
    const newState = !isOpen;
    onToggle?.(newState);
  };

  const handleProfile = () => {
    onToggle?.(false);
    const profilePath = userType === 'client' ? '/client/profile' : '/coach/profile';
    navigate(profilePath);
  };

  const handleWelcome = () => {
    onToggle?.(false);
    const welcomePath = userType === 'client' ? '/client/welcome' : '/tester/welcome';
    navigate(welcomePath);
  };

  const handleThemeToggle = () => {
    toggleTheme();
    // Menu zůstává otevřené pro další akce
  };

  const handleBetaInfo = () => {
    onToggle?.(false);
    setBetaDialogOpen(true);
  };

  const handleHelp = () => {
    onToggle?.(false);
    setHelpDialogOpen(true);
  };

  const handleLogout = async () => {
    onToggle?.(false);

    // Use custom logout handler if provided (for client with ClientAuthContext)
    if (logoutHandler) {
      await logoutHandler();
    } else {
      // Default coach logout
      sessionStorage.removeItem('coachpro_currentUser');
      localStorage.clear();
    }

    navigate('/');
  };

  // Menu items configuration - Mix primary & secondary jako u hlavní FAB!
  const baseMenuItems = [
    {
      icon: SETTINGS_ICONS.profile,
      label: userType === 'client' ? 'Můj profil' : 'Profil',
      onClick: handleProfile,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    },
    {
      icon: mode === 'dark' ? SETTINGS_ICONS.lightMode : SETTINGS_ICONS.darkMode,
      label: mode === 'dark' ? 'Světlý režim' : 'Tmavý režim',
      onClick: handleThemeToggle,
      gradient: `linear-gradient(120deg, ${theme.palette.secondary.light} 0%, ${theme.palette.primary.dark} 100%)`,
    },
  ];

  // Tester-specific welcome page
  const testerWelcomeItem = currentUser?.isTester ? {
    icon: SETTINGS_ICONS.welcome,
    label: 'Rozcestník',
    onClick: handleWelcome,
    gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.light} 100%)`,
  } : null;

  // Coach-specific items
  const coachItems = [
    {
      icon: SETTINGS_ICONS.betaInfo,
      label: 'Beta Info',
      onClick: handleBetaInfo,
      gradient: `linear-gradient(150deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.dark} 100%)`,
    },
    {
      icon: SETTINGS_ICONS.help,
      label: 'Nápověda',
      onClick: handleHelp,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
    },
  ];

  // Client-specific items
  const clientItems = [
    {
      icon: SETTINGS_ICONS.welcome,
      label: 'Rozcestník',
      onClick: handleWelcome,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.light} 100%)`,
    },
    {
      icon: SETTINGS_ICONS.help,
      label: 'Nápověda',
      onClick: () => {
        onToggle?.(false);
        navigate('/client/help');
      },
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
    },
  ];

  const logoutItem = {
    icon: SETTINGS_ICONS.logout,
    label: 'Odhlásit se',
    onClick: handleLogout,
    gradient: `linear-gradient(120deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.light} 100%)`,
  };

  // Build menu items based on userType
  const menuItems = userType === 'coach'
    ? [...baseMenuItems, ...(testerWelcomeItem ? [testerWelcomeItem] : []), ...coachItems, logoutItem]
    : [...baseMenuItems, ...clientItems, logoutItem];

  return (
    <>
      {/* Floating Menu Container */}
      <Box
        sx={{
          position: 'absolute',
          right: 16,
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

        {/* Main FAB - Settings Toggle - Ultramoderní design s primary-secondary gradientem */}
        <QuickTooltip title={isOpen ? 'Zavřít menu' : 'Otevřít nastavení'} placement="left">
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
                transform: 'scale(1.15) rotate(90deg)',
                boxShadow: isDark
                  ? '0 12px 40px rgba(139, 188, 143, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
                  : '0 12px 40px rgba(85, 107, 47, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                '&::before': {
                  left: '100%',
                },
              },
              '&:active': {
                transform: 'scale(1.05) rotate(90deg)',
              },
            }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <SETTINGS_ICONS.close size={20} /> : <SETTINGS_ICONS.settings size={20} />}
            </motion.div>
          </IconButton>
        </QuickTooltip>
      </Box>

      {/* Beta Info Dialog */}
      <Dialog
        open={betaDialogOpen}
        onClose={() => setBetaDialogOpen(false)}
        maxWidth="md"
        fullWidth
        BackdropProps={{ sx: createBackdrop() }}
        PaperProps={{ sx: createGlassDialog(isDark, BORDER_RADIUS.dialog) }}
      >
        <DialogContent sx={{ py: 4, px: 4 }}>
          <BetaInfoContent variant="full" data={FULL_BETA_INFO} />
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3 }}>
          <Button
            onClick={() => setBetaDialogOpen(false)}
            variant="contained"
            sx={{
              px: 4,
              py: 1,
              borderRadius: BORDER_RADIUS.compact,
              fontWeight: 600,
              textTransform: 'none',
              background: isDark
                ? 'linear-gradient(135deg, rgba(139, 188, 143, 0.95) 0%, rgba(85, 107, 47, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(85, 107, 47, 0.95) 0%, rgba(139, 188, 143, 0.9) 100%)',
              boxShadow: '0 4px 12px rgba(85, 107, 47, 0.3)',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(85, 107, 47, 0.4)',
              },
            }}
          >
            Rozumím ✓
          </Button>
        </DialogActions>
      </Dialog>

      {/* Help Dialog */}
      <HelpDialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        initialPage="general"
      />
    </>
  );
};

export default FloatingMenu;
