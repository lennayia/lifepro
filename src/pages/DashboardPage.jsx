import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, CircularProgress } from '@mui/material';
import { BookOpen, TrendingUp, User, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useNotification } from '@shared/context/NotificationContext';
import WelcomeScreen from '@shared/components/WelcomeScreen';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      // Pro teď použijeme data z auth
      setProfile({
        displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Uživatel',
        photo_url: user.user_metadata?.avatar_url || null,
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      showError('Chyba', 'Nepodařilo se načíst profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const actionCards = [
    {
      title: 'Dotazník',
      subtitle: 'Vyplňte dotazník a objevte své hodnoty',
      icon: <BookOpen size={32} />,
      onClick: () => navigate('/questionnaire'),
      backTitle: 'Začít vyplňovat',
    },
    {
      title: 'Výsledky',
      subtitle: 'Zobrazit AI analýzu vašich odpovědí',
      icon: <TrendingUp size={32} />,
      onClick: () => navigate('/results'),
      backTitle: 'Zobrazit výsledky',
    },
    {
      title: 'Profil',
      subtitle: 'Upravit osobní údaje a nastavení',
      icon: <User size={32} />,
      onClick: () => navigate('/profile'),
      backTitle: 'Upravit profil',
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <WelcomeScreen
      profile={profile}
      onLogout={handleLogout}
      userType="client"
      actionCards={actionCards}
      welcomeText="Vítejte zpátky"
      subtitle="LifePro - Objevte své životní poslání"
      onAvatarClick={() => navigate('/profile')}
    />
  );
};

export default DashboardPage;
