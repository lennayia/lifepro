import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { NotificationProvider } from '@shared/context/NotificationContext';
import { useState, useMemo } from 'react';

// Pages
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import DashboardPage from '@pages/DashboardPage';
import QuestionnairePage from '@pages/QuestionnairePage';
import QuestionnaireDetailPage from '@pages/QuestionnaireDetailPage';
import ResultsPage from '@pages/ResultsPage';
import ProfilePage from '@pages/ProfilePage';
import AdminPage from '@pages/AdminPage';

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

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPage />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
