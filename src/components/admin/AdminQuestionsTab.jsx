import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Typography,
  Chip,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useNotification } from '@shared/context/NotificationContext';

const AdminQuestionsTab = () => {
  const { showSuccess, showError } = useNotification();
  const [questions, setQuestions] = useState([]);
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    question_text: '',
    section_id: '',
    order: 0,
    is_published: true,
    is_favorite_allowed: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: catError } = await supabase
        .from('lifepro_categories')
        .select('*')
        .order('order');

      if (catError) throw catError;
      setCategories(categoriesData || []);

      // Fetch sections
      const { data: sectionsData, error: secError } = await supabase
        .from('lifepro_sections')
        .select(`
          *,
          lifepro_categories (
            id,
            title,
            icon
          )
        `)
        .order('category_id')
        .order('order');

      if (secError) throw secError;
      setSections(sectionsData || []);

      // Fetch questions with section and category info
      const { data: questionsData, error: qError } = await supabase
        .from('lifepro_questions')
        .select(`
          *,
          lifepro_sections (
            id,
            title,
            category_id,
            lifepro_categories (
              id,
              title,
              icon
            )
          )
        `)
        .order('section_id')
        .order('order');

      if (qError) throw qError;
      setQuestions(questionsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      showError('Chyba', 'Nepodařilo se načíst data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (question = null) => {
    if (question) {
      setEditingQuestion(question);
      setFormData({
        question_text: question.question_text,
        section_id: question.section_id,
        order: question.order,
        is_published: question.is_published,
        is_favorite_allowed: question.is_favorite_allowed,
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        question_text: '',
        section_id: sections.length > 0 ? sections[0].id : '',
        order: questions.length,
        is_published: true,
        is_favorite_allowed: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingQuestion(null);
    setFormData({
      question_text: '',
      section_id: '',
      order: 0,
      is_published: true,
      is_favorite_allowed: true,
    });
  };

  const handleSave = async () => {
    if (!formData.question_text || !formData.section_id) {
      showError('Chyba', 'Text otázky a sekce jsou povinné');
      return;
    }

    try {
      if (editingQuestion) {
        // Update existing question
        const { error } = await supabase
          .from('lifepro_questions')
          .update({
            question_text: formData.question_text,
            section_id: formData.section_id,
            order: formData.order,
            is_published: formData.is_published,
            is_favorite_allowed: formData.is_favorite_allowed,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingQuestion.id);

        if (error) throw error;
        showSuccess('Uloženo', 'Otázka byla aktualizována');
      } else {
        // Create new question
        const { error } = await supabase
          .from('lifepro_questions')
          .insert({
            question_text: formData.question_text,
            section_id: formData.section_id,
            order: formData.order,
            is_published: formData.is_published,
            is_favorite_allowed: formData.is_favorite_allowed,
          });

        if (error) throw error;
        showSuccess('Uloženo', 'Otázka byla vytvořena');
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Error saving question:', err);
      showError('Chyba', 'Nepodařilo se uložit otázku');
    }
  };

  const handleDelete = async (questionId) => {
    if (!confirm('Opravdu chcete smazat tuto otázku?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('lifepro_questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
      showSuccess('Smazáno', 'Otázka byla smazána');
      fetchData();
    } catch (err) {
      console.error('Error deleting question:', err);
      showError('Chyba', 'Nepodařilo se smazat otázku');
    }
  };

  const filteredQuestions = filterCategory === 'all'
    ? questions
    : questions.filter(q => q.lifepro_sections?.category_id === filterCategory);

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
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6">Otázky ({filteredQuestions.length})</Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filtr kategorie</InputLabel>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              label="Filtr kategorie"
            >
              <MenuItem value="all">Všechny kategorie</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.icon} {cat.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => handleOpenDialog()}
          disabled={sections.length === 0}
        >
          Přidat otázku
        </Button>
      </Box>

      {sections.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Nejprve vytvořte kategorii a sekci
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={60}>Pořadí</TableCell>
                  <TableCell>Otázka</TableCell>
                  <TableCell width={200}>Sekce</TableCell>
                  <TableCell width={120}>Oblíbená</TableCell>
                  <TableCell width={120}>Status</TableCell>
                  <TableCell width={120}>Akce</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>{question.order}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {question.question_text}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {question.lifepro_sections?.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {question.lifepro_sections?.lifepro_categories?.icon}{' '}
                          {question.lifepro_sections?.lifepro_categories?.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={question.is_favorite_allowed ? 'Povoleno' : 'Zakázáno'}
                        color={question.is_favorite_allowed ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={question.is_published ? 'Publikováno' : 'Koncept'}
                        color={question.is_published ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(question)}
                        sx={{ mr: 1 }}
                      >
                        <Edit size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(question.id)}
                        color="error"
                      >
                        <Trash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredQuestions.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
              <Typography variant="body1" color="text.secondary">
                {filterCategory === 'all'
                  ? 'Zatím nemáte žádné otázky'
                  : 'V této kategorii nejsou žádné otázky'
                }
              </Typography>
              {filterCategory === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  onClick={() => handleOpenDialog()}
                  sx={{ mt: 2 }}
                >
                  Vytvořit první otázku
                </Button>
              )}
            </Paper>
          )}
        </>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingQuestion ? 'Upravit otázku' : 'Nová otázka'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Sekce</InputLabel>
              <Select
                value={formData.section_id}
                onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
                label="Sekce"
              >
                {sections.map((section) => (
                  <MenuItem key={section.id} value={section.id}>
                    {section.lifepro_categories?.icon} {section.lifepro_categories?.title} → {section.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Text otázky"
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              fullWidth
              required
              multiline
              rows={3}
            />

            <TextField
              label="Pořadí"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_favorite_allowed}
                  onChange={(e) => setFormData({ ...formData, is_favorite_allowed: e.target.checked })}
                />
              }
              label="Povolit označení jako oblíbená"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
              }
              label="Publikováno"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<X size={18} />}>
            Zrušit
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<Save size={18} />}
          >
            Uložit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminQuestionsTab;
