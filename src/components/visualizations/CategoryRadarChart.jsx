import { Paper, Typography, Box } from '@mui/material';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const CategoryRadarChart = ({ categories }) => {
  // Transform data for radar chart
  const chartData = categories.map(cat => ({
    category: cat.title.length > 15 ? cat.title.substring(0, 15) + '...' : cat.title,
    fullName: cat.title,
    completion: cat.percentage || 0,
    icon: cat.icon,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1.5, bgcolor: 'background.paper' }}>
          <Typography variant="body2" fontWeight={600}>
            {payload[0].payload.icon} {payload[0].payload.fullName}
          </Typography>
          <Typography variant="body2" color="primary">
            Dokončeno: {payload[0].value}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Radar Graf - Pokrok po Kategoriích
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Vizualizace vašeho pokroku napříč všemi oblastmi života
      </Typography>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
          />
          <Radar
            name="Dokončení (%)"
            dataKey="completion"
            stroke="#1976d2"
            fill="#1976d2"
            fillOpacity={0.6}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CategoryRadarChart;
