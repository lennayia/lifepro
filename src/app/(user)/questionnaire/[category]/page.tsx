/**
 * Questionnaire Page
 * Dynamické vyplňování otázek podle kategorie
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Heart, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useLifeAuth } from '@/shared/context/LifeAuthContext';
import { useSoundFeedback } from '@/shared';

interface Question {
  id: string;
  slug: string;
  question_text: string;
  help_text: string | null;
  question_type: string;
  order: number;
  is_required: boolean;
  is_favorite_allowed: boolean;
  max_favorites: number | null;
  section_id: string;
  sections: {
    title: string;
  };
  question_options: Array<{
    id: string;
    value: string;
    label: string;
    order: number;
  }>;
}

interface Answer {
  answer_text?: string;
  answer_single?: string;
  answer_multiple?: string[];
  answer_number?: number;
  answer_date?: string;
  is_favorite?: boolean;
}

export default function QuestionnairePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useLifeAuth();
  const { playClick, playSuccess } = useSoundFeedback();
  const supabase = createClient();

  const [category, setCategory] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && params.category) {
      loadQuestionnaire();
    }
  }, [user, params.category]);

  const loadQuestionnaire = async () => {
    try {
      // Načíst kategorii
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', params.category)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Načíst otázky pro tuto kategorii
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          sections!inner(title, category_id),
          question_options(*)
        `)
        .eq('sections.category_id', categoryData.id)
        .eq('is_published', true)
        .order('order', { ascending: true });

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);

      // Načíst existující odpovědi
      const { data: responsesData } = await supabase
        .from('user_responses')
        .select('question_id, answer_text, answer_single, answer_multiple, answer_number, answer_date, is_favorite')
        .eq('user_id', user!.id)
        .in(
          'question_id',
          (questionsData || []).map((q) => q.id)
        );

      // Převést odpovědi do mapy
      const answersMap: Record<string, Answer> = {};
      (responsesData || []).forEach((response) => {
        answersMap[response.question_id] = {
          answer_text: response.answer_text,
          answer_single: response.answer_single,
          answer_multiple: response.answer_multiple,
          answer_number: response.answer_number,
          answer_date: response.answer_date,
          is_favorite: response.is_favorite,
        };
      });
      setAnswers(answersMap);
    } catch (error: any) {
      console.error('Error loading questionnaire:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveAnswer = async (questionId: string, answer: Answer) => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_responses')
        .upsert({
          user_id: user.id,
          question_id: questionId,
          ...answer,
        });

      if (error) throw error;

      playSuccess();
    } catch (error: any) {
      console.error('Error saving answer:', error);
      setError('Chyba při ukládání odpovědi');
    } finally {
      setSaving(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: any, type: string) => {
    const newAnswer: Answer = {};

    switch (type) {
      case 'text':
      case 'textarea':
        newAnswer.answer_text = value;
        break;
      case 'checkbox':
      case 'multiselect':
        newAnswer.answer_multiple = value;
        break;
      case 'radio':
      case 'select':
        newAnswer.answer_single = value;
        break;
      case 'slider':
      case 'rating':
        newAnswer.answer_number = value;
        break;
      case 'date':
        newAnswer.answer_date = value;
        break;
    }

    setAnswers({
      ...answers,
      [questionId]: {
        ...answers[questionId],
        ...newAnswer,
      },
    });

    // Auto-save po 2 sekundách
    setTimeout(() => {
      saveAnswer(questionId, {
        ...answers[questionId],
        ...newAnswer,
      });
    }, 2000);
  };

  const toggleFavorite = (questionId: string) => {
    const newAnswer = {
      ...answers[questionId],
      is_favorite: !answers[questionId]?.is_favorite,
    };

    setAnswers({
      ...answers,
      [questionId]: newAnswer,
    });

    saveAnswer(questionId, newAnswer);
    playClick();
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      playClick();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      playClick();
    }
  };

  const handleFinish = () => {
    playSuccess();
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !category) {
    return (
      <Box textAlign="center" p={4}>
        <Alert severity="error">{error || 'Kategorie nenalezena'}</Alert>
        <Button onClick={() => router.push('/dashboard')} sx={{ mt: 2 }}>
          Zpět na dashboard
        </Button>
      </Box>
    );
  }

  if (questions.length === 0) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h5" gutterBottom>
          V této kategorii zatím nejsou žádné otázky
        </Typography>
        <Button onClick={() => router.push('/dashboard')} sx={{ mt: 2 }}>
          Zpět na dashboard
        </Button>
      </Box>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion.id] || {};
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const renderQuestionInput = () => {
    switch (currentQuestion.question_type) {
      case 'text':
        return (
          <TextField
            fullWidth
            value={currentAnswer.answer_text || ''}
            onChange={(e) =>
              handleAnswerChange(currentQuestion.id, e.target.value, 'text')
            }
            placeholder="Vaše odpověď..."
          />
        );

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={6}
            value={currentAnswer.answer_text || ''}
            onChange={(e) =>
              handleAnswerChange(currentQuestion.id, e.target.value, 'textarea')
            }
            placeholder="Vaše odpověď..."
          />
        );

      case 'checkbox':
        return (
          <FormGroup>
            {currentQuestion.question_options
              .sort((a, b) => a.order - b.order)
              .map((option) => (
                <FormControlLabel
                  key={option.id}
                  control={
                    <Checkbox
                      checked={
                        currentAnswer.answer_multiple?.includes(option.value) ||
                        false
                      }
                      onChange={(e) => {
                        const current = currentAnswer.answer_multiple || [];
                        const newValue = e.target.checked
                          ? [...current, option.value]
                          : current.filter((v) => v !== option.value);
                        handleAnswerChange(
                          currentQuestion.id,
                          newValue,
                          'checkbox'
                        );
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
          </FormGroup>
        );

      case 'radio':
        return (
          <RadioGroup
            value={currentAnswer.answer_single || ''}
            onChange={(e) =>
              handleAnswerChange(currentQuestion.id, e.target.value, 'radio')
            }
          >
            {currentQuestion.question_options
              .sort((a, b) => a.order - b.order)
              .map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
          </RadioGroup>
        );

      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel>Vyberte možnost</InputLabel>
            <Select
              value={currentAnswer.answer_single || ''}
              label="Vyberte možnost"
              onChange={(e) =>
                handleAnswerChange(currentQuestion.id, e.target.value, 'select')
              }
            >
              {currentQuestion.question_options
                .sort((a, b) => a.order - b.order)
                .map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        );

      default:
        return (
          <Alert severity="warning">
            Typ otázky "{currentQuestion.question_type}" zatím není podporován
          </Alert>
        );
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <span style={{ fontSize: '2rem' }}>{category.icon}</span>
          <div>
            <Typography variant="h4">{category.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {category.description}
            </Typography>
          </div>
        </Box>

        {/* Progress */}
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Otázka {currentIndex + 1} z {questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight="bold">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>
      </Box>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent sx={{ p: 4 }}>
              {/* Section */}
              <Chip
                label={currentQuestion.sections.title}
                size="small"
                sx={{ mb: 2 }}
              />

              {/* Question */}
              <Box display="flex" alignItems="start" gap={2} mb={3}>
                <Typography variant="h5" component="h2" flex={1}>
                  {currentQuestion.question_text}
                  {currentQuestion.is_required && (
                    <span style={{ color: 'red' }}> *</span>
                  )}
                </Typography>

                {/* Favorite Button */}
                {currentQuestion.is_favorite_allowed && (
                  <IconButton
                    onClick={() => toggleFavorite(currentQuestion.id)}
                    color={currentAnswer.is_favorite ? 'error' : 'default'}
                  >
                    <Heart
                      size={24}
                      fill={currentAnswer.is_favorite ? 'currentColor' : 'none'}
                    />
                  </IconButton>
                )}
              </Box>

              {/* Help Text */}
              {currentQuestion.help_text && (
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {currentQuestion.help_text}
                </Typography>
              )}

              {/* Input */}
              {renderQuestionInput()}

              {/* Saving Indicator */}
              {saving && (
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" color="text.secondary">
                    Ukládání...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          variant="outlined"
          startIcon={<ChevronLeft size={20} />}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Předchozí
        </Button>

        {currentIndex === questions.length - 1 ? (
          <Button
            variant="contained"
            endIcon={<Save size={20} />}
            onClick={handleFinish}
          >
            Dokončit
          </Button>
        ) : (
          <Button
            variant="contained"
            endIcon={<ChevronRight size={20} />}
            onClick={handleNext}
          >
            Další
          </Button>
        )}
      </Box>
    </Box>
  );
}
