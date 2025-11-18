import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { useTheme } from '@mui/material';

/**
 * Breadcrumbs - Universal breadcrumb navigation component
 *
 * Automatically generates breadcrumbs based on current route
 * Or uses custom breadcrumbs passed as prop
 *
 * @param {Array} customBreadcrumbs - Optional custom breadcrumbs [{ label, path }, ...]
 * @param {boolean} showHome - Show home icon (default: true)
 *
 * @example
 * // Auto-generated from route
 * <Breadcrumbs />
 *
 * // Custom breadcrumbs
 * <Breadcrumbs customBreadcrumbs={[
 *   { label: 'Dashboard', path: '/coach' },
 *   { label: 'Materiály', path: '/coach/materials' },
 *   { label: 'Detail materiálu' }
 * ]} />
 */
const Breadcrumbs = ({ customBreadcrumbs = null, showHome = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Route labels mapping (Czech)
  const routeLabels = {
    // Coach routes (when coach is logged in)
    'coach': 'Dashboard',
    'materials': 'Materiály',
    'programs': 'Programy',
    'clients': 'Klientky',
    'sessions': 'Sezení',
    'profile': 'Profil',
    'cards': 'Karty',
    'decks': 'Balíčky',

    // Tester routes
    'tester': 'Dashboard',
    'welcome': 'Vítejte',

    // Client routes
    'client': 'Dashboard',
    'daily': 'Denní úkol',
    'material': 'Materiál',
    'program': 'Program',
    'select-coach': 'Vybrat koučku',

    // Special pages
    'help': 'Nápověda',
  };

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Determine the dashboard path based on user type (first segment)
    const userType = pathSegments[0]; // 'client', 'coach', or 'tester'
    const dashboardPath = `/${userType}/dashboard`;

    // Add home if requested
    if (showHome && pathSegments.length > 0) {
      breadcrumbs.push({
        label: <Home size={16} />,
        path: dashboardPath, // Always go to dashboard, not just root
        isHome: true,
      });
    }

    // Build breadcrumbs from path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Skip first segment (userType: client/coach/tester) if home is shown
      if (showHome && index === 0) return;

      // Skip 'coach' segment when it's a path part (not the user type)
      // This handles /client/coach/admin-lenna -> skip 'coach' part
      if (segment === 'coach' && index > 0) return;

      // Special handling for dynamic routes (IDs)
      let label = routeLabels[segment] || segment;

      // If previous segment was 'coach', this is coach ID - show "Koučka"
      if (index > 0 && pathSegments[index - 1] === 'coach') {
        label = 'Koučka';
      }

      breadcrumbs.push({
        label,
        path: currentPath,
        isLast: index === pathSegments.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = customBreadcrumbs || generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <MuiBreadcrumbs
        separator={<ChevronRight size={14} />}
        sx={{
          '& .MuiBreadcrumbs-separator': {
            mx: 0.5,
            color: 'text.disabled',
          },
        }}
      >
        {breadcrumbs.map((crumb, index) => {
          const isLast = crumb.isLast || index === breadcrumbs.length - 1;

          if (isLast) {
            return (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {crumb.label}
              </Typography>
            );
          }

          return (
            <Link
              key={index}
              onClick={() => crumb.path && navigate(crumb.path)}
              sx={{
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.875rem',
                cursor: crumb.path ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s',
                '&:hover': crumb.path ? {
                  color: 'primary.main',
                  textDecoration: 'none',
                } : {},
              }}
            >
              {crumb.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
