/**
 * NavigationFloatingMenu Component
 * Plovoucí navigační menu pro user layout
 */

'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Home,
  FileText,
  Brain,
  User,
  LogOut,
  Menu,
} from 'lucide-react';
import { useLifeAuth } from '@/shared/context/LifeAuthContext';

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    icon: <Home size={20} />,
    path: '/dashboard',
  },
  {
    name: 'Dotazník',
    icon: <FileText size={20} />,
    path: '/questionnaire',
  },
  {
    name: 'Výsledky',
    icon: <Brain size={20} />,
    path: '/results',
  },
  {
    name: 'Profil',
    icon: <User size={20} />,
    path: '/profile',
  },
];

const NavigationFloatingMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { signOut } = useLifeAuth();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    handleClose();
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
    handleClose();
  };

  // Zobrazit pouze na mobilních zařízeních
  if (!isMobile) {
    return null;
  }

  return (
    <SpeedDial
      ariaLabel="Navigation menu"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        '& .MuiSpeedDial-fab': {
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        },
      }}
      icon={<SpeedDialIcon icon={<Menu size={24} />} />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {navigationItems.map((item) => (
        <SpeedDialAction
          key={item.name}
          icon={item.icon}
          tooltipTitle={item.name}
          onClick={() => handleNavigation(item.path)}
          sx={{
            backgroundColor:
              pathname === item.path ? 'primary.light' : 'background.paper',
          }}
        />
      ))}
      <SpeedDialAction
        icon={<LogOut size={20} />}
        tooltipTitle="Odhlásit se"
        onClick={handleLogout}
        sx={{ backgroundColor: 'error.light' }}
      />
    </SpeedDial>
  );
};

export default NavigationFloatingMenu;
