import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Stack,
  Card,
  CardContent,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  FilterList,
  Download,
  Refresh,
  Visibility,
  Search,
  CalendarToday,
  Person,
  Computer,
  Security,
  Warning,
  Info,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: string;
  module: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  details: string;
  result: 'success' | 'failure';
}

const mockAuditLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2024-06-27 10:30:15',
    user: 'John Smith',
    userId: 'USR-001',
    action: 'CREATE',
    module: 'Procurement',
    resourceType: 'Purchase Order',
    resourceId: 'PO-2024-006',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'info',
    details: 'Created new purchase order for drilling equipment',
    result: 'success'
  },
  {
    id: 'LOG-002',
    timestamp: '2024-06-27 10:25:42',
    user: 'Sarah Johnson',
    userId: 'USR-002',
    action: 'UPDATE',
    module: 'Finance',
    resourceType: 'Budget',
    resourceId: 'BUD-2024-Q2',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    severity: 'info',
    details: 'Updated Q2 budget allocation for operations department',
    result: 'success'
  },
  {
    id: 'LOG-003',
    timestamp: '2024-06-27 10:20:33',
    user: 'System',
    userId: 'SYSTEM',
    action: 'LOGIN_ATTEMPT',
    module: 'Authentication',
    resourceType: 'User Session',
    resourceId: 'unknown_user',
    ipAddress: '203.0.113.5',
    userAgent: 'curl/7.68.0',
    severity: 'warning',
    details: 'Failed login attempt with invalid credentials',
    result: 'failure'
  },
  {
    id: 'LOG-004',
    timestamp: '2024-06-27 10:15:22',
    user: 'Michael Brown',
    userId: 'USR-003',
    action: 'DELETE',
    module: 'HR',
    resourceType: 'Employee Record',
    resourceId: 'EMP-2024-015',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'warning',
    details: 'Deleted terminated employee record',
    result: 'success'
  },
  {
    id: 'LOG-005',
    timestamp: '2024-06-27 10:10:18',
    user: 'Robert Wilson',
    userId: 'USR-005',
    action: 'CONFIG_CHANGE',
    module: 'Administration',
    resourceType: 'System Configuration',
    resourceId: 'CONFIG-SECURITY',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    severity: 'critical',
    details: 'Modified security settings - enabled two-factor authentication',
    result: 'success'
  },
  {
    id: 'LOG-006',
    timestamp: '2024-06-27 10:05:45',
    user: 'Emily Davis',
    userId: 'USR-004',
    action: 'EXPORT',
    module: 'Procurement',
    resourceType: 'Supplier Data',
    resourceId: 'EXPORT-2024-0627',
    ipAddress: '192.168.1.104',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'info',
    details: 'Exported supplier list to CSV format',
    result: 'success'
  },
  {
    id: 'LOG-007',
    timestamp: '2024-06-27 09:58:12',
    user: 'System',
    userId: 'SYSTEM',
    action: 'BACKUP',
    module: 'System',
    resourceType: 'Database',
    resourceId: 'BACKUP-20240627',
    ipAddress: '127.0.0.1',
    userAgent: 'System Process',
    severity: 'info',
    details: 'Automated daily database backup completed successfully',
    result: 'success'
  },
  {
    id: 'LOG-008',
    timestamp: '2024-06-27 09:45:33',
    user: 'Lisa Anderson',
    userId: 'USR-006',
    action: 'VIEW',
    module: 'Safety',
    resourceType: 'Incident Report',
    resourceId: 'INC-2024-003',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
    severity: 'info',
    details: 'Viewed safety incident report for offshore platform',
    result: 'success'
  }
];

const severityColors = {
  info: 'info' as const,
  warning: 'warning' as const,
  error: 'error' as const,
  critical: 'error' as const,
};

const severityIcons = {
  info: <Info />,
  warning: <Warning />,
  error: <ErrorIcon />,
  critical: <ErrorIcon />,
};

const resultColors = {
  success: 'success' as const,
  failure: 'error' as const,
};

export default function AuditLogs() {
  const [filterModule, setFilterModule] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredLogs = mockAuditLogs.filter(log => {
    const moduleMatch = !filterModule || log.module === filterModule;
    const severityMatch = !filterSeverity || log.severity === filterSeverity;
    const userMatch = !filterUser || log.user.toLowerCase().includes(filterUser.toLowerCase());
    // Date filtering would be implemented here
    return moduleMatch && severityMatch && userMatch;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('');
  };

  const modules = Array.from(new Set(mockAuditLogs.map(log => log.module)));
  const users = Array.from(new Set(mockAuditLogs.map(log => log.user).filter(user => user !== 'System')));

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Audit Logs
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => {}}
          >
            Export Logs
          </Button>
        </Stack>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Events Today
            </Typography>
            <Typography variant="h4">
              {mockAuditLogs.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Failed Actions
            </Typography>
            <Typography variant="h4" color="error">
              {mockAuditLogs.filter(log => log.result === 'failure').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Critical Events
            </Typography>
            <Typography variant="h4" color="error">
              {mockAuditLogs.filter(log => log.severity === 'critical').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Users
            </Typography>
            <Typography variant="h4">
              {new Set(mockAuditLogs.filter(log => log.user !== 'System').map(log => log.userId)).size}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          Filter Logs
        </Typography>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              sx={{ flex: '1 1 200px' }}
              select
              label="Module"
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              size="small"
            >
              <MenuItem value="">All Modules</MenuItem>
              {modules.map((module) => (
                <MenuItem key={module} value={module}>{module}</MenuItem>
              ))}
            </TextField>
            <TextField
              sx={{ flex: '1 1 180px' }}
              select
              label="Severity"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              size="small"
            >
              <MenuItem value="">All Severities</MenuItem>
              <MenuItem value="info">Info</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="error">Error</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </TextField>
            <TextField
              sx={{ flex: '1 1 200px' }}
              label="Search User"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              sx={{ flex: '1 1 200px' }}
              label="From Date"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              sx={{ flex: '1 1 200px' }}
              label="To Date"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Audit Logs Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Details</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize="small" color="action" />
                    <Typography variant="body2">{log.timestamp}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {log.user === 'System' ? (
                      <Avatar sx={{ bgcolor: 'grey.500', width: 32, height: 32 }}>
                        <Computer fontSize="small" />
                      </Avatar>
                    ) : (
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        {getInitials(log.user)}
                      </Avatar>
                    )}
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {log.user}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {log.userId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={log.action}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{log.module}</Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {log.resourceType}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {log.resourceId}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={severityIcons[log.severity]}
                    label={log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                    color={severityColors[log.severity]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={log.result.charAt(0).toUpperCase() + log.result.slice(1)}
                    color={resultColors[log.result]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontFamily="monospace">
                    {log.ipAddress}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title={log.details} arrow>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        maxWidth: 200, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {log.details}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
