/**
 * User Layout
 * Layout pro přihlášené uživatele s navigací
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Container } from '@mui/material';
import { useLifeAuth } from '@/shared/context/LifeAuthContext';
import { NavigationFloatingMenu } from '@/shared';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useLifeAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        {children}
      </Container>

      {/* Floating Navigation Menu */}
      <NavigationFloatingMenu />
    </Box>
  );
}
