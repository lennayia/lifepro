import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  IconButton,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import { ArrowLeft, Heart, Save, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useNotification } from '@shared/context/NotificationContext';

const QuestionnaireDetailPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [category, setCategory] = useState(null);
  const [sections, setSections] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    fetchUser();
  }, [categorySlug]);

  const fetchUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (!user) {
        navigate('/login');
        return;
      }

      setUser(user);
      fetchQuestionnaire();
      fetchUserResponses(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      navigate('/login');
    }
  };

  const fetchQuestionnaire = async () => {
    try {
      // Načti kategorii
      const { data: categoryData, error: catError } = await supabase
        .from('lifepro_categories')
        .select('*')
        .eq('slug', categorySlug)
        .eq('is_published', true)
        .single();

      if (catError) throw catError;
      setCategory(categoryData);

      // Načti sekce
      const { data: sectionsData, error: secError } = await supabase
        .from('lifepro_sections')
        .select('*')
        .eq('category_id', categoryData.id)
        .eq('is_published', true)
        .order('order');

      if (secError) throw secError;
      setSections(sectionsData || []);

      // Načti otázky pro všechny sekce
      const sectionIds = sectionsData.map(s => s.id);
      const { data: questionsData, error: qError } = await supabase
        .from('lifepro_questions')
        .select('*')
        .in('section_id', sectionIds)
        .eq('is_published', true)
        .order('order');

      if (qError) throw qError;
      setQuestions(questionsData || []);
    } catch (err) {
      console.error('Error fetching questionnaire:', err);
      showError('Chyba', 'Nepodařilo se načíst dotazník');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserResponses = async (currentUser) => {
    try {
      const { data, error } = await supabase
        .from('lifepro_user_responses')
        .select('question_id, answer_multiple, is_favorite')
        .eq('user_id', currentUser.id);

      if (error) throw error;

      const responsesMap = {};
      const favSet = new Set();

      data?.forEach(response => {
        responsesMap[response.question_id] = response.answer_multiple || [];
        if (response.is_favorite) {
          favSet.add(response.question_id);
        }
      });

      setResponses(responsesMap);
      setFavorites(favSet);
    } catch (err) {
      console.error('Error fetching responses:', err);
    }
  };

  const handleCheckboxChange = async (questionId, checked) => {
    // Aktualizuj lokální stav
    const currentAnswers = responses[questionId] || [];
    const newAnswers = checked
      ? [...currentAnswers, 'checked']
      : currentAnswers.filter(a => a !== 'checked');

    setResponses(prev => ({
      ...prev,
      [questionId]: newAnswers,
    }));

    // Auto-save do databáze
    await saveResponse(questionId, newAnswers, favorites.has(questionId));
  };

  const handleFavoriteToggle = async (questionId) => {
    const newFavorites = new Set(favorites);
    const isFavorite = newFavorites.has(questionId);

    if (isFavorite) {
      newFavorites.delete(questionId);
    } else {
      newFavorites.add(questionId);
    }

    setFavorites(newFavorites);

    // Auto-save do databáze
    await saveResponse(questionId, responses[questionId] || [], !isFavorite);
  };

  const saveResponse = async (questionId, answerMultiple, isFavorite) => {
    try {
      const { error } = await supabase
        .from('lifepro_user_responses')
        .upsert({
          user_id: user.id,
          question_id: questionId,
          answer_multiple: answerMultiple,
          is_favorite: isFavorite,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,question_id'
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error saving response:', err);
      showError('Chyba', 'Nepodařilo se uložit odpověď');
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const upsertData = [];

      questions.forEach(q => {
        upsertData.push({
          user_id: user.id,
          question_id: q.id,
          answer_multiple: responses[q.id] || [],
          is_favorite: favorites.has(q.id),
          updated_at: new Date().toISOString(),
        });
      });

      const { error } = await supabase
        .from('lifepro_user_responses')
        .upsert(upsertData, { onConflict: 'user_id,question_id' });

      if (error) throw error;

      showSuccess('Uloženo', 'Všechny odpovědi byly úspěšně uloženy');
    } catch (err) {
      console.error('Error saving all responses:', err);
      showError('Chyba', 'Nepodařilo se uložit odpovědi');
    } finally {
      setSaving(false);
    }
  };

  const calculateProgress = () => {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(responses).filter(
      qId => responses[qId]?.length > 0
    ).length;

    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
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

  if (!category) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5">Kategorie nebyla nalezena</Typography>
        <Button onClick={() => navigate('/questionnaire')} sx={{ mt: 2 }}>
          Zpět na dotazník
        </Button>
      </Container>
    );
  }

  const progress = calculateProgress();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/questionnaire')}
          sx={{ mb: 2 }}
        >
          Zpět na kategorie
        </Button>

        <Box display="flex" alignItems="center" gap={2} mb={2}>
          {category.icon && (
            <Typography variant="h2">{category.icon}</Typography>
          )}
          <Box flex={1}>
            <Typography variant="h3" gutterBottom>
              {category.title}
            </Typography>
            {category.description && (
              <Typography variant="body1" color="text.secondary">
                {category.description}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Progress Bar */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Typography variant="body2" fontWeight={600}>
              Pokrok
            </Typography>
            <Chip
              label={`${Math.round(progress)}%`}
              color={progress === 100 ? 'success' : 'primary'}
              size="small"
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {Object.keys(responses).filter(qId => responses[qId]?.length > 0).length} z {questions.length} otázek zodpovězeno
          </Typography>
        </Card>

        {/* Save Button */}
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save size={20} />}
            onClick={handleSaveAll}
            disabled={saving}
          >
            Uložit vše
          </Button>
          {progress === 100 && (
            <Button
              variant="outlined"
              startIcon={<CheckCircle size={20} />}
              onClick={() => navigate('/results')}
            >
              Zobrazit výsledky
            </Button>
          )}
        </Box>
      </Box>

      {/* Sections and Questions */}
      {sections.map((section) => {
        const sectionQuestions = questions.filter(q => q.section_id === section.id);

        if (sectionQuestions.length === 0) return null;

        return (
          <Card key={section.id} sx={{ mb: 3, overflow: 'visible' }}>
            <Box sx={{ p: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              <Typography variant="h5" fontWeight={600}>
                {section.title}
              </Typography>
              {section.description && (
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                  {section.description}
                </Typography>
              )}
            </Box>

            <Box sx={{ p: 3 }}>
              {sectionQuestions.map((question, index) => {
                const isChecked = responses[question.id]?.includes('checked') || false;
                const isFav = favorites.has(question.id);

                return (
                  <Box key={question.id}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        '&:hover .favorite-button': {
                          opacity: 1,
                        },
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={(e) => handleCheckboxChange(question.id, e.target.checked)}
                            sx={{ mr: 1 }}
                          />
                        }
                        label={
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: isChecked ? 600 : 400,
                              textDecoration: isChecked ? 'none' : 'none',
                            }}
                          >
                            {question.question_text}
                          </Typography>
                        }
                      />

                      {question.is_favorite_allowed && (
                        <IconButton
                          className="favorite-button"
                          onClick={() => handleFavoriteToggle(question.id)}
                          sx={{
                            opacity: isFav ? 1 : 0.3,
                            transition: 'opacity 0.2s',
                            color: isFav ? 'error.main' : 'text.secondary',
                          }}
                        >
                          <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Card>
        );
      })}

      {sections.length === 0 && (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Tato kategorie zatím nemá žádné otázky
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Zkuste jinou kategorii
          </Typography>
        </Card>
      )}
    </Container>
  );
};

export default QuestionnaireDetailPage;
