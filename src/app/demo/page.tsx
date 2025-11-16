/**
 * Demo Page - LifePro FlipCard Showcase
 * Ukázka FlipCard komponent s kategoriemi
 */

'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  IconButton,
  Chip,
  LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import FlipCard from '@/shared/components/cards/FlipCard';
import { CATEGORY_GRADIENTS } from '@/shared/styles/modernEffects';
import { fadeInUp, staggerContainer, staggerItem } from '@/shared/styles/animations';
import {
  UserCircle,
  BookText,
  Wrench,
  SmilePlus,
  Moon,
  Sun,
  Heart,
  ArrowLeft,
} from 'lucide-react';
import useSoundFeedback from '@/shared/hooks/useSoundFeedback';
import { useThemeMode } from '@/shared/context/ThemeContext';
import Link from 'next/link';

// Kategorie z PDF
const CATEGORIES = [
  {
    id: 'jsem',
    title: 'JSEM',
    subtitle: 'Kdo jsem',
    description: 'Role v životě, sebepojetí, priority',
    Icon: UserCircle,
    gradient: CATEGORY_GRADIENTS.jsem,
    details: [
      '✓ Role v životě',
      '✓ Sebepojetí a sebereflexe',
      '✓ Aktuální priority',
      '✓ Momentální jsem...',
    ],
    progress: 75,
  },
  {
    id: 'vim',
    title: 'VÍM',
    subtitle: 'Co znám',
    description: 'Vzdělání, kurzy, zkušenosti',
    Icon: BookText,
    gradient: CATEGORY_GRADIENTS.vim,
    details: [
      '✓ Formální vzdělání',
      '✓ Kurzy a semináře',
      '✓ Samostudium',
      '✓ Certifikace',
    ],
    progress: 60,
  },
  {
    id: 'umim',
    title: 'UMÍM',
    subtitle: 'Co dokážu',
    description: 'Dovednosti, talenty, schopnosti',
    Icon: Wrench,
    gradient: CATEGORY_GRADIENTS.umim,
    details: [
      '✓ Práce hlavou',
      '✓ Práce rukama',
      '✓ Práce ústy',
      '✓ Jemné dovednosti',
    ],
    progress: 45,
  },
  {
    id: 'mamRad',
    title: 'MÁM RÁD/A',
    subtitle: 'Co mě baví',
    description: 'Zájmy, hodnoty, preference',
    Icon: SmilePlus,
    gradient: CATEGORY_GRADIENTS.mamRad,
    details: [
      '✓ Planeta a příroda',
      '✓ Život a vztahy',
      '✓ Věci a činnosti',
      '✓ Hodnoty',
    ],
    progress: 30,
  },
];

export default function DemoPage() {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const { playFlip, playClick } = useSoundFeedback({ volume: 0.3 });
  const { mode, toggleTheme } = useThemeMode();

  const handleCardFlip = (categoryId: string, isFlipped: boolean) => {
    playFlip();
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (isFlipped) {
        newSet.add(categoryId);
      } else {
        newSet.delete(categoryId);
      }
      return newSet;
    });
  };

  const totalProgress = CATEGORIES.reduce((sum, cat) => sum + cat.progress, 0) / CATEGORIES.length;

  return (
    <Box
      component={motion.div}
      {...fadeInUp}
      sx={{
        minHeight: '100vh',
        py: 6,
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)'
            : 'linear-gradient(135deg, #f5f5f0 0%, #e8f5e9 100%)',
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Stack spacing={4}>
          {/* Navigation */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <IconButton
              component={Link}
              href="/"
              onClick={() => playClick()}
              sx={{
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(255, 255, 255, 1)',
                },
              }}
            >
              <ArrowLeft size={20} />
            </IconButton>

            <IconButton
              onClick={() => {
                playClick();
                toggleTheme();
              }}
              sx={{
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
          </Stack>

          {/* Title */}
          <Box textAlign="center">
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 800,
                background: `linear-gradient(135deg, ${CATEGORY_GRADIENTS.default})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              FlipCard Demo
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Klikněte na karty pro otočení ✨
            </Typography>

            <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
              <Chip
                icon={<Heart size={16} />}
                label={`${flippedCards.size}/${CATEGORIES.length} prozkoumáno`}
                color="primary"
                variant="outlined"
              />
              <Chip label={`${Math.round(totalProgress)}% dokončeno`} color="success" variant="filled" />
            </Stack>

            {/* Progress Bar */}
            <Box sx={{ mt: 3, maxWidth: 400, mx: 'auto' }}>
              <LinearProgress
                variant="determinate"
                value={totalProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  background: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                }}
              />
            </Box>
          </Box>

          {/* Cards Grid */}
          <Box
            component={motion.div}
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <Grid container spacing={3}>
              {CATEGORIES.map((category) => (
                <Grid item xs={12} sm={6} md={6} key={category.id} component={motion.div} variants={staggerItem}>
                  <FlipCard
                    gradient={category.gradient}
                    minHeight={300}
                    onFlip={(isFlipped) => handleCardFlip(category.id, isFlipped)}
                    frontContent={
                      <CategoryFront
                        title={category.title}
                        subtitle={category.subtitle}
                        description={category.description}
                        Icon={category.Icon}
                        progress={category.progress}
                      />
                    }
                    backContent={
                      <CategoryBack
                        title={category.title}
                        details={category.details}
                        Icon={category.Icon}
                      />
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Instructions */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: (theme) =>
                `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              💡 <strong>Tip:</strong> Toto je ukázka FlipCard komponent s kategoriemi z PDF.
              <br />
              Každá karta má vlastní gradient, ikonu a sound feedback! 🎵
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

// Category Front Content
interface CategoryFrontProps {
  title: string;
  subtitle: string;
  description: string;
  Icon: React.ElementType;
  progress: number;
}

function CategoryFront({ title, subtitle, description, Icon, progress }: CategoryFrontProps) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ height: '100%', p: 3, textAlign: 'center', color: 'white' }}
    >
      <Icon size={64} strokeWidth={1.5} />
      <Box>
        <Typography variant="h3" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          {subtitle}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 300 }}>
        {description}
      </Typography>
      <Box sx={{ width: '100%', maxWidth: 200 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.2)',
            '& .MuiLinearProgress-bar': {
              background: 'rgba(255, 255, 255, 0.8)',
            },
          }}
        />
        <Typography variant="caption" sx={{ opacity: 0.7, mt: 0.5, display: 'block' }}>
          {progress}% dokončeno
        </Typography>
      </Box>
    </Stack>
  );
}

// Category Back Content
interface CategoryBackProps {
  title: string;
  details: string[];
  Icon: React.ElementType;
}

function CategoryBack({ title, details, Icon }: CategoryBackProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        height: '100%',
        p: 3,
        color: 'white',
        justifyContent: 'center',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Icon size={32} />
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
      </Stack>
      <Typography variant="h6" sx={{ opacity: 0.9 }}>
        Co prozkoumáme:
      </Typography>
      <Stack spacing={1}>
        {details.map((detail, index) => (
          <Typography key={index} variant="body1" sx={{ opacity: 0.9 }}>
            {detail}
          </Typography>
        ))}
      </Stack>
      <Typography
        variant="caption"
        sx={{
          opacity: 0.7,
          mt: 'auto',
          fontStyle: 'italic',
        }}
      >
        Klikněte pro návrat →
      </Typography>
    </Stack>
  );
}
