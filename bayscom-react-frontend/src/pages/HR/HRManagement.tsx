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
  Button,
  Stack,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  People,
  Work,
  Schedule,
  TrendingUp,
} from '@mui/icons-material';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
}

const mockEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'John Smith',
    email: 'john.smith@bayscom.com',
    phone: '+1-555-0123',
    department: 'Engineering',
    position: 'Senior Engineer',
    salary: 95000,
    hireDate: '2022-03-15',
    status: 'active'
  },
  {
    id: 'EMP-002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@bayscom.com',
    phone: '+1-555-0124',
    department: 'Procurement',
    position: 'Procurement Manager',
    salary: 85000,
    hireDate: '2021-08-20',
    status: 'active'
  },
  {
    id: 'EMP-003',
    name: 'Mike Wilson',
    email: 'mike.wilson@bayscom.com',
    phone: '+1-555-0125',
    department: 'Operations',
    position: 'Operations Supervisor',
    salary: 75000,
    hireDate: '2023-01-10',
    status: 'on-leave'
  },
  {
    id: 'EMP-004',
    name: 'Lisa Brown',
    email: 'lisa.brown@bayscom.com',
    phone: '+1-555-0126',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 70000,
    hireDate: '2022-11-05',
    status: 'active'
  },
  {
    id: 'EMP-005',
    name: 'David Garcia',
    email: 'david.garcia@bayscom.com',
    phone: '+1-555-0127',
    department: 'Safety',
    position: 'Safety Coordinator',
    salary: 65000,
    hireDate: '2023-04-12',
    status: 'active'
  },
];

const statusColors = {
  active: 'success' as const,
  inactive: 'error' as const,
  'on-leave': 'warning' as const,
};

export default function HRManagement() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredEmployees = employees.filter(emp => {
    const deptMatch = filterDepartment === 'all' || emp.department === filterDepartment;
    const statusMatch = filterStatus === 'all' || emp.status === filterStatus;
    return deptMatch && statusMatch;
  });

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const averageSalary = employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length;
  const onLeaveCount = employees.filter(emp => emp.status === 'on-leave').length;

  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Human Resources
      </Typography>

      {/* HR Summary Cards */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Employees
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {totalEmployees}
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                  {activeEmployees} active
                </Typography>
              </Box>
              <People sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Average Salary
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  ${averageSalary.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUp color="success" sx={{ fontSize: 16 }} />
                  <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                    5.2% increase
                  </Typography>
                </Box>
              </Box>
              <Work sx={{ fontSize: 40, color: 'success.main' }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  On Leave
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {onLeaveCount}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  employees
                </Typography>
              </Box>
              <Schedule sx={{ fontSize: 40, color: 'warning.main' }} />
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Filters and Actions */}
      <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2}>
          <TextField
            select
            label="Department"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Departments</MenuItem>
            {departments.map(dept => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="on-leave">On Leave</MenuItem>
          </TextField>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined">
            Export Report
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            Add Employee
          </Button>
        </Stack>
      </Stack>

      {/* Employees Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Hire Date</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Typography sx={{ fontWeight: 'medium' }}>
                      {employee.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{new Date(employee.hireDate).toLocaleDateString()}</TableCell>
                <TableCell>${employee.salary.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={employee.status.replace('-', ' ').toUpperCase()}
                    color={statusColors[employee.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Visibility />
                  </IconButton>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
