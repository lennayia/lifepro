import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { ArrowLeft, Grid3x3, Layers, MessageSquare } from 'lucide-react';
import AdminCategoriesTab from '@/components/admin/AdminCategoriesTab';
import AdminSectionsTab from '@/components/admin/AdminSectionsTab';
import AdminQuestionsTab from '@/components/admin/AdminQuestionsTab';

const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Zpět na dashboard
        </Button>

        <Typography variant="h3" gutterBottom>
          Administrace
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Správa kategorií, sekcí a otázek
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab
            icon={<Grid3x3 size={20} />}
            iconPosition="start"
            label="Kategorie"
            sx={{ textTransform: 'none', fontSize: 16 }}
          />
          <Tab
            icon={<Layers size={20} />}
            iconPosition="start"
            label="Sekce"
            sx={{ textTransform: 'none', fontSize: 16 }}
          />
          <Tab
            icon={<MessageSquare size={20} />}
            iconPosition="start"
            label="Otázky"
            sx={{ textTransform: 'none', fontSize: 16 }}
          />
        </Tabs>
      </Paper>

      <Paper sx={{ p: 3 }}>
        {activeTab === 0 && <AdminCategoriesTab />}
        {activeTab === 1 && <AdminSectionsTab />}
        {activeTab === 2 && <AdminQuestionsTab />}
      </Paper>
    </Container>
  );
};

export default AdminPage;
