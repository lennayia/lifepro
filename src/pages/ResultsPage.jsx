import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';

const ResultsPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Zpět na dashboard
        </Button>

        <Typography variant="h3" gutterBottom>
          Výsledky
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI analýza vašich odpovědí
        </Typography>
      </Box>

      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Funkce výsledků je ve vývoji
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Zde se zobrazí AI analýza vašich odpovědí, doporučení kariérních směrů a další insights
        </Typography>
      </Card>
    </Container>
  );
};

export default ResultsPage;
