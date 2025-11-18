import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import { PAGE_PADDING } from '../styles/responsive';

const Layout = ({ children, userType = 'coach', logoutHandler = null }) => {
  const [floatingMenuOpen, setFloatingMenuOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Glassmorphism Backdrop - Blur + kouřový efekt when FloatingMenu is open */}
      <AnimatePresence>
        {floatingMenuOpen && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? `radial-gradient(circle at 85% 15%, rgba(139, 188, 143, 0.08) 0%, transparent 50%),
                     radial-gradient(circle at 90% 50%, rgba(188, 143, 143, 0.06) 0%, transparent 50%),
                     rgba(0, 0, 0, 0.3)`
                  : `radial-gradient(circle at 85% 15%, rgba(139, 188, 143, 0.12) 0%, transparent 50%),
                     radial-gradient(circle at 90% 50%, rgba(188, 143, 143, 0.08) 0%, transparent 50%),
                     rgba(255, 255, 255, 0.2)`,
              zIndex: 1200,
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      <Header
        onFloatingMenuToggle={setFloatingMenuOpen}
        userType={userType}
        logoutHandler={logoutHandler}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...PAGE_PADDING,
          minHeight: '100vh',
          position: 'relative',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `
                radial-gradient(circle at 20% 20%, rgba(143, 188, 143, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(85, 107, 47, 0.15) 0%, transparent 50%),
                linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)
              `
              : `
                radial-gradient(circle at 20% 20%, rgba(143, 188, 143, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(85, 107, 47, 0.3) 0%, transparent 50%),
                linear-gradient(135deg, #e8ede5 0%, #d4ddd0 100%)
              `,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
          },
        }}
      >
        {/* Toolbar spacer */}
        <Toolbar />

        {/* Page content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumbs navigation */}
          <Breadcrumbs />

          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
