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
import { UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useNotification } from '@shared/context/NotificationContext';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@shared/styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import AnimatedGradient from '@shared/components/effects/AnimatedGradient';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();
  const glassCardStyles = useGlassCard('subtle');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      showSuccess('Úspěch', 'Registrace proběhla úspěšně. Zkontrolujte email pro potvrzení.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = err.message || 'Registrace se nezdařila';
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
                  Registrace
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Vytvořte si účet a objevte své životní poslání
                </Typography>
              </Box>
            </motion.div>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Register Form */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleRegister}>
                <TextField
                  fullWidth
                  label="Celé jméno"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  helperText="Minimálně 6 znaků"
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: BORDER_RADIUS.compact,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Potvrzení hesla"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  startIcon={loading ? <CircularProgress size={20} /> : <UserPlus size={20} />}
                  sx={{
                    py: 1.5,
                    borderRadius: BORDER_RADIUS.button,
                    mb: 2,
                  }}
                >
                  {loading ? 'Registruji...' : 'Zaregistrovat se'}
                </Button>

                <Box textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Už máte účet?{' '}
                    <MuiLink
                      component="button"
                      type="button"
                      onClick={() => navigate('/login')}
                      sx={{ cursor: 'pointer' }}
                    >
                      Přihlaste se
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

export default RegisterPage;
