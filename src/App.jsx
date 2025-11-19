import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, CircularProgress } from '@mui/material';
import { NotificationProvider } from '@shared/context/NotificationContext';
import { useState, useMemo, lazy, Suspense } from 'react';

// Eager load auth pages (needed immediately)
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';

// Lazy load other pages for better performance
const DashboardPage = lazy(() => import('@pages/DashboardPage'));
const QuestionnairePage = lazy(() => import('@pages/QuestionnairePage'));
const QuestionnaireDetailPage = lazy(() => import('@pages/QuestionnaireDetailPage'));
const ResultsPage = lazy(() => import('@pages/ResultsPage'));
const ProfilePage = lazy(() => import('@pages/ProfilePage'));
const AdminPage = lazy(() => import('@pages/AdminPage'));
const HelpPage = lazy(() => import('@pages/HelpPage'));

// Loading fallback component
const LoadingFallback = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress />
  </Box>
);

// Theme
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#8fbc8f' : '#556b2f',
      light: '#a8d5a8',
      dark: '#3d5229',
    },
    secondary: {
      main: mode === 'dark' ? '#9ccc65' : '#7cb342',
      light: '#cfff95',
      dark: '#689f38',
    },
    background: {
      default: mode === 'dark' ? '#0a0f0a' : '#f5f5f5',
      paper: mode === 'dark' ? '#1a2410' : '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/questionnaire" element={<QuestionnairePage />} />
              <Route path="/questionnaire/:categorySlug" element={<QuestionnaireDetailPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/help" element={<HelpPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminPage />} />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
