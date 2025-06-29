import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Fab,
  Card,
  CardContent,
  Avatar,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Block,
  Person,
  Email,
  Phone,
  Business,
  AdminPanelSettings,
  Security,
  FilterList,
} from '@mui/icons-material';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
  avatar?: string;
  joinDate: string;
}

const mockUsers: User[] = [
  {
    id: 'USR-001',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@bayscom.com',
    phone: '+1-555-0101',
    department: 'Operations',
    role: 'Operations Manager',
    status: 'active',
    lastLogin: '2024-06-27 09:30',
    permissions: ['operations.read', 'operations.write', 'inventory.read'],
    joinDate: '2023-01-15'
  },
  {
    id: 'USR-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@bayscom.com',
    phone: '+1-555-0102',
    department: 'Finance',
    role: 'Finance Director',
    status: 'active',
    lastLogin: '2024-06-27 08:45',
    permissions: ['finance.read', 'finance.write', 'reports.read'],
    joinDate: '2022-08-20'
  },
  {
    id: 'USR-003',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@bayscom.com',
    phone: '+1-555-0103',
    department: 'HR',
    role: 'HR Manager',
    status: 'active',
    lastLogin: '2024-06-26 16:20',
    permissions: ['hr.read', 'hr.write', 'users.read'],
    joinDate: '2023-03-10'
  },
  {
    id: 'USR-004',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@bayscom.com',
    phone: '+1-555-0104',
    department: 'Procurement',
    role: 'Procurement Specialist',
    status: 'active',
    lastLogin: '2024-06-27 10:15',
    permissions: ['procurement.read', 'procurement.write', 'suppliers.read'],
    joinDate: '2023-11-05'
  },
  {
    id: 'USR-005',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'robert.wilson@bayscom.com',
    phone: '+1-555-0105',
    department: 'IT',
    role: 'System Administrator',
    status: 'active',
    lastLogin: '2024-06-27 07:30',
    permissions: ['admin.read', 'admin.write', 'users.write', 'system.config'],
    joinDate: '2022-05-18'
  },
  {
    id: 'USR-006',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@bayscom.com',
    phone: '+1-555-0106',
    department: 'Safety',
    role: 'Safety Officer',
    status: 'inactive',
    lastLogin: '2024-06-20 14:30',
    permissions: ['safety.read', 'safety.write'],
    joinDate: '2023-07-22'
  }
];

const roles = [
  'System Administrator',
  'Operations Manager',
  'Finance Director',
  'HR Manager',
  'Procurement Specialist',
  'Safety Officer',
  'Field Engineer',
  'Inventory Manager',
  'Logistics Coordinator'
];

const departments = [
  'Operations',
  'Finance',
  'HR',
  'Procurement',
  'IT',
  'Safety',
  'Logistics',
  'Engineering',
  'Environmental'
];

const statusColors = {
  active: 'success' as const,
  inactive: 'default' as const,
  suspended: 'error' as const,
};

const statusLabels = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function UserManagement() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleClickOpen = (user?: User) => {
    setSelectedUser(user || null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setTabValue(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredUsers = mockUsers.filter(user => {
    const departmentMatch = !filterDepartment || user.department === filterDepartment;
    const statusMatch = !filterStatus || user.status === filterStatus;
    return departmentMatch && statusMatch;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleClickOpen()}
          sx={{ borderRadius: 2 }}
        >
          Add New User
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h4">
              {mockUsers.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Active Users
            </Typography>
            <Typography variant="h4">
              {mockUsers.filter(user => user.status === 'active').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Inactive Users
            </Typography>
            <Typography variant="h4">
              {mockUsers.filter(user => user.status === 'inactive').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Departments
            </Typography>
            <Typography variant="h4">
              {new Set(mockUsers.map(user => user.department)).size}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <FilterList />
          <TextField
            select
            label="Filter by Department"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Filter by Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {getInitials(user.firstName, user.lastName)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">{user.email}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{user.phone}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business fontSize="small" color="action" />
                    <Typography variant="body2">{user.department}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusLabels[user.status]}
                    color={statusColors[user.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.lastLogin}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{user.joinDate}</Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleClickOpen(user)}>
                    <Visibility />
                  </IconButton>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="warning">
                    <Block />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Details/Create Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedUser ? `User Details - ${selectedUser.firstName} ${selectedUser.lastName}` : 'Create New User'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Basic Information" />
              <Tab label="Permissions" />
              <Tab label="Security" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: '1 1 250px' }}
                  label="First Name"
                  defaultValue={selectedUser?.firstName || ''}
                  variant="outlined"
                />
                <TextField
                  sx={{ flex: '1 1 250px' }}
                  label="Last Name"
                  defaultValue={selectedUser?.lastName || ''}
                  variant="outlined"
                />
              </Box>
              <TextField
                fullWidth
                label="Email Address"
                defaultValue={selectedUser?.email || ''}
                type="email"
                variant="outlined"
              />
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: '1 1 250px' }}
                  label="Phone Number"
                  defaultValue={selectedUser?.phone || ''}
                  variant="outlined"
                />
                <TextField
                  sx={{ flex: '1 1 250px' }}
                  select
                  label="Department"
                  defaultValue={selectedUser?.department || ''}
                  variant="outlined"
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: '1 1 250px' }}
                  select
                  label="Role"
                  defaultValue={selectedUser?.role || ''}
                  variant="outlined"
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  sx={{ flex: '1 1 250px' }}
                  select
                  label="Status"
                  defaultValue={selectedUser?.status || 'active'}
                  variant="outlined"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </TextField>
              </Box>
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security />
                User Permissions
              </Typography>
              <Divider />
              
              <Typography variant="subtitle2">Module Access</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['Dashboard', 'Procurement', 'Inventory', 'Finance', 'HR', 'Logistics', 'Reports', 'Administration'].map((module) => (
                  <FormControlLabel
                    key={module}
                    control={<Switch defaultChecked={selectedUser?.permissions.some(p => p.includes(module.toLowerCase())) || false} />}
                    label={`${module} Access`}
                  />
                ))}
              </Box>

              <Typography variant="subtitle2" sx={{ mt: 2 }}>Administrative Permissions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={<Switch defaultChecked={selectedUser?.permissions.includes('users.write') || false} />}
                  label="User Management"
                />
                <FormControlLabel
                  control={<Switch defaultChecked={selectedUser?.permissions.includes('system.config') || false} />}
                  label="System Configuration"
                />
                <FormControlLabel
                  control={<Switch defaultChecked={selectedUser?.permissions.includes('admin.write') || false} />}
                  label="Full Administrator Access"
                />
              </Box>
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AdminPanelSettings />
                Security Settings
              </Typography>
              <Divider />
              
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Require Password Change on Next Login"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Two-Factor Authentication"
              />
              <FormControlLabel
                control={<Switch />}
                label="Account Locked"
              />
              
              <TextField
                fullWidth
                label="Password Reset Token"
                placeholder="Auto-generated when password reset is requested"
                variant="outlined"
                disabled
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  sx={{ flex: '1 1 250px' }}
                  label="Last Login"
                  defaultValue={selectedUser?.lastLogin || ''}
                  variant="outlined"
                  disabled
                />
                <TextField
                  sx={{ flex: '1 1 250px' }}
                  label="Failed Login Attempts"
                  defaultValue="0"
                  variant="outlined"
                  disabled
                />
              </Box>
            </Stack>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {!selectedUser && (
            <>
              <Button variant="outlined">Save as Draft</Button>
              <Button variant="contained">Create User</Button>
            </>
          )}
          {selectedUser && (
            <Button variant="contained">Update User</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleClickOpen()}
      >
        <Add />
      </Fab>
    </Box>
  );
}
