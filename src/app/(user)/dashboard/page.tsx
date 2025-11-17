/**
 * User Dashboard
 * Přehled kategorií s FlipCards a progress
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  LinearProgress,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { FlipCard } from '@/shared';
import { createClient } from '@/lib/supabase/client';
import { useLifeAuth } from '@/shared/context/LifeAuthContext';
import * as Icons from 'lucide-react';

interface Category {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  time_period: 'present' | 'past' | 'future' | null;
  order: number;
  progress?: number;
  totalQuestions?: number;
  answeredQuestions?: number;
}

export default function UserDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallProgress, setOverallProgress] = useState(0);
  const { user } = useLifeAuth();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      // Načíst kategorie
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_published', true)
        .order('order', { ascending: true });

      if (categoriesError) throw categoriesError;

      // Pro každou kategorii spočítat progress
      const categoriesWithProgress = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user!.id)
            .eq('category_id', category.id)
            .single();

          return {
            ...category,
            progress: progress?.completion_percentage || 0,
            totalQuestions: progress?.total_questions || 0,
            answeredQuestions: progress?.answered_questions || 0,
          };
        })
      );

      setCategories(categoriesWithProgress);

      // Spočítat celkový progress
      const totalProgress =
        categoriesWithProgress.reduce((sum, cat) => sum + (cat.progress || 0), 0) /
        categoriesWithProgress.length;
      setOverallProgress(totalProgress);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/questionnaire/${categorySlug}`);
  };

  const getTimePeriodLabel = (period: string | null) => {
    const labels: Record<string, string> = {
      present: 'Přítomnost',
      past: 'Minulost',
      future: 'Budoucnost',
    };
    return period ? labels[period] : '';
  };

  const getTimePeriodColor = (period: string | null) => {
    const colors: Record<string, string> = {
      present: '#3F51B5',
      past: '#9C27B0',
      future: '#4CAF50',
    };
    return period ? colors[period] : '#757575';
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
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Ahoj, {user?.user_metadata?.full_name || 'uživateli'}! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Najděte své životní poslání
        </Typography>

        {/* Overall Progress */}
        <Box mt={3}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Celkový progress
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="bold">
              {Math.round(overallProgress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={overallProgress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Box>

      {/* Categories Grid */}
      <Grid container spacing={3}>
        {categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FlipCard
                frontContent={
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      border: 2,
                      borderColor: getTimePeriodColor(category.time_period),
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: 3,
                      },
                    }}
                    onClick={() => handleCategoryClick(category.slug)}
                  >
                    <CardContent>
                      <Box textAlign="center" mb={2}>
                        <span style={{ fontSize: '3rem' }}>{category.icon}</span>
                      </Box>

                      <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        textAlign="center"
                      >
                        {category.title}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        textAlign="center"
                        display="block"
                        mb={2}
                      >
                        {getTimePeriodLabel(category.time_period)}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        textAlign="center"
                        mb={2}
                      >
                        {category.description}
                      </Typography>

                      {/* Progress */}
                      <Box mt={2}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="caption">Progress</Typography>
                          <Typography variant="caption" fontWeight="bold">
                            {category.answeredQuestions} / {category.totalQuestions}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={category.progress || 0}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                }
                backContent={
                  <Card
                    sx={{
                      height: '100%',
                      backgroundColor: getTimePeriodColor(category.time_period),
                      color: 'white',
                    }}
                  >
                    <CardContent
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="h5" gutterBottom>
                        {category.title}
                      </Typography>
                      <Typography variant="body1" mb={3}>
                        {category.progress === 100
                          ? '🎉 Dokončeno!'
                          : category.progress && category.progress > 0
                          ? 'Pokračujte v dotazníku'
                          : 'Začněte vyplňovat'}
                      </Typography>
                      <Button
                        variant="contained"
                        color="inherit"
                        onClick={() => handleCategoryClick(category.slug)}
                        sx={{
                          backgroundColor: 'white',
                          color: getTimePeriodColor(category.time_period),
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.9)',
                          },
                        }}
                      >
                        {category.progress && category.progress > 0
                          ? 'Pokračovat'
                          : 'Začít'}
                      </Button>
                    </CardContent>
                  </Card>
                }
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      {overallProgress === 100 && (
        <Box mt={6} textAlign="center">
          <Typography variant="h5" gutterBottom>
            🎉 Gratulujeme! Dokončili jste všechny kategorie!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Nyní můžete zobrazit svou AI analýzu a objevit své životní poslání.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/results')}
          >
            Zobrazit výsledky
          </Button>
        </Box>
      )}
    </Box>
  );
}
