/**
 * Admin - Otázky
 * Správa otázek a možností odpovědí (CRUD)
 */

'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Edit, Delete, Plus, ChevronDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Question {
  id: string;
  section_id: string;
  slug: string;
  question_text: string;
  help_text: string | null;
  question_type: string;
  order: number;
  is_required: boolean;
  is_favorite_allowed: boolean;
  max_favorites: number | null;
  is_published: boolean;
  sections: {
    title: string;
    categories: {
      title: string;
      icon: string;
    };
  };
  question_options: Array<{
    id: string;
    value: string;
    label: string;
    order: number;
  }>;
}

export default function QuestionsAdmin() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [questionsRes, sectionsRes] = await Promise.all([
        supabase
          .from('lifepro_questions')
          .select(`
            *,
            lifepro_sections!inner(title, lifepro_categories!inner(title, icon)),
            lifepro_question_options(id, value, label, order)
          `)
          .order('order', { ascending: true }),
        supabase
          .from('lifepro_sections')
          .select('id, title, lifepro_categories!inner(title, icon)')
          .order('order', { ascending: true }),
      ]);

      if (questionsRes.error) throw questionsRes.error;
      if (sectionsRes.error) throw sectionsRes.error;

      setQuestions(questionsRes.data || []);
      setSections(sectionsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto otázku?')) return;

    try {
      const { error } = await supabase.from('lifepro_questions').delete().eq('id', id);

      if (error) throw error;

      loadData();
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Chyba při mazání otázky');
    }
  };

  const filteredQuestions =
    selectedSection === 'all'
      ? questions
      : questions.filter((q) => q.section_id === selectedSection);

  const getTypeColor = (type: string) => {
    const colors: Record<string, any> = {
      text: 'default',
      textarea: 'primary',
      checkbox: 'success',
      radio: 'info',
      select: 'warning',
      multiselect: 'warning',
      slider: 'secondary',
      rating: 'error',
      date: 'default',
      mindmap: 'secondary',
    };
    return colors[type] || 'default';
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <div>
          <Typography variant="h4">Otázky</Typography>
          <Typography variant="body2" color="text.secondary">
            Správa otázek a možností odpovědí
          </Typography>
        </div>
        <Button variant="contained" startIcon={<Plus size={20} />}>
          Přidat otázku
        </Button>
      </Box>

      <Box mb={3}>
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel>Filtrovat podle sekce</InputLabel>
          <Select
            value={selectedSection}
            label="Filtrovat podle sekce"
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <MenuItem value="all">Všechny sekce</MenuItem>
            {sections.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.categories?.icon} {section.categories?.title} → {section.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box>
        {filteredQuestions.map((question) => (
          <Accordion key={question.id}>
            <AccordionSummary expandIcon={<ChevronDown size={20} />}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
                pr={2}
              >
                <Box flex={1}>
                  <Typography variant="body1" fontWeight="bold">
                    {question.order}. {question.question_text}
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    <Chip
                      label={`${question.sections.categories.icon} ${question.sections.categories.title} → ${question.sections.title}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={question.question_type}
                      size="small"
                      color={getTypeColor(question.question_type)}
                    />
                    {question.is_required && (
                      <Chip label="Povinná" size="small" color="error" />
                    )}
                    {question.is_favorite_allowed && (
                      <Chip label="Srdcovka" size="small" color="warning" />
                    )}
                    {!question.is_published && (
                      <Chip label="Skryto" size="small" />
                    )}
                  </Box>
                </Box>
                <Box display="flex" gap={1}>
                  <IconButton size="small" color="primary" onClick={(e) => e.stopPropagation()}>
                    <Edit size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(question.id);
                    }}
                  >
                    <Delete size={18} />
                  </IconButton>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                {question.help_text && (
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    <strong>Nápověda:</strong> {question.help_text}
                  </Typography>
                )}

                <Typography variant="body2" mb={1}>
                  <strong>Slug:</strong> <code>{question.slug}</code>
                </Typography>

                {question.question_options.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      Možnosti odpovědí ({question.question_options.length}):
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {question.question_options
                        .sort((a, b) => a.order - b.order)
                        .map((option) => (
                          <Chip
                            key={option.id}
                            label={`${option.order}. ${option.label}`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {filteredQuestions.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">
            Žádné otázky v této sekci.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
