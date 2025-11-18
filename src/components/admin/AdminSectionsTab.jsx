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

const AdminSectionsTab = () => {
  const { showSuccess, showError } = useNotification();
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    order: 0,
    is_published: true,
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

      // Fetch sections with category info
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
    } catch (err) {
      console.error('Error fetching data:', err);
      showError('Chyba', 'Nepodařilo se načíst data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (section = null) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        title: section.title,
        description: section.description || '',
        category_id: section.category_id,
        order: section.order,
        is_published: section.is_published,
      });
    } else {
      setEditingSection(null);
      setFormData({
        title: '',
        description: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        order: sections.length,
        is_published: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSection(null);
    setFormData({
      title: '',
      description: '',
      category_id: '',
      order: 0,
      is_published: true,
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.category_id) {
      showError('Chyba', 'Název a kategorie jsou povinné');
      return;
    }

    try {
      if (editingSection) {
        // Update existing section
        const { error } = await supabase
          .from('lifepro_sections')
          .update({
            title: formData.title,
            description: formData.description,
            category_id: formData.category_id,
            order: formData.order,
            is_published: formData.is_published,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSection.id);

        if (error) throw error;
        showSuccess('Uloženo', 'Sekce byla aktualizována');
      } else {
        // Create new section
        const { error } = await supabase
          .from('lifepro_sections')
          .insert({
            title: formData.title,
            description: formData.description,
            category_id: formData.category_id,
            order: formData.order,
            is_published: formData.is_published,
          });

        if (error) throw error;
        showSuccess('Uloženo', 'Sekce byla vytvořena');
      }

      handleCloseDialog();
      fetchData();
    } catch (err) {
      console.error('Error saving section:', err);
      showError('Chyba', 'Nepodařilo se uložit sekci');
    }
  };

  const handleDelete = async (sectionId) => {
    if (!confirm('Opravdu chcete smazat tuto sekci? Budou smazány i všechny související otázky.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('lifepro_sections')
        .delete()
        .eq('id', sectionId);

      if (error) throw error;
      showSuccess('Smazáno', 'Sekce byla smazána');
      fetchData();
    } catch (err) {
      console.error('Error deleting section:', err);
      showError('Chyba', 'Nepodařilo se smazat sekci');
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
        <Typography variant="h6">Sekce ({sections.length})</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => handleOpenDialog()}
          disabled={categories.length === 0}
        >
          Přidat sekci
        </Button>
      </Box>

      {categories.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Nejprve vytvořte kategorii
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={60}>Pořadí</TableCell>
                  <TableCell>Název</TableCell>
                  <TableCell>Kategorie</TableCell>
                  <TableCell>Popis</TableCell>
                  <TableCell width={120}>Status</TableCell>
                  <TableCell width={120}>Akce</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell>{section.order}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{section.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {section.lifepro_categories?.icon && (
                          <Typography>{section.lifepro_categories.icon}</Typography>
                        )}
                        <Typography variant="body2">
                          {section.lifepro_categories?.title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                        {section.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={section.is_published ? 'Publikováno' : 'Koncept'}
                        color={section.is_published ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(section)}
                        sx={{ mr: 1 }}
                      >
                        <Edit size={18} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(section.id)}
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

          {sections.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
              <Typography variant="body1" color="text.secondary">
                Zatím nemáte žádné sekce
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => handleOpenDialog()}
                sx={{ mt: 2 }}
              >
                Vytvořit první sekci
              </Button>
            </Paper>
          )}
        </>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSection ? 'Upravit sekci' : 'Nová sekce'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Kategorie</InputLabel>
              <Select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                label="Kategorie"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Název sekce"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />

            <TextField
              label="Popis"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
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

export default AdminSectionsTab;
