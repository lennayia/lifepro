/**
 * Login Page
 * Přihlášení s emailem/heslem nebo Google
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useLifeAuth } from '@/shared/context/LifeAuthContext';
import GoogleSignInButton from '@/shared/components/GoogleSignInButton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, signInWithGoogle } = useLifeAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message || 'Chyba při přihlášení');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Něco se pokazilo');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const { error } = await signInWithGoogle();

      if (error) {
        setError(error.message || 'Chyba při přihlášení přes Google');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Něco se pokazilo');
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 450,
        width: '100%',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Přihlášení
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Najděte své životní poslání
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleEmailLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Heslo"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Přihlásit se'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>nebo</Divider>

        <GoogleSignInButton
          onClick={handleGoogleLogin}
          disabled={loading}
          fullWidth
        >
          Přihlásit se přes Google
        </GoogleSignInButton>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Ještě nemáte účet?{' '}
            <Link
              href="/register"
              style={{ color: 'inherit', fontWeight: 600 }}
            >
              Zaregistrujte se
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
