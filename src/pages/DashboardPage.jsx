import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, CircularProgress, Card, LinearProgress, Chip } from '@mui/material';
import { BookOpen, TrendingUp, User, Settings, Heart, Target, CheckCircle, HelpCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useNotification } from '@shared/context/NotificationContext';
import WelcomeScreen from '@shared/components/WelcomeScreen';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchQuickStats = async (currentUser) => {
    try {
      // Načti počet otázek celkem
      const { count: totalQuestions } = await supabase
        .from('lifepro_questions')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Načti odpovědi uživatele
      const { data: responses } = await supabase
        .from('lifepro_user_responses')
        .select('question_id, answer_multiple, is_favorite')
        .eq('user_id', currentUser.id);

      const answeredCount = responses?.filter(
        r => r.answer_multiple && r.answer_multiple.length > 0
      ).length || 0;

      const favoritesCount = responses?.filter(r => r.is_favorite).length || 0;

      const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

      setStats({
        totalQuestions: totalQuestions || 0,
        answeredQuestions: answeredCount,
        favorites: favoritesCount,
        progress: Math.round(progress),
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

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

      // Načti quick stats
      await fetchQuickStats(user);
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
    {
      title: 'Nápověda',
      subtitle: 'FAQ a návody k použití aplikace',
      icon: <HelpCircle size={32} />,
      onClick: () => navigate('/help'),
      backTitle: 'Zobrazit nápovědu',
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
    <Box>
      <WelcomeScreen
        profile={profile}
        onLogout={handleLogout}
        userType="client"
        actionCards={actionCards}
        welcomeText="Vítejte zpátky"
        subtitle="LifePro - Objevte své životní poslání"
        onAvatarClick={() => navigate('/profile')}
      />

      {/* Quick Stats Section */}
      {stats && (
        <Container maxWidth="lg" sx={{ mt: -8, mb: 4, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, textAlign: 'center', boxShadow: 3 }}>
                <Target size={28} style={{ marginBottom: 8, color: '#1976d2' }} />
                <Typography variant="h5" fontWeight={700}>
                  {stats.progress}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Celkový pokrok
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, textAlign: 'center', boxShadow: 3 }}>
                <CheckCircle size={28} style={{ marginBottom: 8, color: '#2e7d32' }} />
                <Typography variant="h5" fontWeight={700}>
                  {stats.answeredQuestions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Zodpovězeno
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, textAlign: 'center', boxShadow: 3 }}>
                <Heart size={28} style={{ marginBottom: 8, color: '#d32f2f' }} />
                <Typography variant="h5" fontWeight={700}>
                  {stats.favorites}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Oblíbených
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ p: 3, textAlign: 'center', boxShadow: 3 }}>
                <BookOpen size={28} style={{ marginBottom: 8, color: '#ed6c02' }} />
                <Typography variant="h5" fontWeight={700}>
                  {stats.totalQuestions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Celkem otázek
                </Typography>
              </Card>
            </Grid>

            {/* Progress Bar */}
            <Grid item xs={12}>
              <Card sx={{ p: 3, boxShadow: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="h6">
                    Váš pokrok
                  </Typography>
                  <Chip
                    label={stats.progress === 100 ? 'Dokončeno!' : `${stats.answeredQuestions}/${stats.totalQuestions}`}
                    color={stats.progress === 100 ? 'success' : 'primary'}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={stats.progress}
                  sx={{ height: 10, borderRadius: 1 }}
                  color={stats.progress === 100 ? 'success' : 'primary'}
                />
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default DashboardPage;
