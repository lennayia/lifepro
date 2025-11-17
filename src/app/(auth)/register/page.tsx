/**
 * Register Page
 * Registrace s emailem/heslem nebo Google
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

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp, signInWithGoogle } = useLifeAuth();

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Validace
    if (password !== passwordConfirm) {
      setError('Hesla se neshodují');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Heslo musí mít alespoň 6 znaků');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, {
        full_name: name,
      });

      if (error) {
        setError(error.message || 'Chyba při registraci');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Redirect po 2 sekundách
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Něco se pokazilo');
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setLoading(true);

    try {
      const { error } = await signInWithGoogle();

      if (error) {
        setError(error.message || 'Chyba při registraci přes Google');
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
          Registrace
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 3 }}
        >
          Začněte svou cestu k životnímu poslání
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registrace proběhla úspěšně! Přesměrováváme vás...
          </Alert>
        )}

        <Box component="form" onSubmit={handleEmailRegister}>
          <TextField
            fullWidth
            label="Jméno"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
            disabled={loading || success}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
            disabled={loading || success}
          />

          <TextField
            fullWidth
            label="Heslo"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helperText="Minimálně 6 znaků"
            sx={{ mb: 2 }}
            disabled={loading || success}
          />

          <TextField
            fullWidth
            label="Potvrzení hesla"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            sx={{ mb: 3 }}
            disabled={loading || success}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || success}
            sx={{ mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Zaregistrovat se'}
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>nebo</Divider>

        <Button
          variant="outlined"
          onClick={handleGoogleRegister}
          disabled={loading || success}
          fullWidth
        >
          Registrovat se přes Google
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Už máte účet?{' '}
            <Link href="/login" style={{ color: 'inherit', fontWeight: 600 }}>
              Přihlaste se
            </Link>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
