/**
 * Admin - Sekce
 * Správa sekcí (CRUD)
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
} from '@mui/material';
import { Edit, Delete, Add } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Section {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  description: string | null;
  order: number;
  is_published: boolean;
  categories: {
    title: string;
    icon: string;
  };
}

export default function SectionsAdmin() {
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sectionsRes, categoriesRes] = await Promise.all([
        supabase
          .from('lifepro_sections')
          .select('*, lifepro_categories!inner(title, icon)')
          .order('order', { ascending: true }),
        supabase
          .from('lifepro_categories')
          .select('id, title, icon')
          .order('order', { ascending: true }),
      ]);

      if (sectionsRes.error) throw sectionsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setSections(sectionsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto sekci?')) return;

    try {
      const { error } = await supabase.from('lifepro_sections').delete().eq('id', id);

      if (error) throw error;

      loadData();
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Chyba při mazání sekce');
    }
  };

  const filteredSections =
    selectedCategory === 'all'
      ? sections
      : sections.filter((s) => s.category_id === selectedCategory);

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
          <Typography variant="h4">Sekce</Typography>
          <Typography variant="body2" color="text.secondary">
            Podsekce v kategoriích (Role, Vzdělání, Dovednosti, atd.)
          </Typography>
        </div>
        <Button variant="contained" startIcon={<Add size={20} />}>
          Přidat sekci
        </Button>
      </Box>

      <Box mb={3}>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Filtrovat podle kategorie</InputLabel>
          <Select
            value={selectedCategory}
            label="Filtrovat podle kategorie"
            onChange={(e) => setSelectedCategory(e.target.value)}
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pořadí</TableCell>
              <TableCell>Kategorie</TableCell>
              <TableCell>Název sekce</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Akce</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSections.map((section) => (
              <TableRow key={section.id}>
                <TableCell>{section.order}</TableCell>
                <TableCell>
                  <Chip
                    label={`${section.categories.icon} ${section.categories.title}`}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {section.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {section.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <code>{section.slug}</code>
                </TableCell>
                <TableCell>
                  <Chip
                    label={section.is_published ? 'Publikováno' : 'Skryto'}
                    size="small"
                    color={section.is_published ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary">
                    <Edit size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(section.id)}
                  >
                    <Delete size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredSections.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">
            Žádné sekce v této kategorii.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
