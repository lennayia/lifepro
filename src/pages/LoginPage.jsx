import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useNotification } from '@shared/context/NotificationContext';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@shared/styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import AnimatedGradient from '@shared/components/effects/AnimatedGradient';

const LoginPage = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const glassCardStyles = useGlassCard('subtle');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      showSuccess('Úspěch', 'Přihlášení proběhlo úspěšně');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.message || 'Přihlášení se nezdařilo';
      setError(errorMsg);
      showError('Chyba', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
      }}
    >
      {/* Animated Background */}
      <AnimatedGradient
        colors={['#e8ede5', '#d4ddd0', '#e0e8dd']}
        animation="wave"
        duration={8}
        opacity={1}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 450, position: 'relative', zIndex: 2 }}
      >
        <Card
          elevation={0}
          sx={{
            ...glassCardStyles,
            width: '100%',
            position: 'relative',
            overflow: 'visible',
            borderRadius: '32px',
          }}
        >
          <Box p={4}>
            {/* Header */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Box textAlign="center" mb={4}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                  LifePro
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Přihlaste se do své aplikace
                </Typography>
              </Box>
            </motion.div>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: BORDER_RADIUS.compact,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Heslo"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: BORDER_RADIUS.compact,
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <LogIn size={20} />}
                  sx={{
                    py: 1.5,
                    borderRadius: BORDER_RADIUS.button,
                    mb: 2,
                  }}
                >
                  {loading ? 'Přihlašuji...' : 'Přihlásit se'}
                </Button>

                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Nemáte účet?{' '}
                    <MuiLink
                      component="button"
                      type="button"
                      onClick={() => navigate('/register')}
                      sx={{ cursor: 'pointer' }}
                    >
                      Zaregistrujte se
                    </MuiLink>
                  </Typography>
                </Box>
              </form>
            </motion.div>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
