import { Box, Typography, Link, Stack } from '@mui/material';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 3, sm: 4 },
        textAlign: 'center',
      }}
    >
      <Stack spacing={1.5} alignItems="center">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 0.5, sm: 2 }}
          alignItems="center"
          divider={
            <Box
              sx={{
                display: { xs: 'none', sm: 'block' },
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                bgcolor: 'text.disabled',
              }}
            />
          }
        >
          <Link
            href="/privacy-policy"
            underline="hover"
            sx={{
              fontSize: '0.8rem',
              color: 'text.primary',
              fontWeight: 500,
              transition: 'color 0.2s',
              '&:hover': { color: 'primary.main' },
            }}
          >
            Ochrana údajů
          </Link>

          <Link
            href="/terms-of-service"
            underline="hover"
            sx={{
              fontSize: '0.8rem',
              color: 'text.primary',
              fontWeight: 500,
              transition: 'color 0.2s',
              '&:hover': { color: 'primary.main' },
            }}
          >
            Obchodní podmínky
          </Link>

          <Link
            href="mailto:lenna@online-byznys.cz"
            underline="hover"
            sx={{
              fontSize: '0.8rem',
              color: 'text.primary',
              fontWeight: 500,
              transition: 'color 0.2s',
              '&:hover': { color: 'primary.main' },
            }}
          >
            Kontakt
          </Link>

          <Link
            href="https://online-byznys.cz"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              fontSize: '0.8rem',
              color: 'text.primary',
              fontWeight: 500,
              transition: 'color 0.2s',
              '&:hover': { color: 'primary.main' },
            }}
          >
            online-byznys.cz
          </Link>
        </Stack>

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            fontSize: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            flexWrap: 'nowrap',
            maxWidth: '100%',
          }}
        >
          Vytvořeno s <Heart size={12} fill="currentColor" strokeWidth={0} /> pro koučky a kouče
        </Typography>

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: '0.65rem' }}
        >
          © {currentYear} CoachProApp,{' '}
          <Link
            href="https://online-byznys.cz"
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{
              color: 'text.disabled',
              fontWeight: 600,
              transition: 'color 0.2s',
              '&:hover': { color: 'primary.main' },
            }}
          >
            online-byznys.cz
          </Link>
          {' '}a Claude Code
        </Typography>
      </Stack>
    </Box>
  );
};

export default Footer;
