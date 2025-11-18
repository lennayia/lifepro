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
} from '@mui/material';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useNotification } from '@shared/context/NotificationContext';

const AdminCategoriesTab = () => {
  const { showSuccess, showError } = useNotification();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    icon: '',
    order: 0,
    is_published: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('lifepro_categories')
        .select('*')
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

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        title: category.title,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || '',
        order: category.order,
        is_published: category.is_published,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        title: '',
        slug: '',
        description: '',
        icon: '',
        order: categories.length,
        is_published: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      icon: '',
      order: 0,
      is_published: true,
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      showError('Chyba', 'Název a slug jsou povinné');
      return;
    }

    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('lifepro_categories')
          .update({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            icon: formData.icon,
            order: formData.order,
            is_published: formData.is_published,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        showSuccess('Uloženo', 'Kategorie byla aktualizována');
      } else {
        // Create new category
        const { error } = await supabase
          .from('lifepro_categories')
          .insert({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            icon: formData.icon,
            order: formData.order,
            is_published: formData.is_published,
          });

        if (error) throw error;
        showSuccess('Uloženo', 'Kategorie byla vytvořena');
      }

      handleCloseDialog();
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      showError('Chyba', 'Nepodařilo se uložit kategorii');
    }
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('Opravdu chcete smazat tuto kategorii? Budou smazány i všechny související sekce a otázky.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('lifepro_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      showSuccess('Smazáno', 'Kategorie byla smazána');
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      showError('Chyba', 'Nepodařilo se smazat kategorii');
    }
  };

  const handleGenerateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData({ ...formData, slug });
    }
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
        <Typography variant="h6">Kategorie ({categories.length})</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => handleOpenDialog()}
        >
          Přidat kategorii
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={60}>Pořadí</TableCell>
              <TableCell width={60}>Ikona</TableCell>
              <TableCell>Název</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Popis</TableCell>
              <TableCell width={120}>Status</TableCell>
              <TableCell width={120}>Akce</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.order}</TableCell>
                <TableCell>
                  <Typography variant="h6">{category.icon}</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={600}>{category.title}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {category.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                    {category.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.is_published ? 'Publikováno' : 'Koncept'}
                    color={category.is_published ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(category)}
                    sx={{ mr: 1 }}
                  >
                    <Edit size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(category.id)}
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

      {categories.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
          <Typography variant="body1" color="text.secondary">
            Zatím nemáte žádné kategorie
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 2 }}
          >
            Vytvořit první kategorii
          </Button>
        </Paper>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Upravit kategorii' : 'Nová kategorie'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Název kategorie"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />

            <Box display="flex" gap={2}>
              <TextField
                label="Slug (URL)"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                fullWidth
                required
                helperText="Použijte pouze malá písmena, čísla a pomlčky"
              />
              <Button onClick={handleGenerateSlug} sx={{ minWidth: 120 }}>
                Generovat
              </Button>
            </Box>

            <TextField
              label="Popis"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              label="Ikona (emoji)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              fullWidth
              placeholder="🎯"
              helperText="Vložte emoji ikonu"
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

export default AdminCategoriesTab;
