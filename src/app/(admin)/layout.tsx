/**
 * Admin Layout
 * Layout pro admin rozhraní s ochranou přístupu
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  CircularProgress,
} from '@mui/material';
import { useLifeAuth } from '@/shared/context/LifeAuthContext';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading, signOut } = useLifeAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/login');
    }
  }, [user, isAdmin, loading, router]);

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

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LifePro Admin
          </Typography>

          <Button color="inherit" component={Link} href="/admin">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} href="/admin/categories">
            Kategorie
          </Button>
          <Button color="inherit" component={Link} href="/admin/sections">
            Sekce
          </Button>
          <Button color="inherit" component={Link} href="/admin/questions">
            Otázky
          </Button>
          <Button color="inherit" component={Link} href="/dashboard">
            User View
          </Button>
          <Button color="inherit" onClick={signOut}>
            Odhlásit
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
