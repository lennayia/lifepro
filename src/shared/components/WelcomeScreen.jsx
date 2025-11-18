import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Power, User as UserIcon, Volume2, VolumeX, ArrowRight, Sparkles } from 'lucide-react';
import { fadeIn, fadeInUp, staggerContainer, staggerItem, glow } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useNotification } from '@shared/context/NotificationContext';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import { useTheme } from '@mui/material';
import { getVocative } from '@shared/utils/czechGrammar';
import FlipCard from '@shared/components/cards/FlipCard';
import AnimatedGradient from '@shared/components/effects/AnimatedGradient';
import useSoundFeedback from '@shared/hooks/useSoundFeedback';

/**
 * WelcomeScreen - Universal welcome/dashboard landing page
 *
 * Modular component used by both testers and clients
 * Combines avatar, greeting, optional code entry, stats, and action cards
 *
 * @param {Object} props
 * @param {Object} props.profile - User profile data { displayName, photo_url, ... }
 * @param {Function} props.onLogout - Logout handler
 * @param {string} props.userType - 'tester' | 'client'
 * @param {boolean} props.showCodeEntry - Show code entry section (default: false)
 * @param {Function} props.onCodeSubmit - Handler for code submission (codeData) => void
 * @param {boolean} props.showStats - Show statistics section (default: false)
 * @param {Array} props.stats - Statistics to display [{ label, value, icon }, ...]
 * @param {Array} props.actionCards - Action cards [{ title, subtitle, icon, onClick, gradient }, ...]
 * @param {string} props.welcomeText - Custom welcome text (optional)
 * @param {string} props.subtitle - Subtitle under name (e.g., "Beta tester CoachPro")
 * @param {Function} props.onAvatarClick - Handler for avatar click (navigate to profile)
 * @param {string} props.avatarTooltip - Tooltip for avatar hover (default: "Upravit profil")
 * @param {ReactNode} props.customCodeEntry - Custom code entry UI (overrides default)
 *
 * @created 11.11.2025
 */
const WelcomeScreen = ({
  profile,
  onLogout,
  userType = 'client',
  showCodeEntry = false,
  onCodeSubmit = null,
  showStats = false,
  stats = [],
  actionCards = [],
  welcomeText = null,
  subtitle = null,
  onAvatarClick = null,
  avatarTooltip = 'Upravit profil',
  customCodeEntry = null,
}) => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const theme = useTheme();
  const glassCardStyles = useGlassCard('subtle');

  // Sound feedback
  const { playClick, playFlip, playHover, enabled, setEnabled } = useSoundFeedback({
    volume: 0.3,
    enabled: true,
  });

  // Code entry state
  const [code, setCode] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const defaultWelcomeText = welcomeText || `Vítejte zpátky, ${getVocative(profile?.displayName || '')}!`;

  // Helper function to create softer gradients for large cards
  const createSoftGradient = (color1, color2, angle = 135) => {
    const hexToRgba = (hex, opacity) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    return `linear-gradient(${angle}deg, ${hexToRgba(color1, 0.35)} 0%, ${hexToRgba(color2, 0.25)} 100%)`;
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().trim();
    setCode(value);
  };

  const handleCodeSubmit = async () => {
    if (!onCodeSubmit) return;

    setCodeLoading(true);
    try {
      await onCodeSubmit({ code, previewData });
    } catch (err) {
      showError('Chyba', err.message || 'Nepodařilo se zpracovat kód');
    } finally {
      setCodeLoading(false);
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
        colors={[
          theme.palette.mode === 'dark' ? '#0a0f0a' : '#e8ede5',
          theme.palette.mode === 'dark' ? '#1a2410' : '#d4ddd0',
          theme.palette.mode === 'dark' ? '#0f140a' : '#e0e8dd',
        ]}
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

      {/* Noise texture overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 900, position: 'relative', zIndex: 2 }}
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
          <Box p={4} position="relative">
            {/* Top bar - Logout + Sound toggle */}
            <Box display="flex" justifyContent="space-between" mb={2}>
              <IconButton
                onClick={onLogout}
                onMouseEnter={playHover}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                  },
                }}
              >
                <Power size={20} />
              </IconButton>

              <IconButton
                onClick={() => {
                  setEnabled(!enabled);
                  playClick();
                }}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(139, 188, 143, 0.08)',
                  },
                }}
              >
                {enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </IconButton>
            </Box>

            {/* Welcome Header */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Box
                component={motion.div}
                animate={glow}
                sx={{
                  textAlign: 'center',
                  mb: showCodeEntry || showStats ? 5 : 4,
                  mt: 2,
                  p: 3,
                  borderRadius: BORDER_RADIUS.compact,
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(143, 188, 143, 0.03)'
                      : 'rgba(143, 188, 143, 0.05)',
                }}
              >
                <Avatar
                  src={profile?.photo_url}
                  onClick={onAvatarClick}
                  title={onAvatarClick ? avatarTooltip : undefined}
                  imgProps={{
                    referrerPolicy: 'no-referrer',
                    loading: 'eager'
                  }}
                  sx={{
                    width: 90,
                    height: 90,
                    margin: '0 auto',
                    mb: 2.5,
                    bgcolor: 'primary.main',
                    fontSize: 36,
                    border: '3px solid',
                    borderColor: 'primary.main',
                    cursor: onAvatarClick ? 'pointer' : 'default',
                    transition: 'all 0.3s',
                    '&:hover': onAvatarClick ? {
                      transform: 'scale(1.1)',
                    } : {},
                  }}
                >
                  {!profile?.photo_url && <UserIcon size={44} />}
                </Avatar>
                <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                  <Sparkles size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  {defaultWelcomeText}
                </Typography>
                {subtitle && (
                  <Typography variant="body1" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </motion.div>

            {/* Statistics Section */}
            {showStats && stats.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.15 }}
              >
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Card
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background:
                            theme.palette.mode === 'dark'
                              ? 'rgba(143, 188, 143, 0.05)'
                              : 'rgba(143, 188, 143, 0.1)',
                          borderRadius: BORDER_RADIUS.compact,
                        }}
                      >
                        {stat.icon && (
                          <Box sx={{ mb: 1, color: 'primary.main' }}>{stat.icon}</Box>
                        )}
                        <Typography variant="h5" fontWeight={600}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {stat.label}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}

            {/* Code Entry Section */}
            {(showCodeEntry || customCodeEntry) && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
              >
                {customCodeEntry || (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                      Vstup kódem
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Zadejte 6-místný kód"
                      value={code}
                      onChange={handleCodeChange}
                      disabled={codeLoading}
                      inputProps={{ maxLength: 6 }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: BORDER_RADIUS.compact,
                        },
                      }}
                    />
                    {previewData && (
                      <Alert severity="success" sx={{ mb: 2, borderRadius: BORDER_RADIUS.compact }}>
                        <Typography variant="body2">
                          <strong>{previewData.title}</strong>
                          {previewData.type && ` • ${previewData.type}`}
                          {previewData.coachName && ` • ${previewData.coachName}`}
                        </Typography>
                      </Alert>
                    )}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleCodeSubmit}
                      disabled={code.length !== 6 || codeLoading}
                      sx={{ borderRadius: BORDER_RADIUS.button, py: 1.5 }}
                    >
                      {codeLoading ? <CircularProgress size={24} /> : 'Pokračovat'}
                    </Button>
                  </Box>
                )}
              </motion.div>
            )}

            {/* Action Cards - Now with FlipCards! */}
            {actionCards.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <Grid container spacing={3}>
                  {actionCards.map((card, index) => {
                    // Use NavigationFloatingMenu gradient styles
                    const gradients = [
                      createSoftGradient(theme.palette.primary.main, theme.palette.secondary.main, 135),
                      createSoftGradient(theme.palette.secondary.light, theme.palette.primary.dark, 120),
                      createSoftGradient(theme.palette.primary.light, theme.palette.secondary.dark, 150),
                    ];

                    return (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <FlipCard
                            minHeight={240}
                            gradient={gradients[index % gradients.length]}
                            onFlip={(isFlipped) => {
                              if (isFlipped) playFlip();
                            }}
                            frontContent={
                              <Box
                                p={3}
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                textAlign="center"
                                height="100%"
                              >
                                <Box
                                  sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'rgba(255, 255, 255, 0.4)',
                                    color: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                                    mb: 2,
                                  }}
                                >
                                  {card.icon}
                                </Box>
                                <Typography
                                  variant="h6"
                                  fontWeight={600}
                                  gutterBottom
                                  sx={{
                                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)'
                                  }}
                                >
                                  {card.title}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.7)'
                                  }}
                                >
                                  {card.subtitle}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    mt: 2,
                                    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                                  }}
                                >
                                  Klikni pro více info ↻
                                </Typography>
                              </Box>
                            }
                            backContent={
                              <Box
                                p={3}
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                                height="100%"
                              >
                                <Box>
                                  <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    gutterBottom
                                    sx={{
                                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.85)'
                                    }}
                                  >
                                    {card.backTitle || card.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    mb={2}
                                    sx={{
                                      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.7)'
                                    }}
                                  >
                                    {card.subtitle}
                                  </Typography>
                                </Box>
                                <Box display="flex" justifyContent="center">
                                  <Button
                                    variant="contained"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playClick();
                                      card.onClick();
                                    }}
                                    onMouseEnter={playHover}
                                    endIcon={<ArrowRight size={18} />}
                                    sx={{
                                      mt: 2,
                                      px: 4,
                                      py: 1.5,
                                      borderRadius: BORDER_RADIUS.button,
                                      fontWeight: 600,
                                      textTransform: 'none',
                                      fontSize: '1rem',
                                    }}
                                  >
                                    Přejít
                                  </Button>
                                </Box>
                              </Box>
                            }
                          />
                      </Grid>
                    );
                  })}
                </Grid>
              </motion.div>
            )}
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default WelcomeScreen;
