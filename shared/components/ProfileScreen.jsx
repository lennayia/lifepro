import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  IconButton,
  CircularProgress,
  MenuItem,
  Divider,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ArrowLeft, Save as SaveIcon, Calendar, Shield } from 'lucide-react';
import { fadeIn, fadeInUp } from '@shared/styles/animations';
import BORDER_RADIUS from '@styles/borderRadius';
import { useGlassCard } from '@shared/hooks/useModernEffects';
import PhotoUpload from '@shared/components/PhotoUpload';
import { PHOTO_BUCKETS } from '@shared/utils/photoStorage';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import cs from 'date-fns/locale/cs';
import { format } from 'date-fns';
import { supabase } from '@shared/config/supabase';
import {
  isValidEmail,
  isValidPhone,
  formatPhone,
  formatSocialUrl,
  getFieldError,
} from '@shared/utils/validation';

/**
 * ProfileScreen - Universal profile component
 *
 * Modular profile screen for clients, coaches, and testers
 * Combines PhotoUpload, personal fields, and role-specific info
 *
 * @param {Object} props
 * @param {Object} props.profile - User profile data
 * @param {Object} props.user - Auth user object
 * @param {Function} props.onSave - Save handler (profileData) => Promise<void>
 * @param {Function} props.onBack - Back navigation handler
 * @param {string} props.userType - 'client' | 'coach' | 'tester'
 * @param {string} props.photoBucket - PHOTO_BUCKETS constant
 * @param {boolean} props.showPhotoUpload - Show photo upload (default: true)
 * @param {Array} props.editableFields - Array of editable field names
 * @param {Object} props.metadata - Additional metadata (registration date, version, etc.)
 * @param {ReactNode} props.additionalFields - Additional custom fields
 * @param {boolean} props.loading - Loading state from parent
 *
 * @created 11.11.2025 - Session #15
 */
const ProfileScreen = ({
  profile,
  user,
  onSave,
  onBack,
  userType = 'client',
  photoBucket = PHOTO_BUCKETS.CLIENT_PHOTOS,
  showPhotoUpload = true,
  editableFields = ['name', 'email', 'phone'],
  metadata = {},
  additionalFields = null,
  loading: externalLoading = false,
}) => {
  const glassCardStyles = useGlassCard('subtle');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState(null);

  // Universal profile fields
  const [dateOfBirth, setDateOfBirth] = useState(null);

  // Professional fields (coaches)
  const [education, setEducation] = useState('');
  const [certifications, setCertifications] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [bio, setBio] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');

  // Client-specific fields
  const [currentSituation, setCurrentSituation] = useState('');
  const [goals, setGoals] = useState('');
  const [vision, setVision] = useState('');
  const [healthNotes, setHealthNotes] = useState('');
  const [clientNotes, setClientNotes] = useState('');

  // Social media & contacts (both)
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [website, setWebsite] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telegram, setTelegram] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');
  const [preferredContact, setPreferredContact] = useState('email');
  const [timezone, setTimezone] = useState('Europe/Prague');

  // Relationships
  const [coachInfo, setCoachInfo] = useState(null);
  const [clientsList, setClientsList] = useState([]);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load profile data
  useEffect(() => {
    if (user) {
      // Get name from OAuth (priority)
      const oauthName = user.user_metadata?.full_name || user.user_metadata?.name || '';

      // Pre-fill email from auth
      setEmail(user.email || '');

      if (profile) {
        // Load existing profile
        setName(oauthName || profile.name || '');
        setEmail(profile.email || user.email || '');
        setPhone(profile.phone || '');
        setPhotoUrl(profile.photo_url || null);
        setDateOfBirth(profile.date_of_birth ? new Date(profile.date_of_birth) : null);

        // Professional fields (coaches)
        setEducation(profile.education || '');
        setCertifications(profile.certifications || '');
        setSpecializations(profile.specializations || '');
        setBio(profile.bio || '');
        setYearsOfExperience(profile.years_of_experience || '');

        // Client-specific fields
        setCurrentSituation(profile.current_situation || '');
        setGoals(profile.goals || '');
        setVision(profile.vision || '');
        setHealthNotes(profile.health_notes || '');
        setClientNotes(profile.client_notes || '');

        // Social media & contacts
        setLinkedin(profile.linkedin || '');
        setInstagram(profile.instagram || '');
        setFacebook(profile.facebook || '');
        setWebsite(profile.website || '');
        setWhatsapp(profile.whatsapp || '');
        setTelegram(profile.telegram || '');
        setBookingUrl(profile.booking_url || '');
        setPreferredContact(profile.preferred_contact || 'email');
        setTimezone(profile.timezone || 'Europe/Prague');

        // Load coach info if client
        if (profile.coach_id && metadata.loadCoachInfo) {
          metadata.loadCoachInfo(profile.coach_id).then(setCoachInfo);
        }

        // Load clients list if coach
        if (userType === 'coach' || userType === 'tester') {
          if (metadata.loadClientsList) {
            metadata.loadClientsList().then(setClientsList);
          }
        }
      } else {
        // New user - pre-fill from OAuth
        if (oauthName) {
          setName(oauthName);
        }
      }
    }
  }, [user, profile, userType, metadata]);

  const isFieldEditable = (fieldName) => {
    return editableFields.includes(fieldName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Jméno je povinné');
      return;
    }

    // Validate fields before submit (trim first)
    const emailErr = getFieldError('email', email.trim(), 'email');
    const phoneErr = getFieldError('phone', phone.trim(), 'phone');

    if (emailErr) {
      setEmailError(emailErr);
      setError('Opravte prosím chyby ve formuláři');
      return;
    }

    if (phoneErr) {
      setPhoneError(phoneErr);
      setError('Opravte prosím chyby ve formuláři');
      return;
    }

    setSaving(true);
    setError('');
    setEmailError('');
    setPhoneError('');

    try {
      // Build profile data - all fields
      const profileData = {
        auth_user_id: user.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        photo_url: photoUrl,
        date_of_birth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null,

        // Professional fields (coaches)
        education: education.trim() || null,
        certifications: certifications.trim() || null,
        specializations: specializations.trim() || null,
        bio: bio.trim() || null,
        years_of_experience: yearsOfExperience ? parseInt(yearsOfExperience, 10) : null,

        // Client-specific fields
        current_situation: currentSituation.trim() || null,
        goals: goals.trim() || null,
        vision: vision.trim() || null,
        health_notes: healthNotes.trim() || null,
        client_notes: clientNotes.trim() || null,

        // Social media & contacts
        linkedin: linkedin.trim() || null,
        instagram: instagram.trim() || null,
        facebook: facebook.trim() || null,
        website: website.trim() || null,
        whatsapp: whatsapp.trim() || null,
        telegram: telegram.trim() || null,
        booking_url: bookingUrl.trim() || null,
        preferred_contact: preferredContact,
        timezone: timezone,
      };

      // Handle password change if requested
      if (newPassword && newPassword === confirmPassword) {
        if (!currentPassword) {
          setError('Zadejte prosím aktuální heslo');
          return;
        }

        // Verify current password and update
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passwordError) throw new Error('Nepodařilo se změnit heslo: ' + passwordError.message);
      } else if (newPassword && newPassword !== confirmPassword) {
        setError('Nová hesla se neshodují');
        return;
      }

      // Call parent save handler
      await onSave(profileData);

    } catch (err) {
      console.error('Profile save error:', err);
      const errorMsg = err.message || 'Nepodařilo se uložit profil. Zkuste to prosím znovu.';
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'client':
        return 'Klientka';
      case 'coach':
        return 'Koučka';
      case 'tester':
        return 'Beta tester';
      default:
        return 'Uživatel';
    }
  };

  const getVersionBadge = () => {
    if (userType === 'tester') {
      return (
        <Chip
          label="BETA TESTER"
          size="small"
          icon={<Shield size={14} />}
          sx={{
            fontWeight: 700,
            backgroundColor: '#FF9800',
            color: '#fff',
          }}
        />
      );
    }
    if (metadata.appVersion) {
      return (
        <Chip
          label={`Verze ${metadata.appVersion}`}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? `
              radial-gradient(circle at 20% 20%, rgba(143, 188, 143, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(85, 107, 47, 0.15) 0%, transparent 50%),
              linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)
            `
            : `
              radial-gradient(circle at 20% 20%, rgba(143, 188, 143, 0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(85, 107, 47, 0.3) 0%, transparent 50%),
              linear-gradient(135deg, #e8ede5 0%, #d4ddd0 100%)
            `,
        p: 2,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        },
      }}
    >
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', maxWidth: 700 }}
      >
        <Card
          elevation={0}
          sx={{
            ...glassCardStyles,
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '32px',
          }}
        >
          <Box p={4} position="relative">
            {/* Back arrow - top left */}
            {onBack && (
              <IconButton
                onClick={onBack}
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(139, 188, 143, 0.08)',
                  },
                }}
              >
                <ArrowLeft size={20} />
              </IconButton>
            )}

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, mt: 5 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Header */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
            >
              <Box textAlign="center" mb={4} mt={5}>
                {/* Photo Upload */}
                {showPhotoUpload && (
                  <PhotoUpload
                    photoUrl={photoUrl}
                    googlePhotoUrl={user?.user_metadata?.avatar_url}
                    onPhotoChange={setPhotoUrl}
                    userId={user?.id}
                    bucket={photoBucket}
                    size={120}
                  />
                )}

                <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mt: 3 }}>
                  {userType === 'client' ? 'Váš profil' : 'Můj profil'}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {getUserTypeLabel()}
                </Typography>

                {/* Version Badge */}
                {getVersionBadge()}

                {/* Registration Date */}
                {metadata.registrationDate && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                    mt={2}
                    sx={{ opacity: 0.7 }}
                  >
                    <Calendar size={14} />
                    <Typography variant="caption" color="text.secondary">
                      Registrace: {format(new Date(metadata.registrationDate), 'd. M. yyyy', { locale: cs })}
                    </Typography>
                  </Box>
                )}
              </Box>
            </motion.div>

            {/* Form */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Name */}
                  {isFieldEditable('name') && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Jméno a příjmení"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={saving || externalLoading}
                        inputProps={{
                          autoComplete: 'name',
                        }}
                        InputProps={{
                          sx: { borderRadius: BORDER_RADIUS.compact },
                        }}
                      />
                    </Grid>
                  )}

                  {/* Email */}
                  {isFieldEditable('email') && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError(getFieldError('email', e.target.value, 'email'));
                        }}
                        error={!!emailError}
                        helperText={emailError || undefined}
                        disabled={saving || externalLoading}
                        inputProps={{
                          autoComplete: 'email',
                        }}
                        InputProps={{
                          sx: { borderRadius: BORDER_RADIUS.compact },
                        }}
                      />
                    </Grid>
                  )}

                  {/* Phone */}
                  {isFieldEditable('phone') && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Telefon"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setPhoneError(getFieldError('phone', e.target.value, 'phone'));
                        }}
                        onBlur={() => {
                          // Auto-format on blur
                          if (phone && isValidPhone(phone)) {
                            setPhone(formatPhone(phone));
                          }
                        }}
                        error={!!phoneError}
                        helperText={phoneError || 'Formát: +420 XXX XXX XXX (čísla, může začínat +420)'}
                        disabled={saving || externalLoading}
                        inputProps={{
                          autoComplete: 'tel',
                        }}
                        InputProps={{
                          sx: { borderRadius: BORDER_RADIUS.compact },
                        }}
                      />
                    </Grid>
                  )}

                  {/* Date of Birth */}
                  {isFieldEditable('dateOfBirth') && (
                        <Grid item xs={12} sm={6}>
                          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
                            <DatePicker
                              label="Datum narození"
                              value={dateOfBirth}
                              onChange={(newValue) => setDateOfBirth(newValue)}
                              disabled={saving || externalLoading}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  InputProps: {
                                    sx: { borderRadius: BORDER_RADIUS.compact },
                                  },
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </Grid>
                      )}

                      {/* Professional Fields for Coaches */}
                      {isFieldEditable('education') && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Vzdělání"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                            disabled={saving || externalLoading}
                            placeholder="Koučovací škola, certifikace..."
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {isFieldEditable('certifications') && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Certifikace"
                            value={certifications}
                            onChange={(e) => setCertifications(e.target.value)}
                            disabled={saving || externalLoading}
                            placeholder="ICF, AC, NLP..."
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {isFieldEditable('specializations') && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Specializace"
                            value={specializations}
                            onChange={(e) => setSpecializations(e.target.value)}
                            disabled={saving || externalLoading}
                            placeholder="Life coaching, business coaching, kariérní koučink..."
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {isFieldEditable('yearsOfExperience') && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Roky praxe"
                            value={yearsOfExperience}
                            onChange={(e) => setYearsOfExperience(e.target.value)}
                            disabled={saving || externalLoading}
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {isFieldEditable('bio') && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="O mně"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            disabled={saving || externalLoading}
                            placeholder="Krátké představení pro klienty..."
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {/* Client Goal Fields */}
                      {isFieldEditable('currentSituation') && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Současná situace"
                            value={currentSituation}
                            onChange={(e) => setCurrentSituation(e.target.value)}
                            disabled={saving || externalLoading}
                            placeholder="Co aktuálně potřebujete vyřešit?"
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {/* Goals */}
                      {isFieldEditable('goals') && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Vaše cíle"
                            value={goals}
                            onChange={(e) => setGoals(e.target.value)}
                            disabled={saving || externalLoading}
                            placeholder="Co chcete dosáhnout? Jaké jsou vaše osobní cíle?"
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {/* Vision */}
                      {isFieldEditable('vision') && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Vaše vize"
                            value={vision}
                            onChange={(e) => setVision(e.target.value)}
                            disabled={saving || externalLoading}
                            placeholder="Kam se chcete posunout? Jaká je vaše vize?"
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {/* Health Notes */}
                      {isFieldEditable('healthNotes') && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Zdravotní poznámky"
                            value={healthNotes}
                            onChange={(e) => setHealthNotes(e.target.value)}
                            disabled={saving || externalLoading}
                            placeholder="Informace, které by měla vaše koučka vědět (volitelné)"
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                      </Grid>

                      {/* Preferred Contact Method */}
                      {isFieldEditable('preferredContact') && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            select
                            label="Preferovaný způsob kontaktu"
                            value={preferredContact}
                            onChange={(e) => setPreferredContact(e.target.value)}
                            disabled={saving || externalLoading}
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          >
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="phone">Telefon</MenuItem>
                            <MenuItem value="whatsapp">WhatsApp</MenuItem>
                          </TextField>
                        </Grid>
                      )}

                      {/* Timezone */}
                      {isFieldEditable('timezone') && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            select
                            label="Časová zóna"
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            disabled={saving || externalLoading}
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          >
                            <MenuItem value="Europe/Prague">Praha (CET/CEST)</MenuItem>
                            <MenuItem value="Europe/London">Londýn (GMT/BST)</MenuItem>
                            <MenuItem value="America/New_York">New York (EST/EDT)</MenuItem>
                            <MenuItem value="America/Los_Angeles">Los Angeles (PST/PDT)</MenuItem>
                            <MenuItem value="Asia/Tokyo">Tokio (JST)</MenuItem>
                          </TextField>
                        </Grid>
                      )}

                      {/* Client Notes */}
                      {isFieldEditable('clientNotes') && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Moje poznámky"
                            value={clientNotes}
                            onChange={(e) => setClientNotes(e.target.value)}
                            disabled={saving || externalLoading}
                            placeholder="Soukromé poznámky (vidíte pouze vy)"
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {/* Social Media & Contacts Section */}
                      {(isFieldEditable('linkedin') || isFieldEditable('instagram') ||
                        isFieldEditable('facebook') || isFieldEditable('website') ||
                        isFieldEditable('whatsapp') || isFieldEditable('telegram')) && (
                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Kontakty a sociální sítě
                            </Typography>
                          </Divider>
                        </Grid>
                      )}

                      {isFieldEditable('linkedin') && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="LinkedIn"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            onBlur={() => {
                              if (linkedin && !linkedin.startsWith('http')) {
                                setLinkedin(formatSocialUrl(linkedin, 'linkedin'));
                              }
                            }}
                            disabled={saving || externalLoading}
                            placeholder="username"
                            helperText="Automaticky přidáno: https://linkedin.com/in/"
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {isFieldEditable('instagram') && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Instagram"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                            onBlur={() => {
                              if (instagram && !instagram.startsWith('http')) {
                                setInstagram(formatSocialUrl(instagram, 'instagram'));
                              }
                            }}
                            disabled={saving || externalLoading}
                            placeholder="username"
                            helperText="Automaticky přidáno: https://instagram.com/"
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {isFieldEditable('facebook') && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Facebook"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                            onBlur={() => {
                              if (facebook && !facebook.startsWith('http')) {
                                setFacebook(formatSocialUrl(facebook, 'facebook'));
                              }
                            }}
                            disabled={saving || externalLoading}
                            placeholder="username"
                            helperText="Automaticky přidáno: https://facebook.com/"
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {isFieldEditable('website') && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Webové stránky"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            onBlur={() => {
                              if (website && !website.startsWith('http')) {
                                setWebsite(formatSocialUrl(website, 'website'));
                              }
                            }}
                            disabled={saving || externalLoading}
                            placeholder="example.com"
                            helperText="Automaticky přidáno: https://"
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {isFieldEditable('whatsapp') && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="WhatsApp"
                            value={whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            onBlur={() => {
                              if (whatsapp && isValidPhone(whatsapp)) {
                                setWhatsapp(formatPhone(whatsapp));
                              }
                            }}
                            disabled={saving || externalLoading}
                            placeholder="+420 XXX XXX XXX"
                            helperText="Stejný formát jako telefon"
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {isFieldEditable('telegram') && (
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Telegram"
                            value={telegram}
                            onChange={(e) => setTelegram(e.target.value)}
                            onBlur={() => {
                              if (telegram && !telegram.startsWith('http')) {
                                setTelegram(formatSocialUrl(telegram, 'telegram'));
                              }
                            }}
                            disabled={saving || externalLoading}
                            placeholder="username"
                            helperText="Automaticky přidáno: https://t.me/"
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {isFieldEditable('booking_url') && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Booking URL (Calendly, Cal.com, ...)"
                            value={bookingUrl}
                            onChange={(e) => setBookingUrl(e.target.value)}
                            disabled={saving || externalLoading}
                            placeholder="https://calendly.com/vase-jmeno"
                            helperText="Odkaz na váš booking systém - klientky se mohou samy rezervovat sezení"
                            InputProps={{
                              sx: { borderRadius: BORDER_RADIUS.compact },
                            }}
                          />
                        </Grid>
                      )}

                      {/* Password Change Section */}
                      {user?.email && (
                        <>
                          <Grid item xs={12}>
                            <Divider sx={{ my: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Změna hesla
                              </Typography>
                            </Divider>
                          </Grid>

                          <Grid item xs={12}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                              Vyplňte pouze pokud chcete změnit heslo. Jinak pole nechte prázdná.
                            </Alert>
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              type="password"
                              label="Aktuální heslo"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              disabled={saving || externalLoading}
                              autoComplete="current-password"
                              InputProps={{
                                sx: { borderRadius: BORDER_RADIUS.compact },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              type="password"
                              label="Nové heslo"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              disabled={saving || externalLoading}
                              autoComplete="new-password"
                              InputProps={{
                                sx: { borderRadius: BORDER_RADIUS.compact },
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              type="password"
                              label="Potvrzení nového hesla"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              disabled={saving || externalLoading}
                              autoComplete="new-password"
                              error={newPassword && confirmPassword && newPassword !== confirmPassword}
                              helperText={
                                newPassword && confirmPassword && newPassword !== confirmPassword
                                  ? 'Hesla se neshodují'
                                  : ''
                              }
                              InputProps={{
                                sx: { borderRadius: BORDER_RADIUS.compact },
                              }}
                            />
                          </Grid>
                        </>
                      )}

                      {/* Coach Info (if assigned) */}
                      {coachInfo && (
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              p: 3,
                              borderRadius: BORDER_RADIUS.compact,
                              border: '1px solid',
                              borderColor: 'divider',
                              bgcolor: (theme) =>
                                theme.palette.mode === 'dark'
                                  ? 'rgba(139, 188, 143, 0.05)'
                                  : 'rgba(85, 107, 47, 0.03)',
                            }}
                          >
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              Vaše koučka
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              <strong>Jméno:</strong> {coachInfo.name}
                            </Typography>
                            {coachInfo.email && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Email:</strong> {coachInfo.email}
                              </Typography>
                            )}
                            {coachInfo.phone && (
                              <Typography variant="body2" color="text.secondary">
                                <strong>Telefon:</strong> {coachInfo.phone}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      )}

                  {/* Additional custom fields */}
                  {additionalFields && (
                    <Grid item xs={12}>
                      {additionalFields}
                    </Grid>
                  )}

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" mt={2}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={saving || externalLoading}
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon size={20} />}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: BORDER_RADIUS.compact,
                        }}
                      >
                        {saving ? 'Ukládám...' : 'Uložit profil'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </motion.div>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default ProfileScreen;
