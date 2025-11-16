import { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { supabase } from '@shared/config/supabase';
import { useNotification } from '@shared/context/NotificationContext';
import BORDER_RADIUS from '@styles/borderRadius';

/**
 * Modular Google OAuth Sign In Button
 *
 * @param {Object} props
 * @param {string} props.variant - 'contained' (filled) or 'outlined' (border only)
 * @param {string} props.redirectTo - Where to redirect after successful OAuth
 * @param {boolean} props.showDivider - Show "nebo" divider above button
 * @param {string} props.buttonText - Custom button text (default: "Přihlásit se přes Google")
 * @param {boolean} props.showSuccessToast - Show success notification (default: false)
 * @param {function} props.onError - Custom error handler (optional)
 */
const GoogleSignInButton = ({
  variant = 'outlined',
  redirectTo = '/',  // Changed: Always redirect to root, RootRedirect handles routing
  showDivider = false,
  buttonText = 'Přihlásit se přes Google',
  showSuccessToast = false,
  onError,
}) => {
  const { showError, showSuccess } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      // Extract intent from redirectTo and store in localStorage as fallback
      // (Google OAuth may not preserve query params in production)
      const urlParams = new URLSearchParams(redirectTo.split('?')[1]);
      const intent = urlParams.get('intent');
      if (intent) {
        localStorage.setItem('oauth_intent', intent);
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`,
          queryParams: {
            prompt: 'select_account',  // Force account picker (allow logout/switch accounts)
            access_type: 'offline',     // Get refresh token for long-term access
          },
          scopes: 'email profile https://www.googleapis.com/auth/calendar.readonly',  // Request Calendar API access
        },
      });

      if (error) throw error;

      if (showSuccessToast) {
        showSuccess('Přesměrování', 'Přesměrovávám vás na Google přihlášení...');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      const errorMsg = 'Nepodařilo se přihlásit přes Google. Zkuste to prosím znovu.';

      if (onError) {
        onError(err, errorMsg);
      } else {
        showError('Chyba přihlášení', errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Styling based on variant
  const getButtonStyles = () => {
    if (variant === 'contained') {
      return {
        px: 4,
        py: 1.5,
        backgroundColor: '#4285F4',
        color: '#ffffff',
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 500,
        borderRadius: BORDER_RADIUS.compact,
        '&:hover': {
          backgroundColor: '#357ae8',
          boxShadow: '0 8px 24px rgba(66, 133, 244, 0.4)',
        },
        '&:disabled': {
          backgroundColor: 'rgba(66, 133, 244, 0.6)',
          color: 'rgba(255, 255, 255, 0.7)',
        },
      };
    } else {
      // outlined variant
      return {
        px: 3,
        py: 1.5,
        borderColor: '#4285F4',
        color: '#4285F4',
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 500,
        borderRadius: BORDER_RADIUS.compact,
        '&:hover': {
          borderColor: '#357ae8',
          bgcolor: 'rgba(66, 133, 244, 0.08)',
        },
        '&:disabled': {
          borderColor: 'rgba(66, 133, 244, 0.4)',
          color: 'rgba(66, 133, 244, 0.4)',
        },
      };
    }
  };

  return (
    <>
      {/* Optional Divider */}
      {showDivider && (
        <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
          <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
            nebo
          </Typography>
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
        </Box>
      )}

      {/* Centered Button */}
      <Box display="flex" justifyContent="center">
        <Button
          variant={variant}
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
          onClick={handleGoogleSignIn}
          disabled={loading}
          sx={getButtonStyles()}
        >
          {loading ? 'Přihlašuji...' : buttonText}
        </Button>
      </Box>
    </>
  );
};

export default GoogleSignInButton;
