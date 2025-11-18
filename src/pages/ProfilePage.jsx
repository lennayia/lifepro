import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
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
          Profil
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upravte své osobní údaje
        </Typography>
      </Box>

      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Funkce profilu je ve vývoji
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Zde budete moci upravit své osobní údaje, nastavení a preference
        </Typography>
      </Card>
    </Container>
  );
};

export default ProfilePage;
