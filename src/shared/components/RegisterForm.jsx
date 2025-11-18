import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@shared/config/supabase';
import { useNotification } from '@shared/context/NotificationContext';
import GoogleSignInButton from '@shared/components/GoogleSignInButton';
import BORDER_RADIUS from '@styles/borderRadius';

/**
 * Universal registration form for all user types
 *
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback after successful registration
 * @param {string} props.userType - 'tester' | 'coach' | 'client'
 * @param {string} props.redirectTo - Where to redirect after OAuth
 */
const RegisterForm = ({ onSuccess, userType = 'coach', redirectTo = '/coach/dashboard' }) => {
  const { showSuccess, showError } = useNotification();

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate form
  const validateForm = () => {
    if (!firstName.trim()) {
      setError('Vyplň prosím své křestní jméno');
      return false;
    }
    if (!lastName.trim()) {
      setError('Vyplň prosím své příjmení');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Vyplň prosím platný email');
      return false;
    }
    if (!password) {
      setError('Vyplň prosím heslo');
      return false;
    }
    if (password.length < 6) {
      setError('Heslo musí mít alespoň 6 znaků');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Hesla se neshodují');
      return false;
    }
    if (!termsAccepted) {
      setError('Pro pokračování musíš souhlasit s podmínkami');
      return false;
    }
    return true;
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const userEmail = email.trim().toLowerCase();
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      // Create Supabase Auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password: password,
        options: {
          emailRedirectTo: window.location.origin + redirectTo,
          data: {
            full_name: fullName,
            role: userType,
          },
        },
      });

      if (authError) {
        if (authError.message?.includes('already registered')) {
          throw new Error('Tento email je již registrován. Zkus se přihlásit.');
        }
        throw new Error('Nepodařilo se vytvořit účet: ' + authError.message);
      }

      const authUserId = authData.user?.id;
      const authSession = authData.session;

      if (!authUserId) {
        throw new Error('Nepodařilo se vytvořit autentizační účet. Zkus to prosím znovu.');
      }

      // Call success callback (parent component will handle DB insert)
      // IMPORTANT: Keep session active for DB inserts!
      if (onSuccess) {
        await onSuccess({
          authUserId,
          authSession,
          email: userEmail,
          name: fullName,
          phone: phone.trim() || null,
          marketingConsent,
          termsAccepted,
        });
      }

      // Sign out AFTER DB inserts - user must confirm email first
      await supabase.auth.signOut();

      showSuccess(
        'Registrace úspěšná! 📧',
        `Zkontroluj si email (${userEmail}) a potvrď registraci kliknutím na odkaz.`
      );
    } catch (err) {
      setError(err.message || 'Něco se pokazilo. Zkus to prosím znovu.');
      showError('Chyba při registraci', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Google OAuth Sign In */}
      <GoogleSignInButton
        variant="contained"
        redirectTo={redirectTo}
        showDivider={false}
        buttonText="Pokračovat s Google"
        showSuccessToast={false}
        onError={(err, errorMsg) => setError(errorMsg)}
      />

      {/* Divider */}
      <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
        <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
          nebo pomocí emailu
        </Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: BORDER_RADIUS.compact }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Registration Form */}
      <form onSubmit={handleRegister}>
        <TextField
          label="Křestní jméno *"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={loading}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: BORDER_RADIUS.compact,
            },
          }}
        />

        <TextField
          label="Příjmení *"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={loading}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: BORDER_RADIUS.compact,
            },
          }}
        />

        <TextField
          label="Email *"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: BORDER_RADIUS.compact,
            },
          }}
        />

        <TextField
          label="Heslo *"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          helperText="Minimálně 6 znaků"
          inputProps={{ autoComplete: 'new-password' }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: BORDER_RADIUS.compact,
            },
          }}
        />

        <TextField
          label="Potvrď heslo *"
          type="password"
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          inputProps={{ autoComplete: 'new-password' }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: BORDER_RADIUS.compact,
            },
          }}
        />

        <TextField
          label="Telefon (volitelné)"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
          InputLabelProps={{ shrink: true }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: BORDER_RADIUS.compact,
            },
          }}
        />

        {/* GDPR Consent */}
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={loading}
              />
            }
            label={
              <Typography variant="body2">
                Souhlasím se{' '}
                <Link href="/privacy-policy" target="_blank" underline="hover">
                  zpracováním osobních údajů
                </Link>{' '}
                *
              </Typography>
            }
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                disabled={loading}
              />
            }
            label={
              <Typography variant="body2">
                Souhlasím se zasíláním novinek a nabídek (volitelné)
              </Typography>
            }
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
          sx={{
            borderRadius: BORDER_RADIUS.button,
            py: 1.5,
          }}
        >
          {loading ? 'Registruji...' : 'Zaregistrovat se'}
        </Button>
      </form>
    </Box>
  );
};

export default RegisterForm;
