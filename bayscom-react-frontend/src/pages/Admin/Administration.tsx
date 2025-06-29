import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Paper,
} from '@mui/material';
import {
  People,
  Settings,
  History,
  Security,
  Storage,
  Backup,
  Update,
  Notifications,
  ArrowForward,
  Warning,
  CheckCircle,
  Error,
  Info,
  Category,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface AdminCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  stats?: string;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  timestamp: string;
}

const adminModules: AdminCard[] = [
  {
    title: 'User Management',
    description: 'Manage user accounts, roles, and permissions',
    icon: <People />,
    path: '/admin/users',
    color: 'primary',
    stats: '24 Active Users'
  },
  {
    title: 'System Configuration',
    description: 'Configure system settings and preferences',
    icon: <Settings />,
    path: '/admin/config',
    color: 'secondary',
    stats: 'Last updated: Today'
  },
  {
    title: 'Item & Category Management',
    description: 'Manage items and categories for procurement and inventory',
    icon: <Category />,
    path: '/admin/item-categories',
    color: 'success',
    stats: 'Items: 15, Categories: 8'
  },
  {
    title: 'Audit Logs',
    description: 'View system activity and security logs',
    icon: <History />,
    path: '/admin/audit',
    color: 'info',
    stats: '1,247 Events Today'
  }
];

const quickActions = [
  { title: 'Create New User', icon: <People />, action: 'user-create' },
  { title: 'Backup Database', icon: <Backup />, action: 'backup' },
  { title: 'System Health Check', icon: <Security />, action: 'health-check' },
  { title: 'Export Audit Logs', icon: <History />, action: 'export-logs' },
  { title: 'Update System', icon: <Update />, action: 'update' },
  { title: 'Notification Settings', icon: <Notifications />, action: 'notifications' }
];

const systemAlerts: SystemAlert[] = [
  {
    id: 'alert-1',
    type: 'warning',
    title: 'Storage Space Low',
    description: 'System storage is 85% full. Consider archiving old data.',
    timestamp: '2024-06-27 10:30'
  },
  {
    id: 'alert-2',
    type: 'info',
    title: 'System Update Available',
    description: 'Version 2.1.3 is available with security improvements.',
    timestamp: '2024-06-27 09:15'
  },
  {
    id: 'alert-3',
    type: 'success',
    title: 'Backup Completed',
    description: 'Daily backup completed successfully at 02:00 AM.',
    timestamp: '2024-06-27 02:00'
  }
];

const systemStats = {
  uptime: '15 days, 8 hours',
  version: '2.1.2',
  lastBackup: '2024-06-27 02:00',
  activeUsers: 24,
  totalUsers: 32,
  diskUsage: 85,
  memoryUsage: 67,
  cpuUsage: 45
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle color="success" />;
    case 'warning':
      return <Warning color="warning" />;
    case 'error':
      return <Error color="error" />;
    default:
      return <Info color="info" />;
  }
};

const getAlertSeverity = (type: string): 'info' | 'warning' | 'error' | 'success' => {
  return type as 'info' | 'warning' | 'error' | 'success';
};

export default function Administration() {
  const navigate = useNavigate();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'user-create':
        navigate('/admin/users');
        break;
      case 'backup':
        // Handle backup action
        break;
      case 'health-check':
        // Handle health check
        break;
      default:
        console.log('Action:', action);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        System Administration
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Manage users, system configuration, and monitor system health
      </Typography>

      {/* System Status Overview */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          System Status Overview
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                System Uptime
              </Typography>
              <Typography variant="h6">
                {systemStats.uptime}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Users
              </Typography>
              <Typography variant="h6">
                {systemStats.activeUsers} / {systemStats.totalUsers}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                System Version
              </Typography>
              <Typography variant="h6">
                v{systemStats.version}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Last Backup
              </Typography>
              <Typography variant="h6">
                {systemStats.lastBackup}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Paper>

      {/* System Alerts */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          System Alerts
        </Typography>
        <Stack spacing={2}>
          {systemAlerts.map((alert) => (
            <Alert
              key={alert.id}
              severity={getAlertSeverity(alert.type)}
              action={
                <Button color="inherit" size="small">
                  Action
                </Button>
              }
            >
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {alert.title}
                </Typography>
                <Typography variant="body2">
                  {alert.description}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {alert.timestamp}
                </Typography>
              </Box>
            </Alert>
          ))}
        </Stack>
      </Box>

      {/* Admin Modules */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Administration Modules
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {adminModules.map((module) => (
            <Card key={module.title} sx={{ flex: '1 1 300px', minWidth: 300 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${module.color}.main` }}>
                    {module.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" component="h3">
                      {module.title}
                    </Typography>
                    {module.stats && (
                      <Chip label={module.stats} size="small" variant="outlined" />
                    )}
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {module.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate(module.path)}
                >
                  Open Module
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Paper>
          <List>
            {quickActions.map((action, index) => (
              <ListItem key={action.title} divider={index < quickActions.length - 1}>
                <ListItemIcon>
                  {action.icon}
                </ListItemIcon>
                <ListItemText primary={action.title} />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <ArrowForward />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Resource Usage */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Resource Usage
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Disk Usage
              </Typography>
              <Typography variant="h4" color={systemStats.diskUsage > 80 ? 'error' : 'primary'}>
                {systemStats.diskUsage}%
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Memory Usage
              </Typography>
              <Typography variant="h4" color={systemStats.memoryUsage > 80 ? 'warning' : 'primary'}>
                {systemStats.memoryUsage}%
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flex: '1 1 250px', minWidth: 250 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                CPU Usage
              </Typography>
              <Typography variant="h4" color="success.main">
                {systemStats.cpuUsage}%
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
