/**
 * Results Page
 * AI analýza odpovědí a zobrazení životního poslání
 */

'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Brain,
  Heart,
  Sparkles,
  Target,
  TrendingUp,
  ChevronDown,
  Download,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useLifeAuth } from '@/shared/context/LifeAuthContext';

interface Analysis {
  id: string;
  patterns: {
    values: string[];
    skills: string[];
    interests: string[];
    motivations: string[];
  };
  suggestions: Array<{
    title: string;
    description: string;
    category: string;
  }>;
  blind_spots: Array<{
    area: string;
    description: string;
  }>;
  connections: Array<{
    theme: string;
    items: string[];
  }>;
  generated_at: string;
}

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const { user } = useLifeAuth();
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      loadAnalysis();
    }
  }, [user]);

  const loadAnalysis = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_analyses')
        .select('*')
        .eq('user_id', user!.id)
        .order('generated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setAnalysis(data);
    } catch (error: any) {
      console.error('Error loading analysis:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysis = async () => {
    setGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user!.id }),
      });

      if (!response.ok) {
        throw new Error('Chyba při generování analýzy');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error: any) {
      console.error('Error generating analysis:', error);
      setError(error.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!analysis) {
    return (
      <Box textAlign="center" p={4}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Brain size={64} style={{ margin: '0 auto 1rem' }} />
          <Typography variant="h4" gutterBottom>
            Generujte svou AI analýzu
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Ještě jste nevygenerovali analýzu svých odpovědí. Claude AI analyzuje vaše odpovědi a najde vaše životní poslání.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, maxWidth: 500, mx: 'auto' }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            size="large"
            startIcon={generating ? <CircularProgress size={20} /> : <Sparkles size={20} />}
            onClick={generateAnalysis}
            disabled={generating}
          >
            {generating ? 'Generuji...' : 'Vygenerovat analýzu'}
          </Button>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Brain size={48} />
            <div>
              <Typography variant="h3" component="h1">
                Vaše životní poslání
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI analýza na základě vašich odpovědí
              </Typography>
            </div>
          </Box>

          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              startIcon={<Sparkles size={20} />}
              onClick={generateAnalysis}
              disabled={generating}
            >
              {generating ? 'Generuji...' : 'Regenerovat'}
            </Button>
            <Button variant="outlined" startIcon={<Download size={20} />}>
              Stáhnout PDF
            </Button>
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Hodnoty */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Heart size={24} />
                  <Typography variant="h6">Vaše hodnoty</Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {analysis.patterns.values.map((value, i) => (
                    <Chip key={i} label={value} color="error" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Dovednosti */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Target size={24} />
                  <Typography variant="h6">Vaše dovednosti</Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {analysis.patterns.skills.map((skill, i) => (
                    <Chip key={i} label={skill} color="primary" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Zájmy */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Sparkles size={24} />
                  <Typography variant="h6">Vaše zájmy</Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {analysis.patterns.interests.map((interest, i) => (
                    <Chip key={i} label={interest} color="success" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Motivace */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <TrendingUp size={24} />
                  <Typography variant="h6">Vaše motivace</Typography>
                </Box>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {analysis.patterns.motivations.map((motivation, i) => (
                    <Chip key={i} label={motivation} color="warning" variant="outlined" />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Doporučení */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Doporučení pro vás
        </Typography>
        <Grid container spacing={2}>
          {analysis.suggestions.map((suggestion, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Card>
                <CardContent>
                  <Chip label={suggestion.category} size="small" sx={{ mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    {suggestion.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {suggestion.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Spojitosti */}
      {analysis.connections.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Objevené spojitosti
          </Typography>
          {analysis.connections.map((connection, i) => (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ChevronDown size={20} />}>
                <Typography fontWeight="bold">{connection.theme}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {connection.items.map((item, j) => (
                    <Chip key={j} label={item} size="small" variant="outlined" />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}

      {/* Slepá místa */}
      {analysis.blind_spots.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Oblasti k zamyšlení
          </Typography>
          <Grid container spacing={2}>
            {analysis.blind_spots.map((spot, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Alert severity="info">
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    {spot.area}
                  </Typography>
                  <Typography variant="body2">{spot.description}</Typography>
                </Alert>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
