/**
 * Admin - Kategorie
 * Správa kategorií (CRUD)
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
} from '@mui/material';
import { Edit, Delete, Add } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Category {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  time_period: 'present' | 'past' | 'future' | null;
  order: number;
  is_published: boolean;
}

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('lifepro_categories')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto kategorii?')) return;

    try {
      const { error } = await supabase.from('lifepro_categories').delete().eq('id', id);

      if (error) throw error;

      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Chyba při mazání kategorie');
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
        <div>
          <Typography variant="h4">Kategorie</Typography>
          <Typography variant="body2" color="text.secondary">
            Hlavní kategorie dotazníku (JSEM, VÍM, UMÍM, MÁM RÁD/A, atd.)
          </Typography>
        </div>
        <Button variant="contained" startIcon={<Add size={20} />}>
          Přidat kategorii
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pořadí</TableCell>
              <TableCell>Ikona</TableCell>
              <TableCell>Název</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Období</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Akce</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.order}</TableCell>
                <TableCell>
                  <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {category.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {category.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <code>{category.slug}</code>
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.time_period || 'N/A'}
                    size="small"
                    color={
                      category.time_period === 'present'
                        ? 'primary'
                        : category.time_period === 'future'
                        ? 'success'
                        : 'default'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={category.is_published ? 'Publikováno' : 'Skryto'}
                    size="small"
                    color={category.is_published ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary">
                    <Edit size={18} />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Delete size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {categories.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">
            Žádné kategorie. Klikněte na "Přidat kategorii" pro vytvoření první.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
