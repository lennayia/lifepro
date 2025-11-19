import { Paper, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const CategoryBarChart = ({ categories }) => {
  // Transform data for bar chart
  const chartData = categories.map(cat => ({
    name: cat.icon || cat.title.substring(0, 3),
    fullName: cat.title,
    answered: cat.answeredQuestions || 0,
    total: cat.totalQuestions || 0,
    percentage: cat.percentage || 0,
  }));

  const getBarColor = (percentage) => {
    if (percentage === 100) return '#2e7d32'; // green
    if (percentage >= 75) return '#4caf50'; // light green
    if (percentage >= 50) return '#ff9800'; // orange
    if (percentage >= 25) return '#fb8c00'; // dark orange
    return '#f44336'; // red
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 1.5, bgcolor: 'background.paper' }}>
          <Typography variant="body2" fontWeight={600}>
            {data.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Zodpovězeno: {data.answered} / {data.total}
          </Typography>
          <Typography variant="body2" color="primary">
            Pokrok: {data.percentage}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Porovnání Kategorií
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Počet zodpovězených otázek v každé kategorii
      </Typography>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 14 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="answered" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CategoryBarChart;
