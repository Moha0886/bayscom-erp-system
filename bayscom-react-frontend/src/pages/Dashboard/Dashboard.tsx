import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  useTheme,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Inventory,
  People,
  AccountBalance,
} from '@mui/icons-material';

const recentActivities = [
  { id: 1, action: 'Purchase Order #PO-2024-001 approved', time: '2 hours ago', type: 'procurement' },
  { id: 2, action: 'Inventory count completed for Q2', time: '4 hours ago', type: 'inventory' },
  { id: 3, action: 'New employee onboarding started', time: '6 hours ago', type: 'hr' },
  { id: 4, action: 'Invoice #INV-2024-045 processed', time: '1 day ago', type: 'finance' },
  { id: 5, action: 'Shipment #SH-2024-012 delivered', time: '1 day ago', type: 'logistics' },
];

const pendingTasks = [
  { id: 1, task: 'Review supplier contracts', priority: 'high', dueDate: 'Today' },
  { id: 2, task: 'Approve budget allocation', priority: 'medium', dueDate: 'Tomorrow' },
  { id: 3, task: 'Update inventory records', priority: 'low', dueDate: 'This week' },
  { id: 4, task: 'Process payroll', priority: 'high', dueDate: 'Friday' },
];

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const isPositive = change > 0;
  
  return (
    <Card sx={{ height: '100%', minWidth: 250 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {isPositive ? <TrendingUp color="success" /> : <TrendingDown color="error" />}
              <Typography
                variant="body2"
                color={isPositive ? 'success.main' : 'error.main'}
                sx={{ ml: 0.5 }}
              >
                {Math.abs(change)}% from last month
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: color + '20',
              borderRadius: '50%',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Dashboard Overview
      </Typography>

      {/* Key Metrics */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <StatCard
          title="Total Purchase Orders"
          value="247"
          change={12.5}
          icon={<ShoppingCart sx={{ fontSize: 30, color: theme.palette.primary.main }} />}
          color={theme.palette.primary.main}
        />
        <StatCard
          title="Inventory Items"
          value="1,234"
          change={-2.1}
          icon={<Inventory sx={{ fontSize: 30, color: theme.palette.info.main }} />}
          color={theme.palette.info.main}
        />
        <StatCard
          title="Active Employees"
          value="156"
          change={8.3}
          icon={<People sx={{ fontSize: 30, color: theme.palette.success.main }} />}
          color={theme.palette.success.main}
        />
        <StatCard
          title="Monthly Budget"
          value="$2.4M"
          change={5.7}
          icon={<AccountBalance sx={{ fontSize: 30, color: theme.palette.warning.main }} />}
          color={theme.palette.warning.main}
        />
      </Stack>

      {/* Recent Activities and Tasks */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Recent Activities</Typography>
            </Box>
            <List>
              {recentActivities.map((activity) => (
                <ListItem key={activity.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={activity.action}
                    secondary={activity.time}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <Chip
                    label={activity.type}
                    size="small"
                    variant="outlined"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Pending Tasks</Typography>
            </Box>
            <List>
              {pendingTasks.map((task) => (
                <ListItem key={task.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={task.task}
                    secondary={task.dueDate}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <Chip
                    label={task.priority}
                    size="small"
                    color={
                      task.priority === 'high'
                        ? 'error'
                        : task.priority === 'medium'
                        ? 'warning'
                        : 'default'
                    }
                    sx={{ textTransform: 'capitalize' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
