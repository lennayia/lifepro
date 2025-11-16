/**
 * Homepage - LifePro
 * Landing page s představením aplikace
 */

'use client';

import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Brain, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0a0f0a 0%, #1a2410 100%)'
            : 'linear-gradient(135deg, #f5f5f0 0%, #e8f5e9 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={6} alignItems="center" textAlign="center">
          {/* Logo/Icon */}
          <Box
            component={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            }}
          >
            <Sparkles size={60} color="white" />
          </Box>

          {/* Hero Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Najděte své životní poslání
            </Typography>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                lineHeight: 1.8,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
              }}
            >
              Systematicky prozkoumejte, <strong>co vás baví</strong>, <strong>co umíte</strong> a{' '}
              <strong>čemu se chcete věnovat</strong>. Objevte práci, která vás naplní radostí.
            </Typography>
          </motion.div>

          {/* Features */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            sx={{ mt: 4 }}
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <FeatureCard
              icon={<Brain size={32} />}
              title="AI Analýza"
              description="Inteligentní vyhodnocení vašich odpovědí"
            />
            <FeatureCard
              icon={<Compass size={32} />}
              title="Systematický průzkum"
              description="Prozkoumejte všechny dimenze vašeho života"
            />
            <FeatureCard
              icon={<Heart size={32} />}
              title="Vaše poslání"
              description="Konkrétní doporučení a další kroky"
            />
          </Stack>

          {/* CTA Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ mt: 4 }}
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              component={Link}
              href="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={20} />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                background: (theme) =>
                  `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                },
              }}
            >
              Začít hned
            </Button>

            <Button
              component={Link}
              href="/login"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              Přihlásit se
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Box
      sx={{
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
        minWidth: 200,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
      }}
    >
      <Box
        sx={{
          color: 'primary.main',
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </Box>
  );
}
