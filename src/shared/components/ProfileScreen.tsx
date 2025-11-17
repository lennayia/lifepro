/**
 * ProfileScreen Component
 * Zobrazení a editace uživatelského profilu
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { User, Mail, Save, Camera } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLifeAuth } from '@/shared/context/LifeAuthContext';

interface ProfileData {
  full_name?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
}

const ProfileScreen: React.FC = () => {
  const { user } = useLifeAuth();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    phone: '',
    bio: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      // V budoucnu můžeme mít vlastní profiles tabulku
      // Pro teď používáme metadata z auth.users
      setProfile({
        full_name: user?.user_metadata?.full_name || '',
        phone: user?.phone || '',
        bio: user?.user_metadata?.bio || '',
        avatar_url: user?.user_metadata?.avatar_url || '',
      });
    } catch (error: any) {
      console.error('Error loading profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
        },
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Můj profil
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Upravte své osobní informace
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profil byl úspěšně uložen!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Avatar a základní info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 4,
              }}
            >
              <Avatar
                src={profile.avatar_url}
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  fontSize: '2.5rem',
                  bgcolor: 'primary.main',
                }}
              >
                {getInitials(profile.full_name)}
              </Avatar>

              <Typography variant="h6" gutterBottom>
                {profile.full_name || 'Uživatel'}
              </Typography>

              <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                <Mail size={16} />
                <Typography variant="body2">{user?.email}</Typography>
              </Box>

              <Button
                variant="outlined"
                startIcon={<Camera size={18} />}
                sx={{ mt: 3 }}
                disabled
              >
                Změnit foto
              </Button>
              <Typography variant="caption" color="text.secondary" mt={1}>
                Připravujeme...
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Formulář */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Osobní údaje
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <TextField
                  fullWidth
                  label="Celé jméno"
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: <User size={20} style={{ marginRight: 8, color: '#999' }} />,
                  }}
                />

                <TextField
                  fullWidth
                  label="Telefon"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  sx={{ mb: 3 }}
                  placeholder="+420 XXX XXX XXX"
                  disabled
                  helperText="Změna telefonu zatím není dostupná"
                />

                <TextField
                  fullWidth
                  label="O mně"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  multiline
                  rows={4}
                  sx={{ mb: 3 }}
                  placeholder="Napište něco o sobě..."
                />

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Přihlašovací údaje
                </Typography>

                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email}
                  disabled
                  sx={{ mb: 3 }}
                  helperText="Email nelze změnit"
                  InputProps={{
                    startAdornment: <Mail size={20} style={{ marginRight: 8, color: '#999' }} />,
                  }}
                />

                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={loadProfile}
                    disabled={saving}
                  >
                    Zrušit změny
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={16} /> : <Save size={18} />}
                    disabled={saving}
                  >
                    {saving ? 'Ukládám...' : 'Uložit změny'}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileScreen;
