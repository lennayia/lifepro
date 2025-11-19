import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  CircularProgress,
  Grid,
  Chip,
  LinearProgress,
  Divider,
  Stack,
} from '@mui/material';
import { ArrowLeft, Heart, CheckCircle, TrendingUp, Target, FileDown } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useNotification } from '@shared/context/NotificationContext';
import { downloadPDFReport } from '@/utils/pdfExport';
import CategoryRadarChart from '@/components/visualizations/CategoryRadarChart';
import CategoryBarChart from '@/components/visualizations/CategoryBarChart';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { showError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalCategories: 0,
    completedCategories: 0,
    totalQuestions: 0,
    answeredQuestions: 0,
    favoriteCount: 0,
  });
  const [categoryStats, setCategoryStats] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (!user) {
        navigate('/login');
        return;
      }

      setUser(user);
      fetchResults(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      navigate('/login');
    }
  };

  const fetchResults = async (currentUser) => {
    try {
      // Načti všechny kategorie
      const { data: categories, error: catError } = await supabase
        .from('lifepro_categories')
        .select('*')
        .eq('is_published', true)
        .order('order');

      if (catError) throw catError;

      // Načti všechny sekce
      const { data: sections, error: secError } = await supabase
        .from('lifepro_sections')
        .select('*')
        .eq('is_published', true);

      if (secError) throw secError;

      // Načti všechny otázky
      const { data: questions, error: qError } = await supabase
        .from('lifepro_questions')
        .select('*')
        .eq('is_published', true);

      if (qError) throw qError;

      // Načti odpovědi uživatele
      const { data: responses, error: resError } = await supabase
        .from('lifepro_user_responses')
        .select(`
          question_id,
          answer_multiple,
          is_favorite,
          lifepro_questions (
            id,
            question_text,
            section_id,
            lifepro_sections (
              id,
              title,
              category_id,
              lifepro_categories (
                id,
                title,
                icon,
                slug
              )
            )
          )
        `)
        .eq('user_id', currentUser.id);

      if (resError) throw resError;

      // Spočítej statistiky
      const answeredQuestions = responses.filter(
        r => r.answer_multiple && r.answer_multiple.length > 0
      );
      const favoritesData = responses.filter(r => r.is_favorite);

      // Spočítej completion per category
      const categoryCompletion = categories.map(cat => {
        const catSections = sections.filter(s => s.category_id === cat.id);
        const catSectionIds = catSections.map(s => s.id);
        const catQuestions = questions.filter(q => catSectionIds.includes(q.section_id));
        const catAnswered = answeredQuestions.filter(r => {
          const questionSectionId = r.lifepro_questions?.section_id;
          return catSectionIds.includes(questionSectionId);
        });

        const total = catQuestions.length;
        const answered = catAnswered.length;
        const percentage = total > 0 ? (answered / total) * 100 : 0;

        return {
          ...cat,
          totalQuestions: total,
          answeredQuestions: answered,
          percentage: Math.round(percentage),
          isCompleted: percentage === 100,
        };
      });

      const completedCategories = categoryCompletion.filter(c => c.isCompleted).length;

      setStats({
        totalCategories: categories.length,
        completedCategories: completedCategories,
        totalQuestions: questions.length,
        answeredQuestions: answeredQuestions.length,
        favoriteCount: favoritesData.length,
      });

      setCategoryStats(categoryCompletion);
      setFavorites(favoritesData);

      // Prepare data for PDF export
      const pdfCategories = categoryCompletion.map(cat => {
        const catSections = sections.filter(s => s.category_id === cat.id);
        const sectionsWithAnswers = catSections.map(section => {
          const sectionQuestions = questions.filter(q => q.section_id === section.id);
          const sectionResponses = answeredQuestions.filter(r =>
            sectionQuestions.some(q => q.id === r.question_id)
          );

          return {
            ...section,
            answeredQuestions: sectionResponses.map(r => ({
              question_text: r.lifepro_questions?.question_text,
              is_favorite: r.is_favorite,
            })),
          };
        });

        return {
          ...cat,
          sections: sectionsWithAnswers,
        };
      });

      const favoritesWithDetails = favoritesData.map(fav => ({
        question_text: fav.lifepro_questions?.question_text,
        section_title: fav.lifepro_questions?.lifepro_sections?.title,
        category_title: fav.lifepro_questions?.lifepro_sections?.lifepro_categories?.title,
      }));

      setPdfData({
        userName: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Uživatel',
        categories: pdfCategories,
        stats: {
          totalQuestions: questions.length,
          answeredQuestions: answeredQuestions.length,
          progressPercentage: Math.round((answeredQuestions.length / questions.length) * 100),
          favoriteCount: favoritesData.length,
          favorites: favoritesWithDetails,
        },
      });
    } catch (err) {
      console.error('Error fetching results:', err);
      showError('Chyba', 'Nepodařilo se načíst výsledky');
    } finally {
      setLoading(false);
    }
  };

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

  const overallProgress = stats.totalQuestions > 0
    ? (stats.answeredQuestions / stats.totalQuestions) * 100
    : 0;

  const handleExportPDF = () => {
    if (!pdfData) {
      showError('Chyba', 'Data pro export nejsou k dispozici');
      return;
    }

    try {
      const timestamp = new Date().toISOString().split('T')[0];
      downloadPDFReport(pdfData, `lifepro-vysledky-${timestamp}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      showError('Chyba', 'Nepodařilo se vygenerovat PDF');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Button
            startIcon={<ArrowLeft size={20} />}
            onClick={() => navigate('/dashboard')}
          >
            Zpět na dashboard
          </Button>

          <Button
            variant="contained"
            startIcon={<FileDown size={20} />}
            onClick={handleExportPDF}
            disabled={!pdfData || stats.answeredQuestions === 0}
          >
            Stáhnout PDF
          </Button>
        </Box>

        <Typography variant="h3" gutterBottom>
          Výsledky
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Přehled vašich odpovědí a pokroku
        </Typography>
      </Box>

      {/* Overall Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Target size={32} style={{ marginBottom: 8, color: '#1976d2' }} />
            <Typography variant="h4" fontWeight={700}>
              {stats.answeredQuestions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              z {stats.totalQuestions} otázek
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <CheckCircle size={32} style={{ marginBottom: 8, color: '#2e7d32' }} />
            <Typography variant="h4" fontWeight={700}>
              {stats.completedCategories}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              z {stats.totalCategories} kategorií
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Heart size={32} style={{ marginBottom: 8, color: '#d32f2f' }} />
            <Typography variant="h4" fontWeight={700}>
              {stats.favoriteCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              oblíbených
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <TrendingUp size={32} style={{ marginBottom: 8, color: '#ed6c02' }} />
            <Typography variant="h4" fontWeight={700}>
              {Math.round(overallProgress)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              celkový pokrok
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Overall Progress */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Celkový Pokrok
        </Typography>
        <LinearProgress
          variant="determinate"
          value={overallProgress}
          sx={{ height: 12, borderRadius: 2, mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          {stats.answeredQuestions} z {stats.totalQuestions} otázek zodpovězeno
        </Typography>
      </Card>

      {/* Category Breakdown */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom mb={3}>
          Pokrok po Kategoriích
        </Typography>

        <Stack spacing={3}>
          {categoryStats.map((cat) => (
            <Box key={cat.id}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  {cat.icon && <Typography variant="h6">{cat.icon}</Typography>}
                  <Typography variant="body1" fontWeight={600}>
                    {cat.title}
                  </Typography>
                  {cat.isCompleted && (
                    <Chip
                      label="Dokončeno"
                      color="success"
                      size="small"
                      icon={<CheckCircle size={16} />}
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {cat.answeredQuestions} / {cat.totalQuestions}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <LinearProgress
                  variant="determinate"
                  value={cat.percentage}
                  sx={{
                    flex: 1,
                    height: 8,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                  }}
                  color={cat.isCompleted ? 'success' : 'primary'}
                />
                <Typography variant="body2" fontWeight={600} sx={{ minWidth: 45 }}>
                  {cat.percentage}%
                </Typography>
              </Box>

              <Box mt={1}>
                <Button
                  size="small"
                  variant={cat.isCompleted ? 'outlined' : 'contained'}
                  onClick={() => navigate(`/questionnaire/${cat.slug}`)}
                >
                  {cat.isCompleted ? 'Upravit odpovědi' : 'Pokračovat'}
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Card>

      {/* Visualizations */}
      {categoryStats.length > 0 && stats.answeredQuestions > 0 && (
        <>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} lg={6}>
              <CategoryRadarChart categories={categoryStats} />
            </Grid>
            <Grid item xs={12} lg={6}>
              <CategoryBarChart categories={categoryStats} />
            </Grid>
          </Grid>
        </>
      )}

      {/* Favorites */}
      {favorites.length > 0 && (
        <Card sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Heart size={24} style={{ color: '#d32f2f' }} fill="#d32f2f" />
            <Typography variant="h6">
              Oblíbené Odpovědi ({favorites.length})
            </Typography>
          </Box>

          <Stack spacing={2}>
            {favorites.slice(0, 10).map((fav) => (
              <Box key={fav.question_id}>
                <Box display="flex" alignItems="start" gap={2}>
                  <Heart size={18} style={{ color: '#d32f2f', marginTop: 2 }} fill="#d32f2f" />
                  <Box flex={1}>
                    <Typography variant="body1" fontWeight={500}>
                      {fav.lifepro_questions?.question_text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fav.lifepro_questions?.lifepro_sections?.title} • {' '}
                      {fav.lifepro_questions?.lifepro_sections?.lifepro_categories?.title}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}

            {favorites.length > 10 && (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                ... a dalších {favorites.length - 10} oblíbených
              </Typography>
            )}
          </Stack>
        </Card>
      )}

      {/* Call to Action */}
      {overallProgress < 100 && (
        <Card sx={{ p: 4, mt: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h5" gutterBottom>
            Ještě nejste hotovi!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Dokončili jste {Math.round(overallProgress)}% dotazníku. Pokračujte a objevte více o sobě!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/questionnaire')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Pokračovat v dotazníku
          </Button>
        </Card>
      )}

      {/* AI Analysis CTA */}
      {overallProgress === 100 && (
        <Card sx={{ p: 4, mt: 4, textAlign: 'center', bgcolor: 'success.main', color: 'white' }}>
          <CheckCircle size={48} style={{ marginBottom: 16 }} />
          <Typography variant="h5" gutterBottom>
            Gratulujeme! Dokončili jste celý dotazník! 🎉
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Nyní můžete požádat o AI analýzu vašich odpovědí a získat personalizovaná doporučení.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'success.main',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
            disabled
          >
            AI Analýza (již brzy)
          </Button>
        </Card>
      )}
    </Container>
  );
};

export default ResultsPage;
