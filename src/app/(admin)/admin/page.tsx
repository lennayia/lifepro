/**
 * Admin Dashboard
 * Přehled statistik a rychlé akce
 */

'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material';
import Link from 'next/link';

interface Stats {
  categories: number;
  sections: number;
  questions: number;
  options: number;
  users: number;
  responses: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    categories: 0,
    sections: 0,
    questions: 0,
    options: 0,
    users: 0,
    responses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Volat admin stats API endpoint
      const response = await fetch('/api/admin/stats');

      if (!response.ok) {
        throw new Error('Failed to load stats');
      }

      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Kategorie', value: stats.categories, link: '/admin/categories' },
    { label: 'Sekce', value: stats.sections, link: '/admin/sections' },
    { label: 'Otázky', value: stats.questions, link: '/admin/questions' },
    { label: 'Možnosti odpovědí', value: stats.options, link: '/admin/questions' },
    { label: 'Uživatelé', value: stats.users, link: '#' },
    { label: 'Odpovědi', value: stats.responses, link: '#' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Přehled systému a rychlé akce
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.label}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  {card.label}
                </Typography>
                <Typography variant="h3" component="div">
                  {loading ? '...' : card.value}
                </Typography>
                {card.link !== '#' && (
                  <Button
                    component={Link}
                    href={card.link}
                    size="small"
                    sx={{ mt: 2 }}
                  >
                    Spravovat
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Rychlé akce
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              component={Link}
              href="/admin/categories"
            >
              Přidat kategorii
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              component={Link}
              href="/admin/sections"
            >
              Přidat sekci
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              component={Link}
              href="/admin/questions"
            >
              Přidat otázku
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
