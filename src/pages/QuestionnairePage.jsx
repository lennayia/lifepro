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
} from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useNotification } from '@shared/context/NotificationContext';

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('lifepro_categories')
        .select('*')
        .eq('is_published', true)
        .order('order');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      showError('Chyba', 'Nepodařilo se načíst kategorie');
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Zpět na dashboard
        </Button>

        <Typography variant="h3" gutterBottom>
          Dotazník
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vyberte kategorii a začněte vyplňovat dotazník
        </Typography>
      </Box>

      {categories.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Zatím nejsou k dispozici žádné kategorie
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administrátor musí nejdřív přidat kategorie a otázky
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
                onClick={() => navigate(`/questionnaire/${category.slug}`)}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  {category.icon && (
                    <Typography variant="h2" sx={{ mr: 2 }}>
                      {category.icon}
                    </Typography>
                  )}
                  <Typography variant="h5" fontWeight={600}>
                    {category.title}
                  </Typography>
                </Box>
                {category.description && (
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default QuestionnairePage;
